import API from './API'

const gridin = {
	async get(questionUUID, usage, getAnswer) {
		return API.fetch('gridin', {
			questionUUID: questionUUID,
			usage: usage,
			getAnswer: getAnswer,
		}).then((res) => {
			return res
		})
	},
}

export default gridin
