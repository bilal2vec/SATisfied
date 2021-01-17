const express = require('express')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuidv4 = require('uuid/v4')

const secret = require('../secret')

const API = require('../API/API')
const form = require('../API/form')

const Form = express.Router()

Form
	// Validate Email & Password
	.use(function (req, res, next) {
		if (form.validate(req.body.email, req.body.password)) {
			next()
		} else {
			next(new Error(403))
		}
	})

	// Login/Signup
	.route('/')
	.post(function (req, res, next) {
		const email = req.body.email
		const password = req.body.password

		API.query('SELECT * FROM `users` WHERE email = ?', [email])
			.then((results) => {
				if (results[0]) {
					bcrypt.compare(password, results[0]['password'], function (err, response) {
						if (response) {
							const token = jwt.sign(email, secret.secret)
							res.status(200).send({
								token: token,
								status: 200,
							})
						} else {
							next(new Error(403))
						}
					})
				} else {
					const data = {
						uuid: uuidv4(),
						email: req.body.email,
						password: bcrypt.hashSync(req.body.password, 10),
						signup_type: 'email',
					}
					API.query('INSERT INTO `users` SET ?', data)
						.then((results) => {
							const token = jwt.sign(req.body.email, secret.secret)
							res.status(201).send({
								status: 201,
								token: token,
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

module.exports = Form
