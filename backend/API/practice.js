const API = require('./API')

const practice = {
	async isTopicComplete(topicUuid, email) {
		// if (topicUuid == 'topic2') {
		// 	return true
		// }

		const [mcqs, gridins] = await API.query(
			'select questions.id, questions.questionTypes_id from topics inner join subtopics on topics.id = subtopics.topics_id inner join examples on subtopics.id = examples.subtopics_id inner join questions on examples.id = questions.examples_id where topics.uuid = ?',
			[topicUuid],
			403
		).then((res) => {
			const mcqs = res.filter((row) => row['questionTypes_id'] === 1).map((row) => row['id'])
			const gridins = res
				.filter((row) => row['questionTypes_id'] === 2)
				.map((row) => row['id'])

			return [mcqs, gridins]
		})

		if (!mcqs[0] || !gridins[0]) {
			return true
		}

		const mcqsDone = await API.query(
			'select answersMC.id from answersMC inner join multipleChoice on multipleChoice.id = answersMC.multipleChoice_id inner join users on answersMC.users_id = users.id where multipleChoice.questionUsage_id = 2 and users.email = ? and multipleChoice.questions_id in (?)',
			[email, mcqs],
			403
		).then((res) => {
			if (res[0]) {
				return res.map((row) => row['id'])
			}
		})

		const gridinsDone = await API.query(
			'select answersGrid.id from answersGrid inner join gridIn on gridIn.id = answersGrid.gridIn_id join users on answersGrid.users_id = users.id where gridIn.questionUsage_id = 2 and users.email = ? and gridIn.questions_id in (?) ',
			[email, gridins],
			403
		).then((res) => {
			if (res[0]) {
				return res.map((row) => row['id'])
			}
		})

		if (
			mcqsDone &&
			gridinsDone &&
			mcqs.length === mcqsDone.length &&
			gridins.length === gridinsDone.length
		) {
			return true
		} else {
			return false
		}
	},

	async get(email) {
		let topics = await API.query('select * from topics;', [], 403).then((res) => {
			return res.map((topic, i) => {
				return {
					key: String(i + 1),
					uuid: topic['uuid'],
					name: topic['title'],
				}
			})
		})

		await Promise.all(
			topics.map(async (topic) => {
				topic['isComplete'] = await this.isTopicComplete(topic['uuid'], email)
			})
		)

		return topics
	},
}

module.exports = practice
