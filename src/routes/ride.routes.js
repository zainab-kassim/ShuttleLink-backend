import express from 'express';
import { bookRide } from '../controllers/ride.controller.js';
import { acceptRide } from '../controllers/ride.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'
import isloggedIn from '../utils/isLoggedin.js'

const router = express.Router();

router.post("/book-ride", isloggedIn,handleAsyncErr(bookRide));
router.post("/ride-accepted",  isloggedIn,handleAsyncErr(acceptRide))





export default router;