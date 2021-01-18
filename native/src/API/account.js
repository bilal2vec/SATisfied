import API from './API'

const account = {
	async get() {
		return API.fetch('account', {})
	},

	async edit(name, value) {
		return API.fetch('account/' + name + '/edit', { value: value })
	},

	async deleteShareEmail(email) {
		return API.fetch('account/shareEmail/delete', { value: email })
	},

	async delete() {
		return API.fetch('account/delete', {})
	},
}

export default account
