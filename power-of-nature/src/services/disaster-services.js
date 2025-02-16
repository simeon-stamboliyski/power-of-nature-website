import Disaster from '../models/Disaster.js';

export default {
    async getAll(filter = {}) {
        const query = {};
    
        if (filter.name) {
            query.name = { $regex: filter.name, $options: 'i' }; 
        }
    
        if (filter.type) {
            query.type = { $regex: `^${filter.type}$`, $options: 'i' };
        }
    
        try {
            const disasters = await Disaster.find(query).lean();
            return disasters;
        } catch (error) {
            console.error('Error fetching disasters:', error);
            throw new Error('Error fetching disasters');
        }
    },

    async createDisaster(disasterData, creatorId) {
        const newDisaster = {
            ...disasterData,
            creator: creatorId
        };

        try {
            const disaster = new Disaster(newDisaster);
            await disaster.save();
            console.log('New disaster added successfully');
        } catch (error) {
            console.error('Error adding new disaster:', error);
        }
    },

    async findDisaster(disasterId) {
        try {
            return await Disaster.findById(disasterId);
        } catch (error) {
            console.error('Error finding disaster:', error);
            return null;
        }
    },

    async updateDisaster(disasterId, updatedDisaster) {
        try {
            await Disaster.findByIdAndUpdate(disasterId, updatedDisaster);
            console.log(`Disaster with ID ${disasterId} updated successfully.`);
        } catch (error) {
            console.error('Error updating disaster:', error);
        }
    },

    async deleteDisaster(disasterId) {
        try {
            await Disaster.findByIdAndDelete(disasterId);
            console.log(`Disaster with ID ${disasterId} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting disaster:', error);
        }
    }
};