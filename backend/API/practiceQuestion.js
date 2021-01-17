const API = require('./API')

const uuidv4 = require('uuid/v4')

const practiceQuestion = {
	async getMCQ(questionId) {
		return API.query(
			'select solutionChoice as questionAnswer, solutionText from multipleChoice where questions_id = ? and questionUsage_id = 2;',
			[questionId],
			403
		).then((res) => {
			return res[0]
		})
	},

	async getGridin(questionId) {
		return API.query(
			'select gridIn.solutionText as questionAnswer, fractions.answer as questionAnswer from fractions inner join gridIn on gridIn.id = fractions.gridIn_id where gridIn.questions_id = ? and gridIn.questionUsage_id = 2',
			[questionId],
			403
		).then((res) => {
			const questionAnswer = res.map((row) => {
				return row['questionAnswer']
			})

			return {
				solutionText: res[0]['solutionText'],
				questionAnswer: questionAnswer,
			}
		})
	},

	async isMCQAnswered(questionId, email) {
		return await API.query(
			'select * from multipleChoice inner join answersMC on multipleChoice.id = answersMC.multipleChoice_id inner join users on answersMC.users_id = users.id where multipleChoice.questions_id = ? and multipleChoice.questionUsage_id = 2 and users.email = ?',
			[questionId, email],
			403
		).then((res) => {
			if (res[0]) {
				return true
			} else {
				return false
			}
		})
	},

	async isGridinAnswered(questionId, email) {
		return await API.query(
			'select * from gridIn inner join answersGrid on gridIn.id = answersGrid.gridIn_id inner join users on answersGrid.users_id = users.id where gridIn.questions_id = ? and gridIn.questionUsage_id = 2 and users.email = ?',
			[questionId, email],
			403
		).then((res) => {
			if (res[0]) {
				return true
			} else {
				return false
			}
		})
	},

	async get(topicUUID, testUUID, questionNumber, email) {
		return API.query(
			'select questions.id, questions.uuid, questionTypes.type from questions inner join questionTypes on questionTypes.id = questions.questionTypes_id inner join examples on examples.id = questions.examples_id inner join subtopics on subtopics.id = examples.subtopics_id inner join topics on topics.id = subtopics.topics_id inner join  sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id where topics.uuid = ? and tests.uuid = ?;',
			[topicUUID, testUUID],
			403
		)
			.then(async (res) => {
				let temp = Promise.all(
					res.map(async (row) => {
						if (row['type'] == 'mcq') {
							return await this.isMCQAnswered(row['id'], email).then((isAnswered) => {
								if (!isAnswered) {
									return row
								}
							})
						} else {
							return await this.isGridinAnswered(row['id'], email).then(
								(isAnswered) => {
									if (!isAnswered) {
										return row
									}
								}
							)
						}
					})
				)

				return temp
			})
			.then(async (res) => {
				res = res.filter((row) => row != null)

				if (res[0]) {
					const numQuestions = res.length

					res = res[questionNumber]

					let question
					if (res['type'] === 'mcq') {
						question = await this.getMCQ(res['id'])
					} else if (res['type'] === 'gridin') {
						question = await this.getGridin(res['id'])
					}

					return {
						numQuestions: numQuestions,
						questionUUID: res['uuid'],
						type: res['type'],
						questionAnswer: question['questionAnswer'],
						solutionText: question['solutionText'],
					}
				}
			})
	},

	async submitMCQ(correct, userAnswer, uuid, email) {
		return API.query(
			'insert into answersMC (uuid, answerChoice, correct, multipleChoice_id, users_id) values (?, ?, ?, (select id from multipleChoice where uuid = ?), (select id from users where email = ?));',
			[uuidv4(), userAnswer, correct.toString(), uuid, email],
			403
		)
	},
	async submitGridin(correct, userAnswer, uuid, email) {
		return API.query(
			'insert into answersGrid (uuid, answer, correct, gridIn_id, users_id) values (?, ?, ?, (select id from gridIn where uuid = ?), (select id from users where email = ?));',
			[uuidv4(), userAnswer, correct.toString(), uuid, email],
			403
		)
	},

	async submit(correct, userAnswer, questionTypeUUID, questionType, email) {
		let res
		if (questionType === 'mcq') {
			res = await this.submitMCQ(correct, userAnswer, questionTypeUUID, email)
		} else {
			res = await this.submitGridin(correct, userAnswer, questionTypeUUID, email)
		}

		return res
	},
}

module.exports = practiceQuestion
