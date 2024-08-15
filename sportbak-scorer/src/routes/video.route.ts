import express from 'express';
import * as controllers from '../controllers/video.controller';

const router = express.Router();

router.post('/ready',  controllers.newVideoIsReady);

export default router
