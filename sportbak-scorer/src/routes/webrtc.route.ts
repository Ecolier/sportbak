import express from 'express';
import * as controllers from '../controllers/webrtc.controller';

const router = express.Router();

router.get('/:platform/enabled',  controllers.webRTCIsEnabled);
router.get('/:platform/token',  controllers.getWebRTCToken);

export default router
