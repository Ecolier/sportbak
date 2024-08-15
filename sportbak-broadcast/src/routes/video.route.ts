import express from 'express';
import { requireLoggedField } from '../middlewares/field.middleware'
import * as controller from '../controllers/video.controller';
import { body } from 'express-validator';

const router = express.Router();

router.use(requireLoggedField);

router.get('/', controller.findAll);

router.get('/:id', controller.findOne);

router.post('/', controller.create);

router.post('/:id/poster', express.raw({
    type: 'application/octet-stream',
    limit: '10mb'
}), controller.poster);

router.post('/:id', express.raw({
    type: 'application/octet-stream',
    limit: '10mb'
}), controller.append);

export default router