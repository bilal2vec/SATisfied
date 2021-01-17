import React from 'react'

import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native'

class UserDataField extends React.Component {
	render() {
		return (
			<View style={{ flexDirection: 'row', height: 35, marginTop: 5 }}>
				<Text
					style={{
						fontFamily: 'Roboto_Slab_Bold',
						fontSize: 18,
						marginLeft: 15,
						alignSelf: 'center',
						flex: 1,
						flexBasis: 0,
					}}
				>
					{this.props.displayName}:{' '}
				</Text>
				<TextInput
					style={{
						backgroundColor: 'white',
						borderRadius: 5,
						fontFamily: 'Roboto_Slab',
						fontSize: 16,
						padding: 5,
						flex: 2,
						flexBasis: 0,
					}}
					name={this.props.name}
					value={this.props.value}
					placeholder={this.props.placeholder}
					onChangeText={this.props.changeHandler}
					autoCapitalize={false}
					autoCompleteType={'email'}
					autoCorrect={false}
					keyboardType={this.props.type === 'email-address' ? 'email-address' : 'default'}
					secureTextEntry={this.props.secureEntry ? true : false}
				/>

				<TouchableOpacity
					onPress={() => this.props.saveHandler(this.props.name, this.props.value)}
				>
					<Text
						style={{
							fontFamily: 'Roboto_Slab_Bold',
							fontSize: 16,
							height: 35,
							width: 60,
							alignSelf: 'center',
							textAlign: 'center',
							textAlignVertical: 'center',
							paddingTop: 6,
							color: '#828299',
						}}
					>
						Save
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

export default UserDataField
