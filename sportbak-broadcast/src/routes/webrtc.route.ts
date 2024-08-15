import express from 'express';
import * as controllers from '../controllers/webrtc.controller';

const router = express.Router();

router.get('/complexmanager/authorized',  controllers.webrtcManagerAuthorized);
router.get('/complexmanager/authorized/:complexId',  controllers.webrtcManagerAuthorizedV2);
router.get('/socket/token/:fieldId',  controllers.getSocketToken);
export default router
