import React from 'react'

import { View, Text, AsyncStorage, TextInput } from 'react-native'

import form from '../../API/form'
import authLoading from '../../API/authLoading'

import NeuButton from '../NeuButton/NeuButton'

import styles from '../../styles/commonStyles'

class Form extends React.Component {
	constructor(props) {
		super(props)

		this.state = { email: '', password: '', message: '' }
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

	login() {
		form.authenticate(this.state.email, this.state.password)
			.then((res) => {
				if (res['status'] !== 200 && res['status'] !== 201) {
					throw new Error(res['status'])
				} else {
					return res
				}
			})
			.then(async (res) => {
				await AsyncStorage.setItem('userToken', res['token'])
				const defaultTab = await this.getDefaultTab()

				this.props.navigation.navigate('Tabs', { screen: defaultTab, refresh: true })
			})
			.catch((error) => {
				this.setState({
					message: error.message,
				})
			})
	}

	render() {
		return (
			<View>
				<TextInput
					style={{
						backgroundColor: 'white',
						borderRadius: 5,
						fontFamily: 'Roboto_Slab',
						fontSize: 16,
						padding: 5,
						width: '100%',
						marginTop: 15,
						height: 35,
					}}
					placeholder='Email'
					onChangeText={(text) => this.setState({ email: text })}
					value={this.state.email}
					placeholderTextColor='black'
					autoCapitalize={false}
					autoCompleteType={'email'}
					autoCorrect={false}
					keyboardType={'email-address'}
				/>

				<TextInput
					style={{
						backgroundColor: 'white',
						borderRadius: 5,
						fontFamily: 'Roboto_Slab',
						fontSize: 16,
						padding: 5,
						width: '100%',
						marginTop: 15,
						height: 35,
					}}
					placeholder='Password'
					onChangeText={(text) => this.setState({ password: text })}
					value={this.state.password}
					placeholderTextColor='black'
					autoCapitalize={false}
					autoCompleteType={'email'}
					autoCorrect={false}
					secureTextEntry={true}
				/>
				<NeuButton
					onPress={() => {
						this.login()
					}}
				>
					Continue
				</NeuButton>
				<Text style={styles.message}>{this.state.message}</Text>
			</View>
		)
	}
}

export default Form
