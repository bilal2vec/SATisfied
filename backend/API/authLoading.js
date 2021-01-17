const API = require('./API')

const authLoading = {
	async practiceDone(test_UUID, email) {
		const [mcqs, gridIns] = await API.query(
			"select U.type, U.id as type_id from (select id, questions_id, 'mcq' as type from multipleChoice where multipleChoice.questionUsage_id = 2 union select id, questions_id, 'gridIn' as type from gridIn where gridIn.questionUsage_id = 2 Order by questions_id) as U inner join questions on questions.id = U.questions_id inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id where tests.uuid = ?;",
			[test_UUID],
			403
		).then((res) => {
			const mcqs = res.filter((row) => row['type'] === 'mcq').map((row) => row['type_id'])
			const gridIns = res
				.filter((row) => row['type'] === 'gridIn')
				.map((row) => row['type_id'])

			return [mcqs, gridIns]
		})

		const mcqsDone = await API.query(
			'select answersMC.id from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id inner join users on users.id = answersMC.users_id where users.email = ? and multipleChoice.id in (?);',
			[email, mcqs],
			403
		).then((res) => {
			return res.map((row) => row['id'])
		})

		const gridInsDone = await API.query(
			'select answersGrid.id from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id inner join users on users.id = answersGrid.users_id where users.email = ? and gridIn.id in (?);',
			[email, gridIns],
			403
		).then((res) => {
			return res.map((row) => row['id'])
		})

		if (mcqs.length === mcqsDone.length && gridIns.length === gridInsDone.length) {
			return true
		} else {
			return false
		}
	},

	async reviewDone(test_UUID, email) {
		return API.query(
			"select U.wrongType_id from (select multipleChoice.questions_id, answersMC.correct, answersMC.users_id, multipleChoice.questionUsage_id, answersMC.wrongType_id from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id union select gridIn.questions_id, answersGrid.correct, answersGrid.users_id, gridIn.questionUsage_id, answersGrid.wrongType_id from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id) as U inner join users on users.id = U.users_id inner join questions on questions.id = U.questions_id inner join sections on sections.id = questions.sections_id inner join tests on tests.id = sections.tests_id where tests.uuid = ? and users.email = ? and U.questionUsage_id = 1 and U.correct = 'false';",
			[test_UUID, email],
			403
		).then((res) => {
			let is_null = false
			res.map((row) => {
				if (row['wrongType_id'] === null) {
					is_null = true
				}
			})

			return !is_null
		})
	},

	async getTab(email) {
		const latest_test_done = await API.query(
			'select tests.uuid from scores inner join users on users.id = scores.users_id inner join tests on tests.id = scores.tests_id where users.email = ? order by tests.id desc limit 1;',
			[email],
			403
		).then((res) => {
			if (res.length == 0) {
				return null
			} else {
				return res[0]['uuid']
			}
		})

		if (latest_test_done === null) {
			return 'Test'
		} else {
			const practiceDone = await this.practiceDone(latest_test_done, email)

			if (practiceDone) {
				return 'Test'
			} else {
				const reviewDone = await this.reviewDone(latest_test_done, email)

				if (reviewDone) {
					return 'Learn'
				} else {
					return 'Review'
				}
			}
		}
	},
}

module.exports = authLoading
