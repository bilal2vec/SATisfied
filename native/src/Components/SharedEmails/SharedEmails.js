import React from 'react'

import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native'

class ShareEmails extends React.Component {
	render() {
		const shareEmails = this.props.shareEmails.map((email, i) => {
			return (
				<View style={{ flexDirection: 'row', marginTop: 5 }} key={i}>
					<TextInput
						style={{
							backgroundColor: 'white',
							borderRadius: 5,
							fontFamily: 'Roboto_Slab',
							fontSize: 16,
							padding: 5,
							flex: 2,
							flexBasis: 0,
							marginLeft: 15,
						}}
						placeholder={'New Share Email'}
						name='shareEmails'
						value={email}
						editable={false}
					/>

					<TouchableOpacity onPress={() => this.props.deleteShareEmailHandler(email)}>
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
							Delete
						</Text>
					</TouchableOpacity>
				</View>
			)
		})

		return (
			<View style={{ marginTop: 15 }}>
				{this.props.shareEmails[0] != null && shareEmails}
				<View style={{ flexDirection: 'row', marginTop: 5 }}>
					<TextInput
						style={{
							backgroundColor: 'white',
							borderRadius: 5,
							fontFamily: 'Roboto_Slab',
							fontSize: 16,
							padding: 5,
							flex: 2,
							flexBasis: 0,
							marginLeft: 15,
						}}
						placeholder='Email'
						name='newShareEmail'
						value={this.props.value}
						onChangeText={this.props.changeNewEmailHandler}
						autoCapitalize={false}
						autoCompleteType={'email'}
						autoCorrect={false}
						keyboardType='email-address'
					/>

					<TouchableOpacity
						onPress={() => this.props.saveHandler('shareEmail', this.props.value)}
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
			</View>
		)
	}
}

export default ShareEmails
