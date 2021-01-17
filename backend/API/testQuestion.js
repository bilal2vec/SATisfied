const API = require('./API')
const uuidv4 = require('uuid/v4')

const mathjs = require('mathjs')

const scoreCalc = (rawScore) => {
	return rawScore * 100
}

const testQuestion = {
	async get(sectionUUID, questionNumber) {
		return API.query(
			'select (select count(questions.id) from questions inner join sections on questions.sections_id = sections.id where sections.uuid = ?) as numQuestions, questions.uuid as questionUUID, questionTypes.type from questions inner join sections on questions.sections_id = sections.id inner join questionTypes on questions.questionTypes_id = questionTypes.id where sections.uuid = ? and questions.number = ?;',
			[sectionUUID, sectionUUID, questionNumber + 1],
			403
		).then((res) => {
			return res[0]
		})
	},

	async submitMCQ(userAnswer, email) {
		const [mcq_id, solution_choice, users_id] = await API.query(
			'select A.id as mcq_id, A.solutionChoice, B.id as users_id from (select id, solutionChoice from multipleChoice where uuid = ?) as A, (select id from users where email = ?) as B;',
			[userAnswer['uuid'], email],
			403
		).then((res) => {
			return [res[0]['mcq_id'], res[0]['solutionChoice'], res[0]['users_id']]
		})

		const correct =
			parseInt(userAnswer['choice']) === parseInt(solution_choice) ? 'true' : 'false'
		const inserted_id = await API.query(
			'insert into answersMC (uuid, answerChoice, correct, multipleChoice_id, users_id, answerConfidence_id) values (?, ?, ?, ?, ?, ?);',
			[
				uuidv4(),
				userAnswer['choice'],
				correct,
				mcq_id,
				users_id,
				userAnswer['confidence'] + 1,
			],
			403
		).then((res) => {
			return API.query(
				'select id from answersMC where multipleChoice_id = ? and users_id = ?;',
				[mcq_id, users_id],
				403
			).then((res) => {
				return res[0]['id']
			})
		})

		return API.query(
			'insert into durationMC (uuid, start, end, answersMC_id) values (?, ?, ?, ?);',
			[uuidv4(), userAnswer['start'], userAnswer['stop'], inserted_id],
			403
		).then((res) => {
			return true
		})
	},

	async submitGridIn(userAnswer, email) {
		const [gridin_id, users_id] = await API.query(
			'select A.id as gridIn_id, B.id as users_id from (select id from gridIn where uuid = ?) as A, (select id from users where email = ?) as B;',
			[userAnswer['uuid'], email],
			403
		).then((res) => {
			return [res[0]['gridIn_id'], res[0]['users_id']]
		})

		const solutions = await API.query(
			'select answer from gridIn inner join fractions on fractions.gridIn_id = gridIn.id where gridIn.uuid = ?;',
			[userAnswer['uuid']],
			403
		).then((res) => {
			return res.map((fraction) => {
				return mathjs.evaluate(fraction['answer'])
			})
		})

		let userFraction =
			userAnswer['boxOne'] +
			userAnswer['boxTwo'] +
			userAnswer['boxThree'] +
			userAnswer['boxFour']

		try {
			userFraction = mathjs.evaluate(userFraction)

			if (userFraction === undefined) {
				userFraction = ''
			}
		} catch (error) {
			userFraction = ''
		}

		const correct = solutions.includes(userFraction) ? 'true' : 'false'

		const inserted_id = await API.query(
			'insert into answersGrid (uuid, answer, correct, gridin_id, users_id, answerConfidence_id) values (?, ?, ?, ?, ?, ?);',
			[uuidv4(), userFraction, correct, gridin_id, users_id, userAnswer['confidence'] + 1],
			403
		).then((res) => {
			return API.query(
				'select id from answersGrid where gridIn_id = ? and users_id = ?;',
				[gridin_id, users_id],
				403
			).then((res) => {
				return res[0]['id']
			})
		})

		return API.query(
			'insert into durationGrid (uuid, start, end, answersGrid_id) values (?, ?, ?, ?);',
			[uuidv4(), userAnswer['start'], userAnswer['stop'], inserted_id],
			403
		).then((res) => {
			return true
		})
	},

	async submitTest(sectionUUID, email) {
		const [shouldSubmit, testUUID] = await API.query(
			'select sections.sectionTypes_id, tests.uuid from sections inner join tests on tests.id = sections.tests_id where sections.uuid = ?;',
			[sectionUUID],
			403
		).then((res) => {
			let type = res[0]['sectionTypes_id']
			let temp = res[0]['uuid']

			if (type === 2) {
				return [true, temp]
			} else {
				return [false, temp]
			}
		})

		if (shouldSubmit) {
			let [n_correct, user_id, test_id] = await API.query(
				"select count(U.correct) as n_correct, users.id as user_id, tests.id as test_id from (select multipleChoice.questions_id, answersMC.correct, answersMC.users_id from multipleChoice inner join answersMC on answersMC.multipleChoice_id = multipleChoice.id where multipleChoice.questionUsage_id = 1 union select gridIn.questions_id, answersGrid.correct, answersGrid.users_id from gridIn inner join answersGrid on answersGrid.gridIn_id = gridIn.id where gridIn.questionUsage_id = 1) as U inner join questions on questions.id = U.questions_id inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id inner join users on users.id = U.users_id where tests.uuid = ? and users.email = ?  and U.correct = 'true';",
				[testUUID, email],
				403
			).then((res) => {
				return [res[0]['n_correct'], res['0']['user_id'], res[0]['test_id']]
			})

			return API.query(
				'insert into scores (uuid, score, raw_score, total_questions, tests_id, users_id) values (?, ?, ?, ?, ?, ?);',
				[uuidv4(), scoreCalc(n_correct), n_correct, 58, test_id, user_id],
				403
			)
		} else {
			return true
		}
	},

	async submit(sectionUUID, userAnswers, email) {
		for (let i = 0; i < userAnswers.length; i++) {
			let userAnswer = userAnswers[i]

			if (userAnswer['type'] === 'mcq') {
				const res = await this.submitMCQ(userAnswer, email)
			} else if (userAnswer['type'] === 'gridin') {
				const res = await this.submitGridIn(userAnswer, email)
			}
		}

		let temp = await this.submitTest(sectionUUID, email)

		return temp
	},
}

module.exports = testQuestion
