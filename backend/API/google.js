const API = require('./API')

const google = {
	async validate(token) {
		return API.fetch('https://www.googleapis.com/oauth2/v3/tokeninfo', {
			access_token: token,
		}).then((res) => {
			// make sure token is valid
			if (res.status == 200) {
				return res.json()
			} else {
				throw new Error(res.status)
			}
		})
	},
}

module.exports = google
