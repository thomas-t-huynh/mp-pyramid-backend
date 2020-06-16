const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    exercises: [
        {
            type: Object,
            required: true
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
})


const Day = mongoose.model('Day', daySchema);

module.exports = Day;