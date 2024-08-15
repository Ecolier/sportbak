import fs from 'fs-extra';
import _path from 'path'
import request  from 'request'
import externalUrlsConfig from '../config/externalUrls.config';
import resourcesConfig from '../config/resources.config';
import Config from '../models/config.model';
import ContextService from './context.service';
import { PicturesService } from './picture.service';
import SportbakService from './sportbak.service';
import ws, { OpenEvent } from 'ws';

import { Canvas, createCanvas, Image, loadImage, NodeCanvasRenderingContext2D, registerFont } from 'canvas';
import assetsConfig from '../config/assets.config';
import OverlayMetadata, { OverlayMetadataObject } from '../models/overlay.metadata.model';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { stream2buffer } from '../utils/utilities';
import videoConfig from '../config/video.config';

// Fonts must be loaded from the filesystem
registerFont(assetsConfig.path + "/" + assetsConfig.fonts.BIG_NOODLE, { family: 'BigNoodleTitling', weight: 'normal' });

interface Rectangle {
    x : number;
    y : number;
    width : number;
    height : number;
}

const wsOptions = {
    WebSocket: ws, // custom WebSocket constructor
    connectionTimeout: 1000
};

const animationDuration = 5000;

export class OverlayService {
    private ressourcesPath : string;
    private resourcesOverlayPath : string;
    public context : ContextService;

    private metadata : OverlayMetadata;

    private animationTimeout : NodeJS.Timeout = null;

    private socket : ReconnectingWebSocket;

    private ctx : NodeCanvasRenderingContext2D;
    private canvas : Canvas;
    private imagesCached : any = {};

    private test = 0;

    constructor(context : ContextService){
        this.context = context;
        this.ressourcesPath = resourcesConfig.path;
        this.resourcesOverlayPath = this.ressourcesPath + '/' + resourcesConfig.overlay.directory;
        if (!fs.existsSync(this.resourcesOverlayPath)) {
            fs.mkdirSync(this.resourcesOverlayPath);
        }
        this.ctx = this.getCanvasContextCleared();
        this.connect(videoConfig.service_url + '/overlay');
        this.metadata = this.readOverlayMetadata();
        this.clearActions();
        this.generate(this.metadata, false, false, false);
    }

    // ----------------------------- //
    // ----------- SOCKET ---------- //
    // ----------------------------- //

    connect(serviceUrl : string) {
        this.socket = new ReconnectingWebSocket(serviceUrl, [], wsOptions);
    }

    // ----------------------------- //
    // ----------- IMAGES ---------- //
    // ----------------------------- //

    async reloadImages() {
        const config = this.context.configService.read();
        const sportbakService = this.context.sportbakService;

        await this.reloadTopRightLogo(config, sportbakService);
        /*try {
            await this.draw();
        }catch(err) {
            console.log("ERROR DRAW : ", err);
        }*/
        /*setInterval(async ()=> {
            const now = new Date();
            this.test ++;
            await this.draw();   
            console.log("Time : " + (new Date().getTime() - now.getTime()))
        }, 1000);*/
        this.metadata = this.readOverlayMetadata();
        await this.generate(this.metadata, true, true, true); 
        
    }

    private async reloadTopRightLogo(config : Config, sportbakService : SportbakService) {
        let url = null;
        const customTopRightLogo = config.overlay?.customTopRightLogo;
        if (customTopRightLogo?.trim().length) {
            url = customTopRightLogo;
        } else {
            const complex = sportbakService.complex;
            if (complex?.logo?.trim().length) {
                url = externalUrlsConfig.staticSportbak + "/images/complexes/logos/alpha/" + complex?.logo;
            }
        }

        //console.log("OVERLAY SERVICE - reload image top right - url : " + url);
        const filename = resourcesConfig.overlay.images.topRight.filename;
        if (url) {
            await PicturesService.saveBase64FromUrlWithMaximumSize(url, this.resourcesOverlayPath, filename, 200, 200);
        } else {
            // remove current image if exist
            const path = this.resourcesOverlayPath + '/' + filename + ".png";
            if (fs.existsSync(path)) {
                try {
                    fs.removeSync(path);
                } catch (err) {}
            }
        }
    }

    // ----------------------------- //
    // ----------- CANVAS ---------- //
    // ----------------------------- //

    private getCanvasContextCleared() : NodeCanvasRenderingContext2D {
        const metadata = this.readOverlayMetadata();
        const w = metadata.width;
        const h = metadata.height;
        let createNew = true;
        if (this.ctx) {
            if (this.canvas.width == w && this.canvas.height == h) {
                this.ctx.clearRect(0, 0, w, h);
                createNew = false;
            }
        }
        if (createNew) {
            console.log("Recreate new canvas and context : " + w + " * " + h);
            this.canvas = createCanvas(w, h);
            this.ctx = this.canvas.getContext('2d');
        }
        return this.ctx;
    }

