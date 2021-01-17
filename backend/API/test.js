const API = require('./API')

const test = {
	async isQuestionComplete(question, email) {
		if (question['questionTypes_id'] == 1) {
			return await API.query(
				'select multipleChoice.uuid from multipleChoice inner join answersMC on multipleChoice.id = answersMC.multipleChoice_id inner join users on users.id = answersMC.users_id where multipleChoice.questions_id = ? and multipleChoice.questionUsage_id = 1 and users.email = ?',
				[question['id'], email],
				403
			).then((res) => {
				if (res[0]) {
					return true
				} else {
					return false
				}
			})
		} else {
			return await API.query(
				'select gridIn.uuid from gridIn inner join answersGrid on gridIn.id = answersGrid.gridIn_id inner join users on users.id = answersGrid.users_id where gridIn.questions_id = ? and gridIn.questionUsage_id = 1 and users.email = ?',
				[question['id'], email],
				403
			).then((res) => {
				if (res[0]) {
					return true
				} else {
					return false
				}
			})
		}
	},

	async isSectionComplete(section_uuid, email) {
		return await API.query(
			'select questions.id, questions.questionTypes_id from sections inner join questions on sections.id = questions.sections_id where sections.uuid = ?',
			[section_uuid],
			403
		).then(async (res) => {
			if (res[0]) {
				let temp = false
				await Promise.all(
					res.map(async (question) => {
						questionComplete = await this.isQuestionComplete(question, email)
						if (questionComplete == true) {
							temp = true
						}
					})
				)
				return temp
			}
		})
	},

	async getSections(test_uuid, email) {
		let sections = await API.query(
			'select sections.uuid as uuid, sectionTypes.name as name, sectionTypes.timelimit as time from sections inner join sectionTypes on sections.sectionTypes_id = sectionTypes.id inner join tests on sections.tests_id = tests.id where tests.uuid = ?;',
			[test_uuid],
			403
		)
			.then((res) => {
				return res.map((section, i) => {
					return {
						key: String(i + 1),
						uuid: section.uuid,
						name: section.name,
						time: section.time,
					}
				})
			})
			.catch((err) => {
				throw new Error(403)
			})

		await Promise.all(
			sections.map(async (section) => {
				section['isComplete'] = await this.isSectionComplete(section['uuid'], email)
			})
		)

		return sections
	},

	async get(test_uuid, email) {
		let test = await API.query(
			'SELECT id, uuid, name FROM `tests` WHERE uuid=?;',
			[test_uuid],
			403
		)
			.then((res) => {
				return res[0]
			})
			.then((res) => {
				return {
					test_uuid: res.uuid,
					test_name: res.name,
				}
			})

		test['test_sections'] = await this.getSections(test_uuid, email)

		return test
	},

	async getUuid(email) {
		return await API.query(
			'select tests_id from scores where users_id = (select id from users where email = ?)',
			[email],
			403
		).then(async (res) => {
			if (res.length > 0) {
				return await API.query(
					'select uuid from tests where id > ? limit 1',
					res[res.length - 1]['tests_id']
				).then(async (res) => {
					if (res.length > 0) {
						return res[0]['uuid']
					} else {
						return 'LastTest'
					}
				})
			} else {
				return await API.query('select uuid from tests limit 1').then((res) => {
					return res[0]['uuid']
				})
			}
		})
	},

	// old code, keeping for referencing
	async getOLD() {
		let tests = await API.query('SELECT id, uuid, name FROM `tests`;', [], 403)
			.then((res) => {
				return res.map((test, i) => {
					return {
						key: String(i + 1),
						uuid: test.uuid,
						name: test.uuid,
					}
				})
			})
			.catch((err) => {
				throw new Error(403)
			})

		for (const i in tests) {
			tests[i].data = await this.getSections(tests[i].uuid)
		}

		return tests
	},
}

module.exports = test
