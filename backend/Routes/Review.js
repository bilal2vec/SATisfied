const express = require('express')

const review = require('../API/review')

const Review = express.Router()

Review.post('/', (req, res, next) => {
	review
		.getUuid(req.body.email)
		.then((results) => {
			return review.get(results, req.body.email)
		})
		.then((results) => {
			res.status(200).send(results)
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = Review
