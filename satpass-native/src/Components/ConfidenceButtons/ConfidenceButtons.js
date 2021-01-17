import React from 'react'

import { View, Button, Text, Dimensions, TouchableOpacity } from 'react-native'

import { NeuView } from 'react-native-neu-element'

class ConfidenceButtons extends React.Component {
	render() {
		return (
			<View style={{ marginTop: 25, width: '100%' }}>
				<Text
					style={{
						fontFamily: 'Roboto_Slab_Bold',
						fontSize: 18,
						marginLeft: 25,
					}}
				>
					Confidence:
				</Text>
				<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 16, marginLeft: 25 }}>
					How confident are you with your choice?
				</Text>
				<View style={{ alignSelf: 'center', marginTop: 15 }}>
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width - 50}
						borderRadius={10}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<View
							style={{
								height: '100%',
								width: '100%',
								justifyContent: 'space-evenly',
							}}
						>
							<TouchableOpacity onPress={() => this.props.onPress(0)}>
								<Text
									style={{
										fontFamily: 'Roboto_Slab_Bold',
										fontSize: 18,
										alignSelf: 'center',
									}}
								>
									High
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.props.onPress(1)}>
								<Text
									style={{
										fontFamily: 'Roboto_Slab_Bold',
										fontSize: 18,
										alignSelf: 'center',
									}}
								>
									Medium
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.props.onPress(2)}>
								<Text
									style={{
										fontFamily: 'Roboto_Slab_Bold',
										fontSize: 18,
										alignSelf: 'center',
									}}
								>
									Low
								</Text>
							</TouchableOpacity>
						</View>
					</NeuView>
				</View>
			</View>
		)
	}
}

export default ConfidenceButtons
