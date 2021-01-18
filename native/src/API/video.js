import API from './API'

const video = {
	async get(topicUuid, videoNumber) {
		return API.fetch('learn/video', { topicUUID: topicUuid, videoNumber: videoNumber }).then(
			(res) => {
				return res
			}
		)
	},
}

export default video
