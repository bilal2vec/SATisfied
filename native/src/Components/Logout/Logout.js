import React from 'react'

import { Button, AsyncStorage } from 'react-native'

import NeuButton from '../NeuButton/NeuButton'

class Logout extends React.Component {
	constructor(props) {
		super(props)
	}

	async logout() {
		await AsyncStorage.removeItem('userToken')
		this.props.navigation.navigate('Login')
	}

	render() {
		return <NeuButton onPress={() => this.logout()}>Logout</NeuButton>
	}
}

export default Logout
