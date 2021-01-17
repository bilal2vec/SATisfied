const express = require('express')

const test = require('../API/test')

const Test = express.Router()

Test.post('/', (req, res, next) => {
	test.getUuid(req.body.email)
		.then((results) => {
			if (results == 'LastTest') {
				res.status(200).send({ lastTest: results })
			} else {
				test.get(results, req.body.email).then((results) => {
					res.status(200).send(results)
				})
			}
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = Test
