import * as Expo from 'expo'
import { AsyncStorage } from 'react-native'

import * as Google from 'expo-google-app-auth'

import API from './API'
import authLoading from './authLoading'

const google = {
	async getDefaultTab() {
		return await authLoading
			.getTab()
			.then((res) => {
				return res['tab']
			})
			.catch((error) => {
				this.setState({ message: 'Could not log you in' })
			})
	},

	async authenticate(nav) {
		return Google.logInAsync({
			iosClientId: '997427761641-03i1nq43d25sgra7f7rcit472vh0itda.apps.googleusercontent.com',
			androidClientId:
				'997427761641-9746b92kt8sqlr52lo7b8odt579rck9f.apps.googleusercontent.com',
		})
			.then((results) => {
				const user = results['user']
				const socialToken = results['accessToken']
				const email = user['email']
				const firstName = user['givenName']
				const lastName = user['familyName']

				return API.fetch(
					'glogin',
					{
						network: 'google',
						socialToken: socialToken,
						email: email,
						firstName: firstName,
						lastName: lastName,
					},
					false
				)
			})
			.then(async (res) => {
				const token = res['token']
				await AsyncStorage.setItem('userToken', token)
				if (res['status'] === 200 || res['status'] === 201) {
					const defaultTab = await this.getDefaultTab()

					nav.navigate('Tabs', { screen: defaultTab, refresh: true })
				} else {
					throw new Error(403)
				}
			})
			.catch((error) => {
				throw new Error(error)
			})
	},
}
export default google