    // ----------------------------- //
    // ----------- METADATA ---------- //
    // ----------------------------- //

    private readOverlayMetadata() : OverlayMetadata {
        let result : OverlayMetadata = null;
        const path = assetsConfig.path + '/' + assetsConfig.json.OVERLAY_METADATA;
        try {
            if (fs.existsSync(path)) {
                let content = fs.readFileSync(path, 'utf8');
                //console.log("Content : ", content)
                if (content.trim().length) {
                    result = JSON.parse(content) as OverlayMetadata;
                    if (!result?.redraw) {
                        result = null;
                    }
                }
            }
        } catch(err) {
            result = null;
        }

        return result;
    }

    private cloneMetadata(metadata : OverlayMetadata) : OverlayMetadata {
        return JSON.parse(JSON.stringify(metadata));
    }

    private getMetadataObjectFromId(metadata : OverlayMetadata, id : string) : OverlayMetadataObject {
        let result = null;
        if (metadata && metadata.objects) {
            result = metadata.objects.find((o) => o.id == id);
        }
        return result;
    }

    // ----------------------------- //
    // ----------- DRAW ---------- //
    // ----------------------------- //

    private getFormatedRectangleFromParent(parent : Rectangle, data : OverlayMetadataObject, image : Image = null) : Rectangle {
        let rect : Rectangle = { x : 0, y : 0, width : 0, height : 0};
        const keepRatioImg = data.size.keep_image_ratio && image;
        if (data.size.width) {
            rect.width = data.size.width_percentage ? data.size.width * parent.width : data.size.width;
        } 
        if (data.size.height) {
            rect.height = data.size.height_percentage ? data.size.height * parent.height : data.size.height;
        }

        if (keepRatioImg) {
            const imgRatio = image.width / image.height;
            if (data.size.width) { 
                rect.height = rect.width / imgRatio;
            } else if (data.size.height) {
                rect.width = rect.height * imgRatio;
            } else {
                rect.width = image.width;
                rect.height = image.height;
            }
        }

        if (data.size.ratio_width_on_height) {
            if (data.size.width) { 
                rect.height = rect.width / data.size.ratio_width_on_height;
            } else if (data.size.height) {
                rect.width = rect.height * data.size.ratio_width_on_height;
            }
        }
        rect.x = parent.x + data.position.x + data.origin.external.x * parent.width - data.origin.internal.x * rect.width;
        rect.y = parent.y + data.position.y + data.origin.external.y * parent.height - data.origin.internal.y * rect.height;
        return rect;
    }

    private formRectangle(rect : Rectangle) : Rectangle {
        return { x : Math.ceil(rect.x), y : Math.ceil(rect.y), width : Math.ceil(rect.width), height : Math.ceil(rect.height)}
    }

    private async getImage(data : OverlayMetadataObject) {
        let result = null;
        if (data.image) {
            let path = data.image.replace('${assets}', assetsConfig.path).replace('${resources}', resourcesConfig.path)
            result = this.imagesCached[path] || await loadImage(path);
            if (result) {
                this.imagesCached[path] = result;
            }
        }
        return result;
    }

    private drawText(ctx, rect : Rectangle, text : string, font : string = null, fontSize : number = null, fontColor : string = null, draw : boolean = true) {
        fontSize = (fontSize || 20);
        ctx.font = "" + fontSize + "px " + (font || "Arial");
        ctx.fillStyle = fontColor || "black";
        const mesure = ctx.measureText(text);
        const realWidth = mesure.width || 0;
        const realHeight = mesure.height || 2*fontSize/3;
        const x = rect.x + Math.ceil((rect.width - realWidth) / 2);
        const y = rect.y + Math.ceil((rect.height + realHeight) /2);
        const metadata = {
            left : rect.x,
            top: rect.y,
            width : rect.width,
            height : rect.height,
            font : font,
            fontsize : fontSize,
            fontcolor : fontColor,
            text: text
        }
        if (draw)
            ctx.fillText(text/* + "-" + this.test*/, x, y);
        return metadata;
    }

