const API = require('./API')

const uuidv4 = require('uuid/v4')

const reviewQuestion = {
	async get(testUUID, sectionType, questionNumber, email) {
		const correctQuestions = await API.query(
			"select U.questions_id from (select answersMC.correct, multipleChoice.questions_id, answersMC.users_id, multipleChoice.questionUsage_id from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id union select answersGrid.correct, gridIn.questions_id, answersGrid.users_id, gridIn.questionUsage_id from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id) as U inner join users on users.id = U.users_id where U.questionUsage_id = 1 and users.email = ? and U.correct = 'true' and U.questions_id in (select questions.id from questions inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id where tests.uuid = ? and sections.sectionTypes_id = ?);",
			[email, testUUID, sectionType],
			403
		).then((res) => {
			return res.map((row) => {
				return row['questions_id']
			})
		})

		if (correctQuestions.length === 0) {
			correctQuestions.push(9999999)
		}

		return API.query(
			'select questions.uuid, questions.questionTypes_id from questions inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id where tests.uuid = ? and sections.sectionTypes_id = ? and questions.id not in (?);',
			[testUUID, sectionType, correctQuestions],
			403
		).then((res) => {
			if (res.length > 0) {
				const wrongQuestion = res[questionNumber]
				const type = wrongQuestion['questionTypes_id'] === 1 ? 'mcq' : 'gridin'
				return {
					numQuestions: res.length,
					questionUUID: wrongQuestion['uuid'],
					type: type,
				}
			} else {
				return {
					numQuestions: 0,
				}
			}
		})
	},

	async submitMCQ(wrongType, questionUUID, email) {
		const id = await API.query(
			'select answersMC.id from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id inner join questions on questions.id = multipleChoice.questions_id inner join users on users.id = answersMC.users_id where multipleChoice.questionUsage_id = 1 and questions.uuid = ? and users.email = ?;',
			[questionUUID, email],
			403
		).then((res) => {
			if (res.length > 0) {
				return res[0]['id']
			} else {
				return null
			}
		})

		if (id) {
			return API.query(
				'update answersMC set wrongType_id = ? where id = ?;',
				[wrongType + 1, id],
				403
			)
		} else {
			const [mcq_id, users_id] = await API.query(
				'select multipleChoice.id as multipleChoice_id, (select id from users where email = ?) as users_id from multipleChoice inner join questions on questions.id = multipleChoice.questions_id where multipleChoice.questionUsage_id = 1 and questions.uuid = ?;',
				[email, questionUUID],
				403
			).then((res) => {
				return [res[0]['multipleChoice_id'], res[0]['users_id']]
			})

			return API.query(
				"insert into answersMC (uuid, answerChoice, correct, multipleChoice_id, wrongType_id, users_id) values (?, -1, 'false', ?, ?, ?);",
				[uuidv4(), mcq_id, wrongType + 1, users_id]
			)
		}
	},
	async submitGridIn(wrongType, questionUUID, email) {
		const id = await API.query(
			'select answersGrid.id from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id inner join questions on questions.id = gridIn.questions_id inner join users on users.id = answersGrid.users_id where gridIn.questionUsage_id = 1 and questions.uuid = ? and users.email = ?;',
			[questionUUID, email],
			403
		).then((res) => {
			if (res.length > 0) {
				return res[0]['id']
			} else {
				return null
			}
		})

		if (id) {
			return API.query(
				'update answersGrid set wrongType_id = ? where id = ?;',
				[wrongType + 1, id],
				403
			)
		} else {
			const [gridin_id, users_id] = await API.query(
				'select gridIn.id as gridIn_id, (select id from users where email = ?) as users_id from gridIn inner join questions on questions.id = gridIn.questions_id where gridIn.questionUsage_id = 1 and questions.uuid = ?;',
				[email, questionUUID],
				403
			).then((res) => {
				return [res[0]['gridIn_id'], res[0]['users_id']]
			})

			return API.query(
				"insert into answersGrid (uuid, answer, correct, gridIn_id, wrongType_id, users_id) values (?, '-1/-1', 'false', ?, ?, ?);",
				[uuidv4(), gridin_id, wrongType + 1, users_id]
			)
		}
	},

	async submit(wrongType, questionUUID, questionType, email) {
		let res
		if (questionType === 'mcq') {
			res = await this.submitMCQ(wrongType, questionUUID, email)
		} else {
			res = await this.submitGridIn(wrongType, questionUUID, email)
		}

		return res
	},
}

module.exports = reviewQuestion
