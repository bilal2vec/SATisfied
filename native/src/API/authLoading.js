import API from './API'

const authLoading = {
	async getTab() {
		return API.fetch('authLoading', {}).then((res) => {
			return res
		})
	},
}

export default authLoading
