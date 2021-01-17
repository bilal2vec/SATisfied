const express = require('express')

const gridin = require('../API/gridin')

const Gridin = express.Router()

Gridin.post('/', (req, res, next) => {
	gridin
		.get(req.body.questionUUID, req.body.usage, req.body.getAnswer, req.body.email)
		.then((results) => {
			res.status(200).send(results)
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = Gridin
