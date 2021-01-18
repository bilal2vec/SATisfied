import API from './API'

const practice = {
	async get() {
		return API.fetch('practice', {}).then((res) => {
			return res
		})
	},
}

export default practice
