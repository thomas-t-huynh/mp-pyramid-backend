const express = require('express')
const router = new express.Router()
const Day = require('../models/day')
const Schedule = require('../models/schedule')
const auth = require('../middleware/auth')

router.post('/day', auth,  async (req, res) => {
    const day = new Day({
        ...req.body,
        owner: req.user._id
    })
    console.log(day)
    try {
        await day.save()
        res.status(201).send(day)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/day/schedule', auth,  async (req, res) => {
    try {
        async function saveDays () {
            return await Promise.all(
                req.body.map(async day => {
                    let newDay = new Day({
                        ...day,
                        owner: req.user._id
                    })
                    const savedDay = await newDay.save()
                    return savedDay._id
                })
            )
        }
        const days = await saveDays()
        const schedule = new Schedule({
            days,
            owner: req.user._id
        })
        await schedule.save()
        res.status(201).send(req.body)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})



// GET /days?completed=true
// GET /days?limit=10&skip=0
// GET /days?sortBy=createdAt_asc or :asc
router.get('/day', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const days = await day.find({ owner: req.user_id })
        // res.status(200).send(days)
        await req.user.populate({
            path: 'day',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.days)
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/day/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const day = await day.findById(_id)

        const day = await Day.findOne({ _id, owner: req.user._id })
        if (day) {
            return res.status(200).send(day)
        }
        res.status(400).send();
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/day/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes((update))
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    try {
        const day = await Day.findOne({ _id: req.params.id, owner: req.user._id })
        // const day = await day.findByIdAndUpdate(_id, req.body,{ new: true })
        if (!day) {
            return res.status(404).send()
        }


        updates.forEach((update) => day[update] = req.body[update])
        await Day.save()
        res.send(day)
    } catch(e) {
        res.status(400).send(e)
    }

})

router.delete('/day/:id', auth, async (req, res) => {
    try {
        const day = await Day.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!day) {
            return res.status(404).send()
        }

        // await day.delete()
        res.send(day)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router