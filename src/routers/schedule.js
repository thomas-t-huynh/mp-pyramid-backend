const express = require('express')
const router = new express.Router()
const Day = require('../models/day')
const Schedule = require('../models/schedule')
const auth = require('../middleware/auth')

router.post('/schedule', auth, async (req, res) => {
    const schedule = new Schedule({
        days: req.body.days,
        owner: req.user._id
    })
    console.log(schedule)
    try { 
        await schedule.save()
        res.status(201).send(schedule)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router