'use strict';

// Add context in req
declare global {
  namespace Express {
    interface Request {
      clientIp : string,
      fromLocalhost : boolean
    }
  }
}

import 'reflect-metadata';
import express from 'express';
import videoRoutes from '../routes/video.route';
import fieldRoutes from '../routes/field.route';
import onboardingRoutes from '../routes/onboarding.route';
import webRTCRoutes from '../routes/webrtc.route';
import managerRoutes from '../routes/manager.route';
import adminRoutes from '../routes/admin.route';
import { load as loadMongoose } from '../loaders/mongoose.loader';
import { load as loadConfig } from '../loaders/config.loader';
import http from 'http';
import SportbakService from '../services/sportbak.service';
import SocketErrorService from '../services/socket.error.service';
import Container from 'typedi';
import SocketDataService from '../services/socket.data.service';
import cors from 'cors';
import { Server } from "socket.io";
import SocketService from '../services/socket.service';

// Constants
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

loadMongoose();
loadConfig();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json())

const spbk = Container.get(SportbakService);
const socketErrorService = Container.get(SocketErrorService);
const socketDataService = Container.get(SocketDataService);

spbk.tokenService.clearOldTokens();

app.use('/videos', videoRoutes);
app.use('/fields', fieldRoutes);
app.use('/onboarding', onboardingRoutes);
app.use('/webrtc', webRTCRoutes);
app.use('/manager', managerRoutes);
app.use('/admin', adminRoutes);

const device = io.of("/device");
const manage = io.of("/manage");
const admin = io.of("/admin");
const webrtc = io.of("/webrtc");

const socketService = new SocketService(device, manage, admin, webrtc);
socketService.listen();

server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
