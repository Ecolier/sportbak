import express from 'express';
import * as controllers from '../controllers/onboarding.controller';
import { body } from 'express-validator';

const router = express.Router();

router.post('/login',  body('username').isLength({min: 5}), body('password').isLength({ min: 5 }), controllers.login);
router.post('/create', body('token').isLength({min: 5}), body('fieldId').isLength({ min: 5 }), controllers.create);

export default router
