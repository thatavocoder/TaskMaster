const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Task = mongoose.model('Task');
const requireLogin = require('../middleware/requireLogin');


router.get('/api/tasklist', requireLogin, async (req, res) => {
    const user = req.user._id
    const tasks = await Task.find({ user: user });
    res.send(tasks)
});

router.get('/api/:taskId', requireLogin, (req, res) => {
    let id = req.params.taskId
    Task.findById(id)
        .populate('user', '_id name')
        .then(task => {
            res.send(task);
        })
        .catch(err => {
            res.send(err);
        });
});

router.post('/api/:taskid/update', requireLogin, (req, res) => {

    const id = req.params['taskid']
    const t = Task.findOneAndUpdate({ _id: id },
        {
            task: req.body.task,
            expected: req.body.expected,
        }, (error, data) => {
            if (error) {
                console.log(error)
            } else {
                console.log(data)
                return res.send({ message: 'Task updated successfully', success: true })
            }
        })
});

// Create
router.post('/api/createTask', requireLogin, (req, res) => {
    const user = req.user._id
    try {
        const task = new Task({
            task: req.body.task,
            user: user,
            expected: req.body.expected
        })
        task.save()
        return res.send({ message: "Task created successfully", success: true })
    } catch (err) {
        console.log(err)
    }
});

// Delete
router.post('/api/:taskId/delete', requireLogin, (req, res) => {
    const id = req.params['taskId']
    Task.findOneAndDelete({ _id: id }, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send("user has been deleted")
        }
    })
})

router.post('/api/:taskId/updateStatus', requireLogin, (req, res) => {
    const id = req.params['taskId']
    const t = Task.findOneAndUpdate({ _id: id },
        {
            status: req.body.status
        }, (error, data) => {
            if (error) {
                console.log(error)
            } else {
                console.log(data)
                res.send({ message: 'Status updated successfully', success: true })
            }
        })
})

module.exports = router;