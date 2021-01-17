import React from 'react'

import {
	SafeAreaView,
	View,
	Text,
	Image,
	KeyboardAvoidingView,
	TouchableOpacity,
} from 'react-native'

import { AppLoading } from 'expo'
import * as Font from 'expo-font'

import Form from '../../Components/Form/Form'

import google from '../../API/google'

import commonStyles from '../../styles/commonStyles.js'

class Login extends React.Component {
	state = {
		fontLoaded: false,
	}

	googleLogin() {
		google.authenticate(this.props.navigation).catch((err) => {
			this.setState({ message: 'Could not login with google' })
		})
	}

	async componentDidMount() {
		await Font.loadAsync({
			Roboto_Mono: require('../../../assets/fonts/RobotoMono-Bold.ttf'),
			Roboto_Slab_Bold: require('../../../assets/fonts/RobotoSlab-Bold.ttf'),
			Roboto_Slab: require('../../../assets/fonts/RobotoSlab-Regular.ttf'),
		})
		this.setState({ fontLoaded: true })
	}
	render() {
		return this.state.fontLoaded ? (
			<KeyboardAvoidingView
				style={commonStyles.page}
				behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
			>
				<View style={[commonStyles.pageItems]}>
					<Image
						source={require('../../../assets/logo/logo.png')}
						style={{ marginTop: 25 }}
					/>
					<Text style={{ fontFamily: 'Roboto_Mono', fontSize: 18, marginTop: 15 }}>
						Ordinary students;
					</Text>
					<Text style={{ fontFamily: 'Roboto_Mono', fontSize: 18 }}>
						Extraordinary results
					</Text>
				</View>
				<View style={[commonStyles.pageItems]}>
					<TouchableOpacity
						onPress={() => {
							this.googleLogin()
						}}
					>
						<Image
							source={require('../../../assets/google/google.png')}
							style={{
								height: 50,
								width: '100%',
								borderRadius: 5,
								resizeMode: 'center',
							}}
						/>
					</TouchableOpacity>
					<Form navigation={this.props.navigation} />
				</View>
			</KeyboardAvoidingView>
		) : (
			<AppLoading />
		)
	}
}

export default Login
