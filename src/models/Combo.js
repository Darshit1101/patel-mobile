import mongoose from 'mongoose';

const ComboSchema = new mongoose.Schema({
    comboName: {
        type: String,
        required: [true, 'Combo name is required'],
        trim: true,
        maxLength: [100, 'Combo name cannot exceed 100 characters']
    },
    mobileNames: [{
        type: String,
        required: [true, 'Mobile name is required'],
        trim: true,
        maxLength: [100, 'Mobile name cannot exceed 100 characters']
    }]
}, {
    timestamps: true
});

// Add index for better search performance
ComboSchema.index({ comboName: 1 });

export default mongoose.models.Combo || mongoose.model('Combo', ComboSchema);