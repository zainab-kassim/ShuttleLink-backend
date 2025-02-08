import express from 'express';
import { bookRide } from '../controllers/ride.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'

const router = express.Router();

router.post('/book-ride', handleAsyncErr(bookRide));





export default router;