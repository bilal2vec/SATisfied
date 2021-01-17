import { AsyncStorage } from 'react-native'

import URL from '../../URL'

function requestURL() {
	if (process.env.NODE_ENV === 'development') {
		return URL
	} else {
		return 'https://api.mathpass.ca/'
	}
}

const API = {
	async fetch(uri, body, pass_token = true) {
		const url = requestURL() + uri

		if (pass_token) {
			body['token'] = await AsyncStorage.getItem('userToken')
		}

		return fetch(url, {
			method: 'post',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(body),
		}).then((res) => {
			if (res.status === 404) {
				throw new Error('Resource not found')
			} else if (res.status === 403) {
				throw new Error('Wrong credentials')
			} else if (res.status === 204) {
				return true
			} else {
				return res.json()
			}
		})
	},
}

export default API
