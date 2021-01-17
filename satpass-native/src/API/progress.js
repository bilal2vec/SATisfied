import API from './API'

const progress = {
	async get() {
		return API.fetch('progress', {}).then((res) => {
			return res
		})
	},
}

export default progress
