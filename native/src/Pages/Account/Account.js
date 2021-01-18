import React from 'react'

import { SafeAreaView, Text, AsyncStorage, View, TouchableOpacity, ScrollView } from 'react-native'

import account from '../../API/account'

import Logout from '../../Components/Logout/Logout'
import UserDataField from '../../Components/UserDataField/UserDataField'
import SharedEmails from '../../Components/SharedEmails/SharedEmails'

import styles from '../../styles/commonStyles'

class Account extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			email: '',
			password: '',
			signup_type: '',
			shareEmails: [],
			newShareEmail: '',
			message: '',
		}
		this.saveHandler = this.saveHandler.bind(this)
		this.deleteShareEmailHandler = this.deleteShareEmailHandler.bind(this)
		this.deleteHandler = this.deleteHandler.bind(this)
	}

	getData() {
		account
			.get()
			.then((res) => {
				this.setState(res)
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem fetching your data' })
			})
	}

	componentDidMount() {
		this.getData()
	}

	saveHandler(name, value) {
		account
			.edit(name, value)
			.then(async (res) => {
				if (name === 'email') {
					await AsyncStorage.removeItem('userToken')
					await AsyncStorage.setItem('userToken', res['token'])
				}

				if (res['status'] === 201) {
					this.setState({ newShareEmail: '' })
					this.getData()
				} else {
					this.setState({ message: 'There was a problem updating your data' })
				}
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem updating your data' })
			})
	}

	deleteShareEmailHandler(email) {
		account
			.deleteShareEmail(email)
			.then(async (res) => {
				if (res['status'] === 204) {
					this.getData()
				} else {
					this.setState({ message: 'There was a problem deleting the email' })
				}
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem deleting the email' })
			})
	}

	deleteHandler() {
		account
			.delete()
			.then(async (res) => {
				await AsyncStorage.removeItem('userToken')
				this.props.navigation.navigate('Login')
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem deleting your account' })
			})
	}

	render() {
		return (
			<ScrollView>
				<SafeAreaView style={[styles.page, { justifyContent: 'flex-start' }]}>
					<Text style={[styles.message, { marginTop: 25 }]}>{this.state.message}</Text>
					{this.state.signup_type === 'email' && (
						<View style={{ width: '100%' }}>
							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 22,
									marginLeft: 15,
								}}
							>
								User
							</Text>
							<UserDataField
								displayName='Email'
								name='email'
								value={this.state.email}
								changeHandler={(text) => this.setState({ email: text })}
								saveHandler={this.saveHandler}
								type='email-address'
							/>
							<UserDataField
								displayName='Password'
								name='password'
								placeholder='New Password'
								value={this.state.password}
								changeHandler={(text) => this.setState({ password: text })}
								saveHandler={this.saveHandler}
								secureEntry={true}
							/>
						</View>
					)}

					<View style={{ width: '100%', marginTop: 25 }}>
						<Text
							style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 22, marginLeft: 15 }}
						>
							Shared Emails
						</Text>

						<SharedEmails
							value={this.state.newShareEmail}
							shareEmails={this.state.shareEmails}
							changeNewEmailHandler={(text) => this.setState({ newShareEmail: text })}
							deleteShareEmailHandler={this.deleteShareEmailHandler}
							saveHandler={this.saveHandler}
						/>
					</View>

					<View style={{ width: '100%', marginTop: 25 }}>
						<Text
							style={{
								fontFamily: 'Roboto_Slab_Bold',
								fontSize: 22,
								marginLeft: 15,
								alignSelf: 'flex-start',
							}}
						>
							Support
						</Text>

						<TouchableOpacity
							style={{ marginTop: 5 }}
							onPress={() => this.props.navigation.navigate('FAQs')}
						>
							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 18,
									alignSelf: 'center',
								}}
							>
								FAQs
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{ marginTop: 5 }}
							onPress={() => this.props.navigation.navigate('ContactUs')}
						>
							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 18,
									alignSelf: 'center',
								}}
							>
								Contact Us
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{ marginTop: 5 }}
							onPress={() => this.props.navigation.navigate('Legal')}
						>
							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 18,
									alignSelf: 'center',
								}}
							>
								Legal
							</Text>
						</TouchableOpacity>
					</View>

					<View style={{ width: '100%', alignItems: 'center', marginTop: 25 }}>
						<Text
							style={{
								fontFamily: 'Roboto_Slab_Bold',
								fontSize: 22,
								marginLeft: 15,
								alignSelf: 'flex-start',
							}}
						>
							Account
						</Text>

						<TouchableOpacity style={{ marginTop: 5 }} onPress={this.deleteHandler}>
							<Text
								style={{
									color: 'red',
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 18,
									alignSelf: 'center',
								}}
							>
								Delete Account
							</Text>
						</TouchableOpacity>
						<Logout navigation={this.props.navigation} />
					</View>
				</SafeAreaView>
			</ScrollView>
		)
	}
}

export default Account
