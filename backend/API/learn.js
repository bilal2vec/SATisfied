const API = require('./API')

const learn = {
	async get() {
		return API.query('select * from topics;', [], 403).then((res) => {
			return res.map((topic, i) => {
				return {
					key: String(i + 1),
					uuid: topic['uuid'],
					name: topic['title'],
				}
			})
		})
	},

	async getVideo(topicUUID, videoNumber) {
		return API.query(
			'select examples.videoUrl, examples.transcriptUrl from examples inner join subtopics on subtopics.id = examples.subtopics_id inner join topics on topics.id = subtopics.topics_id where topics.uuid = ?;',
			[topicUUID],
			403
		).then((res) => {
			const numVideos = res.length
			const video = res[videoNumber]

			return {
				video: video['videoUrl'],
				transcriptUrl: video['transcriptUrl'],
				numVideos: numVideos,
			}
		})
	},
}

module.exports = learn
