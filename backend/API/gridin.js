const API = require('./API')

const gridin = {
	async get(questionUUID, usage, getAnswer, email) {
		const question = await API.query(
			'select gridIn.uuid, gridIn.text as question from gridIn inner join questions on gridIn.questions_id = questions.id where questions.uuid = ? and gridIn.questionUsage_id = ?;',
			[questionUUID, usage],
			403
		).then((res) => {
			return res[0]
		})

		if (getAnswer) {
			return API.query(
				'select fractions.answer as correctAnswer, answersGrid.answer as answer, gridIn.solutionText from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id inner join fractions on fractions.gridIn_id = gridIn.id inner join questions on questions.id = gridIn.questions_id inner join users on users.id = answersGrid.users_id where questions.uuid = ? and users.email = ?;',
				[questionUUID, email],
				403
			).then((res) => {
				if (res.length > 0) {
					question['questionSkipped'] = false
					question['answer'] = res[0]['answer']
					question['solution'] = res[0]['solutionText']

					question['correctAnswer'] = res.map((row) => {
						return row['correctAnswer']
					})
				} else {
					question['questionSkipped'] = true
				}
				return question
			})
		} else {
			return question
		}
	},
}

module.exports = gridin
