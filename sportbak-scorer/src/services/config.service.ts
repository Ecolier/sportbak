import Config from "../models/config.model";
import fs from 'fs';

export default class ConfigService{
    private file : string;
    private config : Config;
    
    constructor(file: string){
        this.file = file;
        try {
            this.read(true);
            this.save(this.config);
        } catch (err) {};
    }

    private stringify(config : Config) {
        const obj = {
            'apiKey': config.apiKey, 
            'apiSecret': config.apiSecret,
            'sendVideoAsSoon': config.sendVideoAsSoon, 
            'dailySendHour': config.dailySendHour, 
            'bitrate': config.bitrate, 
            'height': config.height, 
            'buzzTime': config.buzzTime, 
            'deleteVideo': config.deleteVideo, 
            'mapping' : config.mapping, 
            'varTime' : config.varTime, 
            'launchSessionFromFrontend' : config.launchSessionFromFrontend,
            'launchSessionFromFrontendWithWarmup ' : config.launchSessionFromFrontendWithWarmup, 
            'enableWebRTCFromManagerSpace' : config.enableWebRTCFromManagerSpace,
            'enableWebRTCFromBarApp' : config.enableWebRTCFromBarApp,
            'enableWebRTCFromLocalhost' : config.enableWebRTCFromLocalhost,
            'enableWebRTCFromAllSources' : config.enableWebRTCFromAllSources,
            'chunkSizeUpload' : config.chunkSizeUpload,
            'enableBarApplication' : config.enableBarApplication,
            'pauseSessionFromFrontend' : config.pauseSessionFromFrontend,
            'restrictionSocketTokenBarApp': config.restrictionSocketTokenBarApp,
            'restrictionSocketTokenFrontEnd': config.restrictionSocketTokenFrontEnd,
            'restrictionSocketTokenWebRTC': config.restrictionSocketTokenWebRTC,
            'stopSessionFromFrontend' : config.stopSessionFromFrontend,
            'sendFullVideo' : config.sendFullVideo,
            'sendBuzzVideo' : config.sendBuzzVideo,
            'sendGoalVideo' : config.sendGoalVideo,
            'sendVarVideo' : config.sendVarVideo,
            'frontendInterface' : config.frontendInterface,
            'limitGoals' : config.limitGoals,
            'limitBuzzs' : config.limitBuzzs,
            'limitVar' : config.limitVar,
            'limitSessionTime' : config.limitSessionTime,
            'limitWebRTCManager' : config.limitWebRTCManager,
            'screensaver' : config.screensaver,
            'overlay' : config.overlay
        };

        return JSON.stringify(obj, null, 2);
    }

    save(config : Config){
        //console.log("Saving config : " + this.file);
        this.config = config;
        fs.writeFileSync(this.file, this.stringify(config));
        return this.getCurrent();
    }


    read(throwError = false) : Config {
        //console.log('Reading configuration ' + this.file);
        let config = {};
        try{
            if (fs.existsSync(this.file)) {
                //console.log('Trying read ' + this.file);
                let content = fs.readFileSync(this.file, 'utf8');
                //console.log("Content : ", content)
                if (content.trim().length) {
                    config = JSON.parse(content);
                    //console.log('config file detected in ' + this.file);
                }
            }
        }catch (error){
            if (throwError) {
                throw error;
            }
            console.log('cant read ' + this.file + ' ' + error);
        }

        const result = new Config(config['apiKey'], config['apiSecret'], 
            config['sendVideoAsSoon'], config['dailySendHour'], config['bitrate'] , config['height'], 
            config['buzzTime'], config['deleteVideo'], config['mapping'], config['varTime'], 
            config['launchSessionFromFrontend'], config['launchSessionFromFrontendWithWarmup'], 
            config['enableWebRTCFromManagerSpace'],
            config['enableWebRTCFromBarApp'], 
            config['enableWebRTCFromLocalhost'],
            config['enableWebRTCFromAllSources'],
            config['chunkSizeUpload'],
            config['enableBarApplication'],
            config['pauseSessionFromFrontend'],
            config['restrictionSocketTokenBarApp'],
            config['restrictionSocketTokenFrontEnd'],
            config['restrictionSocketTokenWebRTC'],
            config['stopSessionFromFrontend'],
            config['sendFullVideo'],
            config['sendBuzzVideo'],
            config['sendGoalVideo'],
            config['sendVarVideo'],
            config['frontendInterface'],
            config['limitGoals'],
            config['limitBuzzs'],
            config['limitVar'],
            config['limitSessionTime'],
            config['limitWebRTCManager'],
            config['screensaver'],
            config['overlay']
            );

        this.config = result;
        //this.print(result);
        return result;
    }

    resetApiKeys() {
        const conf = this.read();
        conf.apiKey = "";
        conf.apiSecret = "";
        return this.save(conf);
    }

    getCurrent() : Config {
        return this.config;
    }

    print(config : Config) {
        console.log("Configuration : \n" + this.stringify(config));
    }

}