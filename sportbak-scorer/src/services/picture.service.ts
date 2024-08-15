import fs from 'fs'
import _path from 'path'
import request  from 'request'


import sharp from 'sharp'
import _isBase64 from 'is-base64'
import sizeOf from 'image-size'
import base64Img from 'base64-img'

export abstract class PicturesService {

    // ---------------------------------------------  //
    // ---------------------------------------------  //
    // --------------  SAVE -------------  //
    // ---------------------------------------------  //
    // ---------------------------------------------  //

    static async saveBase64(base64 : string, path : string, name : string) : Promise<string> {
        return new Promise((resolve) => {
            base64Img.img(base64, path, name, function (err, filepath) {
                if (err) {
                    resolve(null);
                    return;
                }
                resolve(filepath);
            })
        })
        
    }

    // ---------------------------------------------  //
    // ---------------------------------------------  //
    // --------------  BASE64 FROM URL -------------  //
    // ---------------------------------------------  //
    // ---------------------------------------------  //

    static async getBase64FromUrl(url : string) : Promise<string> {
        return await new Promise((resolve) => {
            let requestWithEncoding = request.defaults({ encoding: null });
            requestWithEncoding.get(url, function (error, response, body) 
            {
                const type = (response.headers["content-type"] || '').toLowerCase();
                const status = response.statusCode
                if (!error && 
                    (status == 200 || status== 304) && 
                    type == 'image/png') {
                    const data = "data:" + type + ";base64," + Buffer.from(body).toString('base64');
                    return resolve(data);
                }
                return resolve(null);
            });
        });
    }

    static async saveBase64FromUrlWithMaximumSize(url : string, path: string, name : string, maxWidth : number, maxHeight : number) : Promise<string> {
        let base64 = await PicturesService.getBase64FromUrl(url);
        if (base64) {
            base64 = await PicturesService.resizeBase64WithMaximum(base64, maxWidth, maxHeight); 
        }
        let result = null;
        if (base64) {
            result = await PicturesService.saveBase64(base64, path, name);
        }
        return result;
    }

    // ---------------------------------------------  //
    // ---------------------------------------------  //
    // --------------  RESIZE BASE64 -------------  //
    // ---------------------------------------------  //
    // ---------------------------------------------  //

    static async resizeBase64WithMinimum(base64, minWidth = null, minHeight = null, options = null) : Promise<string> {
        let dimensions = PicturesService.getSizeFromBase64(base64);
        var width = dimensions.width;
        var height = dimensions.height;
        if (minWidth > width) {
            height = Math.floor(height * (minWidth / width));
            width = minWidth;
        }
        if (minHeight > height) {
            width = Math.floor(width * (minHeight / height));
            height = minHeight;
        }
        return await PicturesService.resizeBase64(base64, width, height, options);
    }

    static async resizeBase64WithMaximum(base64, maxWidth = null, maxHeight = null, options = null) : Promise<string> {
        let dimensions = PicturesService.getSizeFromBase64(base64);
        var width = dimensions.width;
        var height = dimensions.height;
        if (maxWidth < width) {
            height = Math.floor(height * (maxWidth / width));
            width = maxWidth;
        }
        if (maxHeight < height) {
            width = Math.floor(width * (maxHeight / height));
            height = maxHeight;
        }
        return await PicturesService.resizeBase64(base64, width, height, options);
    }

    static async resizeBase64(base64, width, height, options = null) : Promise<string> {
        let base64Details = PicturesService.extractBase64Details(base64);

        var img = Buffer.from(base64Details.base64, 'base64');
        var type = PicturesService.getTypeFromBase64(base64);
        let background = {r : 0, g : 0, b : 0, alpha : 1};
        if (type == "png") {
            background.alpha = 0;
        }
        if (!options) {
            options = {};
        }
        if (!options.fit) {
            options.fit = 'cover';
        }
        if (!options.background) {
            options.background = background
        }
        return await new Promise((resolve) => {
            try {
                sharp(img)
                .resize(width, height, options)
                .toBuffer()
                .then(buffer => {
                    let newBase64 = 'data:' + base64Details.mimType + ';base64,' + buffer.toString('base64');
                    resolve(newBase64);
                })
            } catch {
                resolve(null);
            }
        });
    }

    // ---------------------------------------------  //
    // ---------------------------------------------  //
    // --------------  UTILITIES -------------  //
    // ---------------------------------------------  //
    // ---------------------------------------------  //

    static extractBase64Details(str) {
        let parts = str.split(';');
        let mimType = parts[0].split(':')[1];
        let base64 = parts[1].split(',')[1];
        return {
            input : str,
            mimType : mimType,
            base64 : base64
        }
    }

    static getSizeOfFile(path) {
        return sizeOf(path);
    }

    static getSizeFromBase64(str) {
        let base64Details = PicturesService.extractBase64Details(str);
        var dimensions = sizeOf(Buffer.from(base64Details.base64, 'base64'));
        return dimensions;
    }

    static getTypeFromBase64(str) {
        var result = null;
        if (PicturesService.isBase64(str)) {
            if (str) {
                var type = str.match(/[^:/]\w+(?=;|,)/)[0];
                if (type) {
                    result = type.toLowerCase();
                }
            }
        }
        return result;
    }

    static isBase64(str) {
        return _isBase64(str, {mimeRequired : true});
    }
}