    async drawObject(ctx, parent : Rectangle, data : OverlayMetadataObject, drawChildren = true, draw = true) {
        let metadata = [];
        try {
            const img = draw ? await this.getImage(data) : null;
            const rect = this.formRectangle(this.getFormatedRectangleFromParent(parent, data, img));
            const text = data.text;

            if (data.visible) {
                if (draw && (data.background_color || data.line_width)) {
                    ctx.beginPath();
                    ctx.rect(rect.x, rect.y, rect.width, rect.height);
                    if (data.line_width) {
                        ctx.lineWidth = data.line_width;
                        ctx.strokeStyle = data.stroke_color || "black";
                        ctx.stroke();
                    }
                    if (data.background_color) {
                        ctx.fillStyle = data.background_color;
                        ctx.fill();
                    }
                }
                if (img) {
                    let currMetadata = {
                        id : data.id,
                        type : "image"
                    }
                    metadata.push(currMetadata);
                    if (draw) {
                        ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height);
                    }
                }
                if ('text' in data && data.text != null) {
                    let currMetadata : any = this.drawText(ctx, rect, text, data.font, data.font_size, data.font_color, draw);                
                    currMetadata.id = data.id;
                    currMetadata.type = "text";
                    metadata.push(currMetadata)
                }
            }

            if (drawChildren && data.children?.length) {
                for (let child of data.children) {
                    if (child.enabled) {
                        let currMetadatas : any = await this.drawObject(ctx, rect, child, draw);
                        metadata.push(...currMetadatas);
                    }
                }
            }
        } catch(err) {
            throw err;
        }    
        return metadata;
    }

    async generate(metadata : OverlayMetadata, draw=true, sendsocket=true, savefile=false, temporary=false) {
        const ctx = this.getCanvasContextCleared();
        const w = metadata.width;
        const h = metadata.height;
        const parentRect = {x : 0, y : 0, width : w, height : h};

        let buildedMetadata = {
            width : w,
            height : h,
            objects : []
        };
        for (let o of metadata.objects) {
            if (o.enabled) {
                const metadata = await this.drawObject(ctx, parentRect, o, true, draw);   
                buildedMetadata.objects.push(...metadata);
            }
        }
        if (!temporary && savefile) {
            this.saveBuildedMetadata(buildedMetadata);
        }

        if (draw) {
            // Save file
            if (savefile) {
                let path = this.resourcesOverlayPath + '/' + resourcesConfig.overlay.images.build.filename + '.png';
                if (temporary) {
                    path = this.resourcesOverlayPath + '/' + resourcesConfig.overlay.images.temporary.filename + '.png';
                }
                console.log("Path : " + path);
                await new Promise((resolve) => {
                    const out = fs.createWriteStream(path)
                    this.canvas.createPNGStream().pipe(out)
                    out.on('finish', () => {
                        resolve(null);
                    });
                });
            }

            // Send by socket
            if (sendsocket) {
                if (this.socket.readyState == ReconnectingWebSocket.OPEN) {
                    console.log("Send overlay on socket ...");
                    try {
                        const buffer = await stream2buffer(this.canvas.createPNGStream());
                        console.log("Buffer created- sending - " + buffer.length);
                        this.socket.send(buffer);
                    } catch(err) {}            
                }
            }
        }

    }

    // ----------------------------- //
    // - BUILD METADATA FOR EXTERNAL - //
    // ----------------------------- //

    private saveBuildedMetadata(metadata) {
        const path = this.resourcesOverlayPath + '/' + 'overlay_builded_metadata.json';
        fs.writeFileSync(path, JSON.stringify(metadata, null, 2));
    }

    // ----------------------------- //
    // ----------- ACTIONS ---------- //
    // ----------------------------- //

    private showObj(id : string, cleanAfter : number = -1) {
        if (id) {
            let metadata = this.cloneMetadata(this.metadata);
            let obj = this.getMetadataObjectFromId(metadata, id);
            if (obj) {
                obj.visible = true;
                this.generate(metadata, true, true, true, true);
                if (cleanAfter >= 0) {
                    if (this.animationTimeout != null) {
                        global.clearTimeout(this.animationTimeout)
                        this.animationTimeout = null;
                    }
                    this.clearActions(animationDuration)
                } 
            }
        }
    }

    public clearActions(afterDelay = 0) {
        let clear = () => {
            console.log("Overlay cleared !!");
            let path = this.resourcesOverlayPath + '/' + resourcesConfig.overlay.images.temporary.filename + '.png';
            if (fs.existsSync(path)) {
                try {
                    fs.removeSync(path);
                } catch (err) {}
            }
            this.generate(this.metadata);
        }
        if (afterDelay > 0) {
            this.animationTimeout = setTimeout(() => {
                clear()
            }, afterDelay);
        } else {
            clear();
        }
    }

    public startSession() {
        // nothing for now
    }

    public pauseSession() {
        this.showObj("pause");
    }

    public restartSession() {
        this.clearActions();
    }

    public resetSession() {
        // nothing for now
    }

    public addGoal() {
        console.log("Overlay draw goal !!!")
        this.showObj("goal", animationDuration);
    }

    public addGoalTeam1() {
        this.addGoal()
    }

    public addGoalTeam2() {
        this.addGoal()
    }

    public buzz() {
        this.showObj("buzz", animationDuration);
    }

    public var() {
        this.showObj("var", animationDuration);
    }

    public stopSession() {
        // nothing for now
    }
}