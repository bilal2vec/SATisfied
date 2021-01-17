const express = require('express')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const secret = require('../secret')
const bcrypt = require('bcrypt')
const uuidv4 = require('uuid/v4')

const Account = express.Router()

const API = require('../API/API')

Account.post('/', (req, res, next) => {
	API.query(
		'SELECT users.email, signup_type, ProgressShares.email as share_emails FROM `users` left join ProgressShares on ProgressShares.users_id = users.id WHERE users.email = ?;',
		[req.body.email],
		403
	)
		.then((results) => {
			const email = results[0]['email']
			const signup_type = results[0]['signup_type']

			const share_emails = results.map((row) => {
				return row['share_emails']
			})

			return [email, signup_type, share_emails]
		})
		.then((results) => {
			const [email, signup_type, share_emails] = results
			res.status(200).send({
				status: 200,
				email: email,
				signup_type: signup_type,
				shareEmails: share_emails,
			})
		})
		.catch((err) => {
			next(err)
		})
})

	.post('/delete', async (req, res, next) => {
		try {
			const deleteMCQ = await API.query(
				'SET FOREIGN_KEY_CHECKS=0; delete answersMC, durationMC from answersMC left join durationMC on durationMC.answersMC_id = answersMC.id where answersMC.users_id = (select id from users where email = ?);',
				[req.body.email],
				403
			).catch((err) => {
				next(err)
			})

			const deleteGrid = await API.query(
				'SET FOREIGN_KEY_CHECKS=0; delete answersGrid, durationGrid from answersGrid left join durationGrid on durationGrid.answersGrid_id = answersGrid.id where answersGrid.users_id = (select id from users where email = ?);',
				[req.body.email],
				403
			).catch((err) => {
				next(err)
			})

			const deleteScores = await API.query(
				'SET FOREIGN_KEY_CHECKS=0; delete from scores where scores.users_id = (select id from users where email = ?);',
				[req.body.email],
				403
			).catch((err) => {
				next(err)
			})

			const deleteProgressShares = await API.query(
				'SET FOREIGN_KEY_CHECKS=0; delete from ProgressShares where ProgressShares.users_id = (select id from users where email = ?);',
				[req.body.email],
				403
			).catch((err) => {
				next(err)
			})

			if (deleteMCQ && deleteGrid && deleteScores && deleteProgressShares) {
				return API.query('delete from users where email = ?', [req.body.email], 403)
					.then((results) => {
						res.status(204).send({ status: 204 })
					})
					.catch((err) => {
						next(err)
					})
			} else {
				next(new Error(403))
			}
		} catch (err) {
			next(err)
		}
	})

	.use((req, res, next) => {
		if (req.body.value.length === 0) {
			res.status(403).send({ status: 403 })
		} else {
			next()
		}
	})

	.post('/email/edit', (req, res, next) => {
		const email = req.body.email
		const value = req.body.value

		if (validator.isEmail(value)) {
			API.query('UPDATE `users` SET email = ? WHERE (email = ?)', [value, email], 403)
				.then((results) => {
					const token = jwt.sign(value, secret.secret)
					res.status(201).send({
						token: token,
						status: 201,
					})
				})
				.catch((err) => {
					next(err)
				})
		} else {
			next(new Error(403))
		}
	})

	.post('/password/edit', (req, res, next) => {
		const email = req.body.email
		const value = req.body.value

		API.query(
			'UPDATE `users` SET password = ? WHERE (email = ?)',
			[bcrypt.hashSync(value, 10), email],
			403
		)
			.then((results) => {
				res.status(201).send({ status: 201 })
			})
			.catch((err) => {
				next(err)
			})
	})

	.post('/shareEmail/edit', (req, res, next) => {
		const email = req.body.email
		const value = req.body.value

		if (validator.isEmail(value)) {
			API.query(
				'insert into ProgressShares (uuid, email, users_id) values (?, ?, (select id from users where email = ?));',
				[uuidv4(), value, email],
				403
			)
				.then((results) => {
					res.status(201).send({ status: 201 })
				})
				.catch((err) => {
					next(err)
				})
		} else {
			next(new Error(403))
		}
	})

	.post('/shareEmail/delete', (req, res, next) => {
		const email = req.body.email
		const value = req.body.value

		API.query(
			'delete from ProgressShares where email = ? and users_id = (select id from users where email = ?);',
			[value, email],
			403
		)
			.then((results) => {
				res.status(200).send({ status: 204 })
			})
			.catch((err) => {
				next(err)
			})
	})

module.exports = Account
