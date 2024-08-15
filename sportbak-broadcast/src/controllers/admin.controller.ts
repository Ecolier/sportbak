import express from 'express';
import Container from 'typedi';
import SportbakService from '../services/sportbak.service';

export async function getSocketToken(req : express.Request, res: express.Response){
    console.log("getSocketToken ...")
    const spk = Container.get(SportbakService); 
    let data = {};
    try{
        const token = req.headers.authorization?.replace('Bearer ', '');
        let isSuperadmin = await spk.isSuperadmin(token);
        if (isSuperadmin) {
            let itoken = await spk.tokenService.createSocketAdminToken();
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