import API from './API'

const form = {
	async authenticate(email, password) {
		return API.fetch('form', { email: email, password: password }, false)
	},
}

export default form
