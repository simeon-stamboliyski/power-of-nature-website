import { Router } from "express";
import authService from "../services/auth-service.js";
import { isAuth } from "../middlewares/auth-middleware.js";
import { getErrorMessage } from "../utils/error-utils.js";

const authRouter = Router();

authRouter.get('/register', (req, res) => {
    res.render('auth/register');
});

authRouter.post('/register', async (req, res) => {
    const userData = req.body;

    try {
        const token = await authService.register(userData);
        res.cookie('auth', token, { httpOnly: true });
        res.redirect('/');
    } catch(err) {
        res.render('auth/register', { error: getErrorMessage(err), user: userData });
    }
});

authRouter.get('/login', (req, res) => {
    res.render('auth/login');
});

authRouter.post('/login', async (req, res) => {
    const userData = req.body;

    try{
        const token = await authService.login(userData);

        res.cookie('auth', token);
        res.redirect('/');
    } catch(err) {
        res.render('auth/login', {error: getErrorMessage(err), user: userData });
    }
});

authRouter.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
});

export default authRouter;