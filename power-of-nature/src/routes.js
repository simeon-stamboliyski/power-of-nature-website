import { Router } from "express";

import homeRouter from "./controllers/home-controller.js";
import authRouter from "./controllers/auth-controller.js";
import disasterRouter from "./controllers/disaster-controller.js";

const router = Router();

router.use('/auth', authRouter);

router.use('/disaster', disasterRouter);

router.use(homeRouter);

export default router;