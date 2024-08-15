import express from 'express';
import * as controllers from '../controllers/admin.controller';

const router = express.Router();

router.get('/socket/token',  controllers.getSocketToken);

export default router
