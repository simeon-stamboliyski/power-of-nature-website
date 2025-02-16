import jwt from 'jsonwebtoken';
import authService from "../services/auth-service.js";

const secretKey = authService.secretKey;

export const auth = (req, res, next) => {
    const token = req.cookies['auth'];

    if (!token) {
        res.locals.isUserLoggedIn = false;
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, secretKey);

        req.user = decodedToken;
        res.locals.user = decodedToken;
        res.locals.isUserLoggedIn = true;
        console.log(res.locals.user);
    } catch(err) {
        res.clearCookie(secretKey);
        res.locals.isUserLoggedIn = false;
        return res.redirect('auth/login');
    }

    next();
}

export const isAuth = (req, res, next) => {
    if (!req.user) {
        res.clearCookie();
        res.redirect('/auth/login');
    }

    next();
}