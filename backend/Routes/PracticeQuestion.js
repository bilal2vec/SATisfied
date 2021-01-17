const express = require('express')

const practiceQuestion = require('../API/practiceQuestion')

const PracticeQuestion = express.Router()

PracticeQuestion.post('/', (req, res, next) => {
	practiceQuestion
		.get(req.body.topicUUID, req.body.testUUID, req.body.questionNumber, req.body.email)
		.then((results) => {
			res.status(200).send(results)
		})
		.catch((err) => {
			next(err)
		})
}).post('/submit', (req, res, next) => {
	practiceQuestion
		.submit(
			req.body.correct,
			req.body.userAnswer,
			req.body.questionTypeUUID,
			req.body.questionType,
			req.body.email
		)
		.then((results) => {
			res.status(201).send({ status: 201 })
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = PracticeQuestion
