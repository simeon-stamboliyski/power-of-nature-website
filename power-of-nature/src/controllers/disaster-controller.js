import { Router } from "express";
import disasterServices from "../services/disaster-services.js";
import { isAuth } from "../middlewares/auth-middleware.js";
import Disaster from "../models/Disaster.js";

const disasterRouter = Router();

disasterRouter.get('/catalog', async (req, res) => {
    const disasters = await disasterServices.getAll();
    console.log('Data from DB:', disasters);
    const formattedDisasters = Array.from(disasters).map(disaster => ({
        ...disaster,
        _id: disaster._id.toString()
    }));
    res.render('catalog', { formattedDisasters });
});

disasterRouter.get('/createEvent', isAuth, async (req, res) => {
    res.render('create');
});

disasterRouter.post('/createEvent', isAuth, async (req, res) => {
    const disasterData = req.body;
    const userId = req.user?._id;

    console.log(`User identification ${userId}`);
    try{
        await disasterServices.createDisaster(disasterData, userId);
        res.redirect('/disaster/catalog');
    } catch {
        const errorMessage = getErrorMessage(err);
        res.render('create', { error: errorMessage });
    }
    
});

disasterRouter.get('/search', async (req, res) => {
    try {
        let filter = req.query;

        filter.name = filter.name || '';
        filter.type = filter.type || '';

        const disasters = await disasterServices.getAll(filter);
        res.render('search', { disasters, filter });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('Server error');
    }
});

disasterRouter.get('/:disasterId/details', async (req, res) => {
    const disasterId = req.params.disasterId;

    let disaster = await disasterServices.findDisaster(disasterId);
    if (!disaster) {
        return res.status(404).send('Disaster not found');
    }

    const isInterested = req.user && Array.isArray(disaster.interestedUsers) 
        ? disaster.interestedUsers.includes(req.user._id)
        : false;

    const isCreator = req.user && req.user._id.toString() === disaster.creator.toString();

    const interestedUsersCount = disaster.interestedUsers.length;

    res.render('details', { disaster, isCreator, isInterested, interestedUsersCount });
});

disasterRouter.post('/:disasterId/interested', isAuth, async (req, res) => {
    const disasterId = req.params.disasterId;
    const userId = req.user._id;

    try {
        const disaster = await Disaster.findById(disasterId);
        if (!disaster) {
        return res.status(404).send('Disaster not found');
        }
        
        await disaster.addInterest(userId);
        
        res.redirect(`/disaster/${disasterId}/details`);
    } catch (error) {
        console.error('Error adding interest:', error);
        res.redirect(`/disaster/${disasterId}/details`);
    }
});

disasterRouter.get('/:disasterId/edit', isAuth, async (req, res) => {
    const disasterId = req.params.disasterId;

    let disaster = await disasterServices.findDisaster(disasterId);
    if (!disaster) {
        return res.status(404).send('Disaster not found');
    }

    res.render('edit', { disaster });
});

disasterRouter.post('/:disasterId/edit', isAuth, async (req, res) => {
    const updatedDisaster = req.body;
    const disasterId = req.params.disasterId;

    await disasterServices.updateDisaster(disasterId, updatedDisaster);

    res.redirect(`/disaster/${disasterId}/details`);
});

disasterRouter.get('/:disasterId/delete', isAuth, async (req, res) => {
    const disasterId = req.params.disasterId;

    try {
        await disasterServices.deleteDisaster(disasterId);
        res.redirect('/disaster/catalog');
    } catch (error) {
        res.redirect('/404');
    }
});

export default disasterRouter;