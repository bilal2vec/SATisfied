const express = require('express')

const practice = require('../API/practice')

const Practice = express.Router()

Practice.post('/', (req, res, next) => {
	practice
		.get(req.body.email)
		.then((results) => {
			res.status(200).send({ topics: results })
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = Practice
