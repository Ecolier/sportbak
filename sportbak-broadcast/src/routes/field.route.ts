import express from 'express';
import { requireLoggedAdmin } from '../middlewares/admin.middleware';
import * as controllers from '../controllers/field.controller';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.use(requireLoggedAdmin);

router.get('/', controllers.findAll);

router.get('/:id', controllers.findOne);

router.post('/', body('complexId').isLength({min: 5}), body('fieldId').isLength({ min: 5 }), controllers.create);

router.delete('/:id', controllers.remove);

export default router
