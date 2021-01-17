const API = require('./API')

const mcq = {
	async get(questionUUID, usage, getAnswer, email) {
		const question = await API.query(
			'select multipleChoice.uuid, multipleChoice.text as question, multipleChoice.choiceA as A, multipleChoice.choiceB as B, multipleChoice.choiceC as C, multipleChoice.choiceD as D from multipleChoice inner join questions on multipleChoice.questions_id = questions.id where questions.uuid = ? and multipleChoice.questionUsage_id = ?;',
			[questionUUID, usage],
			403
		).then((res) => {
			return res[0]
		})

		if (getAnswer) {
			return API.query(
				'select answersMC.answerChoice, multipleChoice.solutionChoice, multipleChoice.solutionText from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id inner join questions on questions.id = multipleChoice.questions_id inner join users on users.id = answersMC.users_id where questions.uuid = ? and users.email = ?;',
				[questionUUID, email],
				403
			).then((res) => {
				if (res.length > 0) {
					question['questionSkipped'] = false
					question['answer'] = res[0]['answerChoice']
					question['correctAnswer'] = res[0]['solutionChoice']
					question['solution'] = res[0]['solutionText']
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

module.exports = mcq
