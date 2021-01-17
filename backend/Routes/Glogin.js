const express = require('express')

const uuidv4 = require('uuid/v4')
const jwt = require('jsonwebtoken')

const secret = require('../secret')

const API = require('../API/API')
const google = require('../API/google')

const Glogin = express.Router()

Glogin.route('/').post(function (req, res, next) {
	const network = req.body.network
	const socialToken = req.body.socialToken
	const email = req.body.email
	const name = req.body.firstName + ' ' + req.body.lastName

	const token = jwt.sign(email, secret.secret)

	google.validate(socialToken).then((profile) => {
		API.query('SELECT * FROM `users` WHERE email = ?', [email], 403)
			.then((results) => {
				if (results[0]) {
					res.status(200).send({
						token: token,
						status: 200,
					})
				} else {
					const data = {
						uuid: uuidv4(),
						email: email,
						password: null,
						signup_type: 'google',
					}
					API.query('INSERT INTO `users` SET ?', data, 403)
						.then((results) => {
							res.status(201).send({
								token: token,
								status: 201,
							})
						})
						.catch((err) => {
							next(err)
						})
				}
			})
			.catch((err) => {
				next(err)
			})
	})
})

module.exports = Glogin
