import API from './API'

const learn = {
	async get() {
		return API.fetch('learn', {}).then((res) => {
			return res
		})
	},
}

export default learn
