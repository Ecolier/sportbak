import { Request, Response } from 'express';

export async function getBarAppSocketToken(req : Request, res: Response){
    const context = req.context;
    const conf = context.configService.read();
    let result = false;
    let data = {};
  
    if (conf.restrictionSocketTokenBarApp) {
      if (conf.enableBarApplication) {
        try{
            const token = req.headers.authorization?.replace('Bearer ', '');
            result = await context.sportbakService.isComplexManager(token, context.sportbakService.complex._id);
        }catch(err) {
            return res.status(400).json({message : "Impossible to verify authenticity of token", error : err});
        };
      }
    } else {
      result = true;
    }
    
    if(result) {
      let itoken = await context.tokenService.createBarAppToken();
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

  export async function getFrontendSocketToken(req : Request, res: Response){
    const context = req.context;
    const conf = context.configService.read();
    let result = false;
    let data = {};

    if (conf.restrictionSocketTokenFrontEnd) {
      if (req.fromLocalhost)
        result = true;
    } else {
      result = true;
    }

    if(result) {
      let itoken = await context.tokenService.createFrontendToken();
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