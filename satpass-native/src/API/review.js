import API from './API'

const review = {
	async get() {
		return API.fetch('review', {})
	},
}

export default review
