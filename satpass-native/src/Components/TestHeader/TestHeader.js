import React from 'react'

import { SafeAreaView, View, Text, Button, Image, Dimensions, TouchableOpacity } from 'react-native'

import { NeuView } from 'react-native-neu-element'

import Timer from '../Timer/Timer'

const TestHeader = ({
	navigation,
	disabled,
	lastQuestionDone,
	currentQuestion,
	time,
	uuid,
	onPress,
	onTimeRanOut,
	onConfidence,
	testStarted = true,
	sectionType,
}) => {
	let isDisabled
	if (lastQuestionDone == true) {
		isDisabled = false
	} else {
		isDisabled = disabled
	}

	return (
		<NeuView
			color='#EBECF0'
			height={130}
			width={Dimensions.get('window').width}
			borderRadius={25}
			customDarkShadow={{
				color: '#d4d4d8',
				offsetX: 5,
				offsetY: 5,
				blur: 20,
				opacity: 1,
			}}
		>
			<SafeAreaView style={{ flexDirection: 'column', marginTop: 30 }}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						width: '100%',
						alignItems: 'center',
					}}
				>
					{navigation && (
						<TouchableOpacity onPress={() => navigation.navigate('Test')}>
							<Image source={require('../../../assets/back/back.png')} />
						</TouchableOpacity>
					)}
					<Text
						style={{
							fontFamily: 'Roboto_Slab_Bold',
							fontSize: 18,
						}}
					>
						Test #1: {sectionType}
					</Text>
					<Timer
						paused={disabled || !testStarted}
						time={time}
						currentQuestion={currentQuestion}
						onTimeRanOut={onTimeRanOut}
						onConfidence={onConfidence}
					/>
				</View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						marginTop: 15,
					}}
				>
					<TouchableOpacity
						disabled={isDisabled}
						onPress={() => onPress('instructions', true)}
					>
						<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 16 }}>
							Instructions
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						disabled={isDisabled}
						onPress={() => onPress('formulas', true)}
					>
						<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 16 }}>
							Formulas
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						disabled={isDisabled}
						onPress={() => onPress('answers', true)}
					>
						<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 16 }}>
							Answers
						</Text>
					</TouchableOpacity>
					<TouchableOpacity disabled={isDisabled} onPress={() => onPress('submit', true)}>
						<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 16 }}>Submit</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</NeuView>
	)
}

export default TestHeader
