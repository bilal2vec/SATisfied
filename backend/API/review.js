const API = require('./API')

const percentileTable = (score) => {
	return score * 20
}

const review = {
	async get(test_uuid, email) {
		return API.query(
			'select tests.uuid as testUUID, tests.name, scores.score, scores.raw_score as rawScore, scores.total_questions as numQuestions from scores inner join tests on tests.id = scores.tests_id inner join users on users.id = scores.users_id where users.email = ? and tests.uuid = ?;',
			[email, test_uuid],
			403
		)
			.then((res) => {
				return res[0]
			})
			.then(async (res) => {
				const [no_calc_correct, no_calc_total] = await this.getSectionTypeAnalysis(
					test_uuid,
					email,
					1
				)
				const [calc_correct, calc_total] = await this.getSectionTypeAnalysis(
					test_uuid,
					email,
					2
				)

				let scoreAnalysisTopic = await this.getScoreAnalysisTopic(test_uuid, email)
				let scoreAnalysisQuestionType = await this.getScoreAnalysisQuestionType(
					test_uuid,
					email
				)

				res['scoreAnalysisTopic'] = [
					{
						key: '1',
						name: 'No Calculator',
						correct: no_calc_correct,
						total: no_calc_total,
						data: scoreAnalysisTopic[0],
					},
					{
						key: '2',
						name: 'Calculator Allowed',
						correct: calc_correct,
						total: calc_total,
						data: scoreAnalysisTopic[1],
					},
				]

				res['scoreAnalysisQuestionType'] = [
					{
						key: '1',
						name: 'No Calculator',
						correct: no_calc_correct,
						total: no_calc_total,
						data: scoreAnalysisQuestionType[0],
					},
					{
						key: '2',
						name: 'Calculator Allowed',
						correct: calc_correct,
						total: calc_total,
						data: scoreAnalysisQuestionType[1],
					},
				]

				return res
			})
			.then(async (res) => {
				let noCalculatorSummary = await this.getMistakeSummary(test_uuid, email, 1)
				let calculatorSummary = await this.getMistakeSummary(test_uuid, email, 2)

				res['noCalculatorSummary'] = noCalculatorSummary
				res['calculatorSummary'] = calculatorSummary
				res['percentileRank'] = percentileTable(res['score'])

				return res
			})
	},

	async getUuid(email) {
		return await API.query(
			'select uuid from tests where id = (select tests_id from scores where users_id = (select id from users where email = ?) order by tests_id desc limit 1 );',
			[email],
			403
		)
			.then((res) => {
				return res[0]['uuid']
			})
			.catch((error) => {
				return error
			})
	},

	async getSectionTypeAnalysis(test_uuid, email, section_type) {
		const question_ids = await API.query(
			'select questions.id from questions inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id where tests.uuid = ? and sections.sectionTypes_id = ?;',
			[test_uuid, section_type],
			403
		).then((res) => {
			return res.map((row) => {
				return row['id']
			})
		})

		const num_correct = await API.query(
			"select count(U.correct) as correct from (select answersMC.correct, multipleChoice.questions_id, answersMC.users_id, multipleChoice.questionUsage_id from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id union select answersGrid.correct, gridIn.questions_id, answersGrid.users_id, gridIn.questionUsage_id from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id) as U inner join users on users.id = U.users_id where U.questionUsage_id = 1 and users.email = ? and U.questions_id in (?) and U.correct = 'true';",
			[email, question_ids]
		).then((res) => {
			return res[0]['correct']
		})

		return [num_correct, question_ids.length]
	},

	async getTopics() {
		return API.query('select topics.title, topics.uuid from topics;', [], 403).then((res) => {
			return res.map((val) => {
				return {
					title: val['title'],
					uuid: val['uuid'],
				}
			})
		})
	},

	async getScoreAnalysisTopicBreakdown(test_uuid, email, topic_uuid, section_type) {
		const question_ids = await API.query(
			'select questions.id from questions inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id inner join examples on examples.id = questions.examples_id inner join subtopics on subtopics.id = examples.subtopics_id inner join topics on topics.id = subtopics.topics_id where tests.uuid = ? and topics.uuid = ? and sections.sectionTypes_id = ?;',
			[test_uuid, topic_uuid, section_type],
			403
		).then((res) => {
			return res.map((row) => {
				return row['id']
			})
		})

		if (question_ids.length > 0) {
			const num_correct = await API.query(
				"select count(U.correct) as correct from (select answersMC.correct, multipleChoice.questions_id, answersMC.users_id, multipleChoice.questionUsage_id from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id union select answersGrid.correct, gridIn.questions_id, answersGrid.users_id, gridIn.questionUsage_id from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id) as U inner join users on users.id = U.users_id where U.questionUsage_id = 1 and users.email = ? and U.questions_id in (?) and U.correct = 'true';",
				[email, question_ids],
				403
			).then((res) => {
				return res[0]['correct']
			})

			return {
				correct: num_correct,
				total: question_ids.length,
			}
		} else {
			return undefined
		}
	},

	async getScoreAnalysisQuestionTypeBreakdown(test_uuid, email, section_type, question_type) {
		if (question_type === 'mcq') {
			const question_ids = await API.query(
				'select multipleChoice.id from multipleChoice inner join questions on questions.id = multipleChoice.questions_id inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id where multipleChoice.questionUsage_id = 1 and questions.questionTypes_id = 1 and tests.uuid = ? and sections.sectionTypes_id = ?;',
				[test_uuid, section_type],
				403
			).then((res) => {
				return res.map((row) => {
					return row['id']
				})
			})

			let num_correct = await API.query(
				"select count(answersMC.correct) as correct from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id inner join users on users.id = answersMC.users_id where multipleChoice.questionUsage_id = 1 and users.email = ? and answersMC.multipleChoice_id in (?) and answersMC.correct = 'true';",
				[email, question_ids],
				403
			).then((res) => {
				return res[0]['correct']
			})

			return [num_correct, question_ids.length]
		} else {
			const question_ids = await API.query(
				'select gridIn.id from gridIn inner join questions on questions.id = gridIn.questions_id inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id where gridIn.questionUsage_id = 1 and questions.questionTypes_id = 2 and tests.uuid = ? and sections.sectionTypes_id = ?;',
				[test_uuid, section_type],
				403
			).then((res) => {
				return res.map((row) => {
					return row['id']
				})
			})

			let num_correct = await API.query(
				"select count(answersGrid.correct) as correct from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id inner join users on users.id = answersGrid.users_id where gridIn.questionUsage_id = 1 and users.email = ? and answersGrid.gridIn_id in (?) and answersGrid.correct = 'true';",
				[email, question_ids],
				403
			).then((res) => {
				return res[0]['correct']
			})

			return [num_correct, question_ids.length] // query =
		}
	},

	async getScoreAnalysisTopic(test_uuid, email) {
		let topics = await this.getTopics()

		let no_calc_breakdown = []
		for (let i = 0; i < topics.length; i++) {
			let topic = topics[i]

			let temp = await this.getScoreAnalysisTopicBreakdown(test_uuid, email, topic['uuid'], 1)

			if (temp !== undefined) {
				no_calc_breakdown.push({
					key: String(i + 1),
					name: topic['title'],
					correct: temp['correct'],
					total: temp['total'],
				})
			}
		}

		let calc_breakdown = []
		for (let i = 0; i < topics.length; i++) {
			let topic = topics[i]

			let temp = await this.getScoreAnalysisTopicBreakdown(test_uuid, email, topic['uuid'], 2)

			if (temp !== undefined) {
				calc_breakdown.push({
					key: String(i + 1),
					name: topic['title'],
					correct: temp['correct'],
					total: temp['total'],
				})
			}
		}

		return [no_calc_breakdown, calc_breakdown]
	},

	async getScoreAnalysisQuestionType(test_uuid, email) {
		let [
			no_calc_mcq_correct,
			no_calc_mcq_total,
		] = await this.getScoreAnalysisQuestionTypeBreakdown(test_uuid, email, 1, 'mcq')
		let [
			no_calc_gridin_correct,
			no_calc_gridin_total,
		] = await this.getScoreAnalysisQuestionTypeBreakdown(test_uuid, email, 1, 'gridin')

		let [calc_mcq_correct, calc_mcq_total] = await this.getScoreAnalysisQuestionTypeBreakdown(
			test_uuid,
			email,
			2,
			'mcq'
		)
		let [
			calc_gridin_correct,
			calc_gridin_total,
		] = await this.getScoreAnalysisQuestionTypeBreakdown(test_uuid, email, 2, 'gridin')

		return [
			[
				{
					key: 1,
					name: 'Multiple Choice',
					correct: no_calc_mcq_correct,
					total: no_calc_mcq_total,
				},
				{
					key: 2,
					name: 'Grid In',
					correct: no_calc_gridin_correct,
					total: no_calc_gridin_total,
				},
			],
			[
				{
					key: 1,
					name: 'Multiple Choice',
					correct: calc_mcq_correct,
					total: calc_mcq_total,
				},
				{
					key: 2,
					name: 'Grid In',
					correct: calc_gridin_correct,
					total: calc_gridin_total,
				},
			],
		]
	},

	async getMistakeSummary(test_uuid, email, section_type) {
		let mistakeSummary = []

		let mistakeTypes = ['Didnt know', 'Hard', 'Time', 'Careless']

		for (let i = 0; i < mistakeTypes.length; i++) {
			let mistake = mistakeTypes[i]
			let [
				avgTime,
				num,
			] = await API.query(
				'select case when U.end is null then 0 else  (U.end - U.start) end as time from (select wrongType.type, durationMC.start, durationMC.end, answersMC.users_id, multipleChoice.questions_id from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id inner join wrongType on wrongType.id = answersMC.wrongType_id left join durationMC on durationMC.answersMC_id = answersMC.id union select wrongType.type, durationGrid.start, durationGrid.end, answersGrid.users_id, gridIn.questions_id from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id inner join wrongType on wrongType.id = answersGrid.wrongType_id left join durationGrid on durationGrid.answersGrid_id = answersGrid.id) as U inner join questions on questions.id = U.questions_id inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id inner join users on users.id = U.users_id where tests.uuid = ? and sections.sectionTypes_id = ? and users.email = ? and U.type = ?;',
				[test_uuid, section_type, email, mistake]
			).then((res) => {
				let time = 0
				if (res.length > 0) {
					res.map((val) => {
						time += val['time']
					})

					time /= res.length
				}

				return [time, res.length]
			})

			mistakeSummary.push({
				key: String(i + 1),
				name: mistake,
				number: num,
				avgTime: avgTime,
			})
		}

		return mistakeSummary
	},
}

module.exports = review
