import { NextFunction, Request, Response } from "express";



export function ipMiddleware(req : Request, res : Response, next : NextFunction){
    let host = req.get('host');
    let ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress ;

    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
    }
    req.clientIp = ip;
    req.fromLocalhost = ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;

    next();
}