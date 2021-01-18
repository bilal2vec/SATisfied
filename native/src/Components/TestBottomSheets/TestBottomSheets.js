import React from 'react'

import { View, Text, Button } from 'react-native'

import BottomSheet from '../BottomSheet/BottomSheet'
import AnswerSheet from '../AnswerSheet/AnswerSheet'

import NeuButton from '../NeuButton/NeuButton'

const TestBottomSheets = ({
	uuid,
	instructionsActive,
	formulasActive,
	answersActive,
	submitActive,
	onClose,
	onChangeQuestion,
	onSubmit,
	userAnswers,
}) => {
	return [
		<BottomSheet type='instructions' isActive={instructionsActive} onClose={onClose}>
			<Text>Instructions</Text>
		</BottomSheet>,
		<BottomSheet type='formulas' isActive={formulasActive} onClose={onClose}>
			<Text>Formulas</Text>
		</BottomSheet>,
		<AnswerSheet
			uuid={uuid}
			onPress={onChangeQuestion}
			isActive={answersActive}
			onClose={onClose}
			userAnswers={userAnswers}
		/>,
		<BottomSheet
			type='submit'
			isActive={submitActive}
			onClose={(name, value) => onClose(name, value, true)}
		>
			<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 22, marginLeft: 15 }}>
				Submit Test
			</Text>
			<View style={{ alignItems: 'center' }}>
				<NeuButton onPress={onSubmit}>Submit</NeuButton>
			</View>
		</BottomSheet>,
	]
}

export default TestBottomSheets
