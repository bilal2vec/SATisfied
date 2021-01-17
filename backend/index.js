const express = require('express')

const Sentry = require('@sentry/node')

const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const secret = require('./secret')

const Form = require('./Routes/Form')
const Glogin = require('./Routes/Glogin')

const Authloading = require('./Routes/AuthLoading')

const Account = require('./Routes/Account')

const Test = require('./Routes/Test')
const TestQuestion = require('./Routes/TestQuestion')
const MCQ = require('./Routes/MCQ')
const Gridin = require('./Routes/Gridin')

const Review = require('./Routes/Review')
const ReviewQuestion = require('./Routes/ReviewQuestion')

const Progress = require('./Routes/Progress')

const Learn = require('./Routes/Learn')

const Practice = require('./Routes/Practice')
const PracticeQuestion = require('./Routes/PracticeQuestion')

const app = express()

Sentry.init({ dsn: '[REDACTED]' })

app.use(Sentry.Handlers.requestHandler({ ip: true }))
	.use(cors())
	.use(bodyParser.json())

	.use('/form', Form)
	.use('/glogin', Glogin)

	// Verify Token
	.use((req, res, next) => {
		const token = req.body.token

		if (token) {
			jwt.verify(token, secret.secret, function (err, decoded) {
				if (err) {
					throw new Error(404)
				} else {
					req.body.email = decoded
					next()
				}
			})
		} else {
			throw new Error(404)
		}
	})

	.use('/authLoading', Authloading)

	.use('/account', Account)

	.use('/test', Test)
	.use('/testQuestion', TestQuestion)
	.use('/mcq', MCQ)
	.use('/gridin', Gridin)

	.use('/review', Review)
	.use('/reviewQuestion', ReviewQuestion)

	.use('/progress', Progress)

	.use('/learn', Learn)

	.use('/practice', Practice)
	.use('/practiceQuestion', PracticeQuestion)

	.use(
		Sentry.Handlers.errorHandler({
			shouldHandleError(error) {
				return true
			},
		})
	)
	.use(function onError(err, req, res, next) {
		res.status(err.message).send({ status: err.message })
	})
	.listen(8080, () => console.log('listening on port 8080'))
