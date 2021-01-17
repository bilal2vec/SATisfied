const express = require('express')

const reviewQuestion = require('../API/reviewQuestion')

const ReviewQuestion = express.Router()

ReviewQuestion.post('/', (req, res, next) => {
	reviewQuestion
		.get(req.body.testUUID, req.body.sectionType, req.body.questionNumber, req.body.email)
		.then((results) => {
			res.status(200).send(results)
		})
		.catch((err) => {
			next(err)
		})
}).post('/submit', (req, res, next) => {
	reviewQuestion
		.submit(req.body.wrongType, req.body.questionUUID, req.body.questionType, req.body.email)
		.then((results) => {
			res.status(201).send({ status: 201 })
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = ReviewQuestion
