import { Router } from "express";

const homeRouter = Router();

homeRouter.get('/', (req, res) => {
    res.render('home');
});

homeRouter.get('*', (req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

export default homeRouter;