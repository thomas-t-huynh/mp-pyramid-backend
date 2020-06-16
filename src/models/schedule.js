const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    days: [{
        exercise: {
            type: String,
            required: true
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
})


const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;