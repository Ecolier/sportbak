import express from 'express';
import * as controllers from '../controllers/token.controller';

const router = express.Router();

router.get('/barapp/socket',  controllers.getBarAppSocketToken);
router.get('/frontend/socket',  controllers.getFrontendSocketToken);

export default router
