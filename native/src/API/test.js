import API from './API'

const test = {
	async get() {
		return API.fetch('test', {}).then((res) => {
			return res
		})
	},
}

export default test
