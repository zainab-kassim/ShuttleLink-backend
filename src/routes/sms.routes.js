import express from 'express';
import { sendSMS } from '../controllers/sms.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'

const router = express.Router();

router.post('/send-sms', handleAsyncErr(sendSMS));





export default router;
