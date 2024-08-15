import express from 'express';
import Container from 'typedi';
import SportbakService from '../services/sportbak.service';

export async function webrtcManagerAuthorized(req : express.Request, res: express.Response){
    const spk = Container.get(SportbakService); 
    let result = false;
    try{
        const token = req.headers.authorization?.replace('Bearer ', '');
        result = await spk.isComplexManager(token);
    }catch(err) {
    };
    return res.json({result : result});
}

export async function webrtcManagerAuthorizedV2(req : express.Request, res: express.Response){
    const spk = Container.get(SportbakService); 
    const complexId = req.params.complexId;
    let result = false;
    try{
        const token = req.headers.authorization?.replace('Bearer ', '');
        result = await spk.isComplexManagerForComplex(complexId, token);
    }catch(err) {
    };
    return res.json({result : result});
}

export async function getSocketToken(req : express.Request, res: express.Response){
    console.log("getSocketToken ...")
    const spk = Container.get(SportbakService); 
    const fieldId = req.params?.fieldId;
    let data = {};
    try{
        const token = req.headers.authorization?.replace('Bearer ', '');
        const sportbakUser = req.headers['sportbak-user'] as string;
        //console.log("Token : " + token);
        let complex = await spk.getComplex(token, sportbakUser);
        if (!(complex?.fields || []).find((f) => f._id == fieldId)) {
            return res.status(400).json({message : "Field is invalid"});
        }
        if (complex) {
            let itoken = await spk.tokenService.createSocketWebRTCToken(complex._id, fieldId);
            if (itoken) {
                data = {
                    token : itoken.value,
                    expireAt : itoken.expireAt
                }
            }
            else {
                return res.status(500).json({message : "Internal error while generating token"});
            }
        } else {
            return res.status(403).json({message : "Forbidden"});
        }
    }catch(err) {
        return res.status(400).json({message : err});
    };
    return res.json(data);
}