const express = require('express')

const authLoading = require('../API/authLoading')

const AuthLoading = express.Router()

AuthLoading.post('/', (req, res, next) => {
	authLoading
		.getTab(req.body.email)
		.then((results) => {
			res.status(200).send({ tab: results })
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = AuthLoading
