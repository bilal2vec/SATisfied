import API from './API'

const mcq = {
	async get(questionUUID, usage, getAnswer) {
		return API.fetch('mcq', {
			questionUUID: questionUUID,
			usage: usage,
			getAnswer: getAnswer,
		}).then((res) => {
			return res
		})
	},
}

export default mcq
