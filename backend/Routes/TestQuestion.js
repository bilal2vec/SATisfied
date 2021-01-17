const express = require('express')

const testQuestion = require('../API/testQuestion')

const TestQuestion = express.Router()

TestQuestion.post('/', (req, res, next) => {
	testQuestion
		.get(req.body.sectionUUID, req.body.questionNumber)
		.then((results) => {
			res.status(200).send(results)
		})
		.catch((err) => {
			next(err)
		})
}).post('/submit', (req, res, next) => {
	testQuestion
		.submit(req.body.sectionUUID, req.body.userAnswers, req.body.email)
		.then(() => {
			res.status(201).send({ status: 201 })
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = TestQuestion
