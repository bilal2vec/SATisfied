const express = require('express')

const learn = require('../API/Learn')

const Learn = express.Router()

Learn.post('/', (req, res, next) => {
	learn
		.get()
		.then((results) => {
			res.status(200).send({ topics: results })
		})
		.catch((err) => {
			next(err)
		})
}).post('/video', (req, res, next) => {
	learn
		.getVideo(req.body.topicUUID, req.body.videoNumber)
		.then((results) => {
			res.status(200).send(results)
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = Learn
