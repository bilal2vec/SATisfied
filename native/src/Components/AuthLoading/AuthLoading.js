import React from 'react'
import { AsyncStorage, View, Text } from 'react-native'

import * as Font from 'expo-font'

import authLoading from '../../API/authLoading'

class AuthLoading extends React.Component {
	constructor(props) {
		super(props)
		this._bootstrapAsync()

		this.state = { message: '' }
	}

	getDefaultTab = async () => {
		return await authLoading
			.getTab()
			.then((res) => {
				return res['tab']
			})
			.catch((error) => {
				this.setState({ message: 'Could not log you in' })
			})
	}

	_bootstrapAsync = async () => {
		const userToken = await AsyncStorage.getItem('userToken')
		const defaultTab = await this.getDefaultTab()

		await Font.loadAsync({
			Roboto_Mono: require('../../../assets/fonts/RobotoMono-Bold.ttf'),
			Roboto_Slab_Bold: require('../../../assets/fonts/RobotoSlab-Bold.ttf'),
			Roboto_Slab: require('../../../assets/fonts/RobotoSlab-Regular.ttf'),
		})

		if (userToken) {
			this.props.navigation.navigate('Tabs', { screen: defaultTab, refresh: true })
		} else {
			this.props.navigation.navigate('Login')
		}
	}

	render() {
		return (
			<View>
				<Text>{this.state.message}</Text>
			</View>
		)
	}
}

export default AuthLoading
