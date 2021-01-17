const express = require('express')

const progress = require('../API/progress')

const Progress = express.Router()

Progress.post('/', (req, res, next) => {
	progress
		.get(req.body.email)
		.then((results) => {
			res.status(200).send({ tests: results })
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = Progress
