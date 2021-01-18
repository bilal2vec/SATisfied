import React from 'react'

import { Text, TouchableHighlight } from 'react-native'

const AnswerSheetAnswer = ({ type, pressHandler, uuid, questionNumber, answer, confidence }) => {
	let formattedAnswer

	if (type == 'mcq') {
		formattedAnswer = (
			<Text>
				{answer == 0 ? 'X' : 'O'} {answer == 1 ? 'X' : 'O'} {answer == 2 ? 'X' : 'O'}{' '}
				{answer == 3 ? 'X' : 'O'}
			</Text>
		)
	} else {
		formattedAnswer = (
			<Text>
				{answer != null && answer[0] + ' ' + answer[1] + ' ' + answer[2] + ' ' + answer[3]}
			</Text>
		)
	}

	return (
		<TouchableHighlight onPress={() => pressHandler(questionNumber)}>
			<Text>
				{questionNumber}. {formattedAnswer} confidence: {confidence}
			</Text>
		</TouchableHighlight>
	)
}

export default AnswerSheetAnswer
