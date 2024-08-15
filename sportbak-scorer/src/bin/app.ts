'use strict';

// Add context in req
import ContextService from '../services/context.service';
declare global {
  namespace Express {
    interface Request {
      context: ContextService,
      clientIp : string,
      fromLocalhost : boolean
    }
  }
}

import ws from 'ws';
import express, { urlencoded } from 'express';
import { onConnect, onDisconnect, onMessage } from '../controllers/socket.controller';
import { load as loadMongoose } from '../loaders/mongoose'
import cors from 'cors';
import process from 'process';
import VideoConfig from '../config/video.config';
import webRTCRoutes from '../routes/webrtc.route';
import tokenRoutes from '../routes/token.route';
import videoRoutes from '../routes/video.route';
import { URL } from 'url';
import { ipMiddleware } from '../middleware/ip.middleware';
import { SocketEmitError } from '../services/socket.error.service';
import environmentConfig from '../config/environment.config';
import externalUrlsConfig from '../config/externalUrls.config';
import imageVersions from '../config/image.version';
import WebRTCTunnelService from '../services/webrtc.tunnel.service';
//import usb from 'usb-detection';

console.log("\n\
 _______________________________________________________  \n\
|-------------------------------------------------------| \n\
|-------------------------------------------------------| \n\
|------------        SERVER STARTING...     ------------| \n\
|------------    PLATFORM : " + environmentConfig.platform + "    ------------| \n\
|------------          OS : " + environmentConfig.os + "          ------------| \n\
|------------      OS VERSION : " + environmentConfig.osversion + "      ------------| \n\
|------------       MODE : " + environmentConfig.mode + "      ------------| \n\
|------------          API VIDEO URL        ------------| \n\
|--------    " + externalUrlsConfig.apiVideo + "   ------| \n\
|-------------------------------------------------------| \n\
|-------------------------------------------------------| \n\
 ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞ ͞   \n\
");

console.log("Versions : \n\
 - MANAGER BACKEND    : " + imageVersions.manager_backend_version + "\n\
 - MANAGER WORK       : " + imageVersions.manager_worker_version + "\n\
 - MANAGER FRONTEND   : " + imageVersions.manager_frontend_version + "\n\
 - VIDEO APP          : " + imageVersions.videoapp_version + "\n");

/*usb.startMonitoring();
process.on('exit', () => {
  usb.stopMonitoring();
});*/

const PORT = Number(process.env.PORT) || 8081;
const HOST = process.env.HOST || '0.0.0.0';

loadMongoose();


//import dnssd from 'dnssd';
/*const ad = new dnssd.Advertisement(dnssd.tcp('http'), 4321);
ad.start();*/


const context = new ContextService();

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', async (socket, req) => {
  const conf = context.configService.read();
  const url = new URL("http://localhost" + req.url);
  if (url.pathname == '/webrtc') {
    console.log("WebRTC Socket connected ...");
    if (conf.enableWebRTCFromAllSources) {
      console.log("WebRTC Socket authenticated because all sources are authorized !");
      context.socketDataService.add(socket);
      const webRTCTunnel = new WebRTCTunnelService(socket, VideoConfig.service_url, true);
      context.socketDataService.set(socket, 'webRTCTunnel', webRTCTunnel);
    } else {
      let token = url.searchParams.get('token');
      context.tokenService.webRTCTokenIsValid(token, async (success: boolean, error : number) => {
        if (success) {
          await context.tokenService.tokenUsed(token);
          console.log("WebRTC Socket authenticated !");
          context.socketDataService.add(socket);
          const webRTCTunnel = new WebRTCTunnelService(socket, VideoConfig.service_url, true);
          context.socketDataService.set(socket, 'webRTCTunnel', webRTCTunnel);
        } else {
          let socketError : SocketEmitError = SocketEmitError.UNKNOW;
          if (error == -1) {
            socketError = SocketEmitError.SOCKET_TOKEN_ALREADY_USED;
          } else if (error == -2) {
            socketError = SocketEmitError.SOCKET_TOKEN_EXPIRED;
          } else if (error == -3) {
            socketError = SocketEmitError.SOCKET_TOKEN_DOES_NOT_EXIST;
          } else if (error == -4) {
            socketError = SocketEmitError.SOCKET_TOKEN_INVALID;
          }
          context.socketErrorService.emitError(socket, socketError);
        }
      })
    }
    socket.on('message', (message : ws.Data)=> {
      console.log("Message : " + message.toString());
    });
    socket.on('close', () => {
      context.socketDataService.remove(socket);
    })
  } else if (url.pathname == '/barapp') {
    let token = url.searchParams.get('token');
    context.tokenService.barAppTokenIsValid(token, async (success: boolean, error : number) => {
      if (success) {
        await context.tokenService.tokenUsed(token);
        console.log("Bar app Socket authenticated !");
        context.connectionService.connect(socket);
        context.socketDataService.add(socket);
        onConnect(context, socket);
        socket.on('message', (message : ws.Data)=> {
          onMessage(context, socket, message.toString());
        });
        socket.on('close', () => {
          console.log("disconnected");
          context.connectionService.disconnect(socket);
          context.socketDataService.remove(socket);
          onDisconnect(context, socket);
        })
      } else {
        let socketError : SocketEmitError = SocketEmitError.UNKNOW;
        if (error == -1) {
          socketError = SocketEmitError.SOCKET_TOKEN_ALREADY_USED;
        } else if (error == -2) {
          socketError = SocketEmitError.SOCKET_TOKEN_EXPIRED;
        } else if (error == -3) {
          socketError = SocketEmitError.SOCKET_TOKEN_DOES_NOT_EXIST;
        } else if (error == -4) {
          socketError = SocketEmitError.SOCKET_TOKEN_INVALID;
        }
        context.socketErrorService.emitError(socket, socketError);
      }
    })
  } else {

    let token = url.searchParams.get('token');
    context.tokenService.frontendTokenIsValid(token, async (success: boolean, error : number) => {
      if (success) {
        await context.tokenService.tokenUsed(token);
        console.log("Socket connected ...");
        context.connectionService.connect(socket);
        context.socketDataService.add(socket);
        onConnect(context, socket);
        socket.on('message', (message : ws.Data)=> {
          onMessage(context, socket, message.toString());
        });
        socket.on('close', () => {
          console.log("disconnected");
          context.connectionService.disconnect(socket);
          context.socketDataService.remove(socket);
          onDisconnect(context, socket);
        })
      } else {
        let socketError : SocketEmitError = SocketEmitError.UNKNOW;
        if (error == -1) {
          socketError = SocketEmitError.SOCKET_TOKEN_ALREADY_USED;
        } else if (error == -2) {
          socketError = SocketEmitError.SOCKET_TOKEN_EXPIRED;
        } else if (error == -3) {
          socketError = SocketEmitError.SOCKET_TOKEN_DOES_NOT_EXIST;
        } else if (error == -4) {
          socketError = SocketEmitError.SOCKET_TOKEN_INVALID;
        }
        context.socketErrorService.emitError(socket, socketError);
      }
    })
  }
});


const app = express();

app.use(cors());
app.use(express.json());
app.use(ipMiddleware);
app.use(function (req, res, next) { req.context = context; next()});

app.use('/media', express.static(VideoConfig.path, {fallthrough: true}), function (req, res) {
  return res.status(404).json("File not found");
});


app.use('/webrtc', webRTCRoutes);
app.use('/video', videoRoutes);
app.use('/token', tokenRoutes);

const server = app.listen(PORT, HOST);

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket as any, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

console.log(`Running on http://${HOST}:${PORT}`);