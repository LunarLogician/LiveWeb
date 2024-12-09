import mongoose from 'mongoose';

// Define the MiningSession schema
const MiningSessionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    isMining: { 
        type: Boolean, 
        default: false 
    },
    coinsMined: { 
        type: Number, 
        default: 0 
    },
    startTime: { 
        type: Date 
    },
    endTime: { 
        type: Date 
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt timestamps

// Create and export the MiningSession model
const MiningSession = mongoose.model('MiningSession', MiningSessionSchema);
export default MiningSession;
