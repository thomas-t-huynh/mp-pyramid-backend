const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    exercises: [{
        exercise: {
            type: Mixed,
            required: true
        }
    }]
},
{
    timestamps: true
})


const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;