const API = require('./API')

const progress = {
	async get(email) {
		return API.query(
			'select tests.uuid, tests.name, scores.score from scores inner join tests on tests.id = scores.tests_id inner join users on users.id = scores.users_id where users.email = ?;',
			[email],
			403
		).then((res) => {
			return res.map((test, i) => {
				return {
					key: String(i + 1),
					testUUID: test['uuid'],
					name: test['name'],
					score: test['score'],
				}
			})
		})
	},
}

module.exports = progress
