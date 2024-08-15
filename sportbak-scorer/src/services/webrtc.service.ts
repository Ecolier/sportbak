import ContextService from "./context.service";

export default class WebRTCService {
    private context : ContextService;
    constructor(context : ContextService) {
        this.context = context;
    }

    async webRTCIsEnabledForManagerWebsite(token : string, verifyToken = true) {
        const conf = this.context.configService.read();
        let result = {success : false, error : null};
        if (conf.restrictionSocketTokenWebRTC && !conf.enableWebRTCFromAllSources) { 
            if (conf.enableWebRTCFromManagerSpace) {
                try{
                    if (verifyToken) {
                        let success = await this.context.sportbakService.isComplexManager(token, this.context.sportbakService.complex._id);
                        result = {success : success, error : null};
                    } else {
                        result = {success : true, error : null};
                    }
                }catch(err) {
                    result = {success : false, error : "Impossible to verify authenticity of token"};
                };
            } else {
                result = {success : false, error : "WebRTC doesn't enabled for this platform"};
            }
        } else {
            result = {success : true, error : null};
        }
        return result;
    }

    async webRTCIsEnabledForBarApp(token : string, verifyToken = true) {
        const conf = this.context.configService.read();
        let result = {success : false, error : null};
        if (conf.restrictionSocketTokenWebRTC && !conf.enableWebRTCFromAllSources) { 
            if (conf.enableWebRTCFromBarApp) {
                try{
                    if (verifyToken) {
                        let success = await this.context.sportbakService.isComplexManager(token, this.context.sportbakService.complex._id);
                        result = {success : success, error : null};
                    } else {
                        result = {success : true, error : null};
                    }                
                }catch(err) {
                    result = {success : false, error : "Impossible to verify authenticity of token"};
                };
            } else {
                result = {success : false, error : "WebRTC doesn't enabled for this platform"};
            }
        } else {
            result = {success : true, error : null};
        }
        return result;      
    }

    webRTCIsEnabledForScorerFrontend(fromLocalhost : boolean) {
        const conf = this.context.configService.read();
        let result = {success : false, error : null};
        if (conf.restrictionSocketTokenWebRTC && !conf.enableWebRTCFromAllSources) { 
            if (conf.enableWebRTCFromLocalhost) {
                if (fromLocalhost)
                    result = {success : true, error : null};;
            } else {
                result = {success : false, error : "WebRTC doesn't enabled for this platform"};
            }     
        } else {
            result = {success : true, error : null};
        }    
        return result;
    }

}