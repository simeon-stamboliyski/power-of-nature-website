import { Schema, model, Types } from 'mongoose';

const DisasterSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'The Name should be at least 2 characters long.']
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ["Wildfire", "Flood", "Earthquake", "Hurricane", "Drought", "Tsunami", "Other"],
      message: 'Invalid disaster type. Choose from ["Wildfire", "Flood", "Earthquake", "Hurricane", "Drought", "Tsunami", "Other"].'
    }
  },
  year: {
    type: Number,
    required: true,
    min: [0, 'Year must be at least 0.'],
    max: [2024, 'Year cannot be later than 2024.']
  },
  location: {
    type: String,
    required: true,
    minlength: [3, 'The Location should be at least 3 characters long.']
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\//.test(v);
      },
      message: 'The Disaster Image should start with http:// or https://'
    }
  },
  description: {
    type: String,
    required: true,
    minlength: [10, 'The Description should be a minimum of 10 characters long.']
  },
  creator: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  interestedUsers: {
    type: [Types.ObjectId],
    ref: 'User',
    default: []
  }
}, { timestamps: true });

// Custom method to add a user's interest
DisasterSchema.methods.addInterest = async function(userId) {
  // Check if the user is already in the array
  if (this.interestedUsers.some(id => id.equals(userId))) {
    throw new Error('You have already shown interest in this disaster.');
  }
  // Add the user and save the document
  this.interestedUsers.push(userId);
  return this.save();
};

const Disaster = model('Disaster', DisasterSchema);
export default Disaster;