import { Request, Response } from 'express';

export async function webRTCIsEnabled(req : Request, res: Response){
  const context = req.context;
  const webRTCService = context.webRTCService;
  const conf = context.configService.read();
  const platform = req.params.platform;
  const token = req.headers.authorization?.replace('Bearer ', '');
  let result = {success : false, error : null};

  if (['managerwebsite', 'barapp', 'scorerfrontend'].indexOf(platform) < 0)
    return res.status(400).json({message : "Wrong platform ..."});

  if (platform == 'managerwebsite') {
    result = await webRTCService.webRTCIsEnabledForManagerWebsite(token);
  } else if (platform == 'barapp') {
    result = await webRTCService.webRTCIsEnabledForBarApp(token);
  } else if (platform == 'scorerfrontend') {
    result = webRTCService.webRTCIsEnabledForScorerFrontend(req.fromLocalhost);
  }

  if (result.error) 
    return res.status(400).json({message : result.error});

  return res.json({success : result.success});
}
export async function getWebRTCToken(req : Request, res: Response){
  const context = req.context;
  const conf = context.configService.read();
  const platform = req.params.platform;
  let result = false;
  let data = {};

  if (['managerwebsite', 'barapp', 'scorerfrontend'].indexOf(platform) < 0)
    return res.status(400).json({message : "Wrong platform ..."});

  if (conf.restrictionSocketTokenWebRTC && !conf.enableWebRTCFromAllSources) {
    if (platform == 'managerwebsite') {
      if (!conf.enableWebRTCFromManagerSpace)
        return res.status(400).json({message : "WebRTC doesn't enabled for this platform"});
      try{
          const token = req.headers.authorization?.replace('Bearer ', '');
          result = await context.sportbakService.isComplexManager(token, context.sportbakService.complex._id);
      }catch(err) {
        return res.status(400).json({message : "Impossible to verify authenticity of token", error : err});
      };
    } else if (platform == 'barapp') {
      if (!conf.enableWebRTCFromBarApp)
        return res.status(400).json({message : "WebRTC doesn't enabled for this platform"});
      // is ids of complexmanager
      try{
        const token = req.headers.authorization?.replace('Bearer ', '');
        result = await context.sportbakService.isComplexManager(token, context.sportbakService.complex._id);
      }catch(err) {
        return res.status(400).json({message : "Impossible to verify authenticity of token", error : err});
      };
    } else if (platform == 'scorerfrontend') {
      if (!conf.enableWebRTCFromLocalhost)
        return res.status(400).json({message : "WebRTC doesn't enabled for this platform"});
      if (req.fromLocalhost)
          result = true;
    }
  } else {
    result = true;
  }

  
  if(result) {
    let itoken = await context.tokenService.createWebRTCToken();
    if (itoken) {
        data = {
            token : itoken.value,
            expireAt : itoken.expireAt
        }
    } else {
      return res.status(500).json({message : "Internal error while generating token"});
    }
  } else {
    return res.status(403).json({message : "Forbidden"});
  }

  return res.json(data);
}