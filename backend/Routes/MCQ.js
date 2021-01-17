const express = require('express')

const mcq = require('../API/mcq')

const MCQ = express.Router()

MCQ.post('/', (req, res, next) => {
	mcq.get(req.body.questionUUID, req.body.usage, req.body.getAnswer, req.body.email)
		.then((results) => {
			res.status(200).send(results)
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = MCQ
