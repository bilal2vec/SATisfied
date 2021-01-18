import React from 'react'
import { SafeAreaView, View, Text, ScrollView } from 'react-native'
import { evaluate } from 'mathjs'

import BottomSheet from '../../Components/BottomSheet/BottomSheet'
import NeuButton from '../../Components/NeuButton/NeuButton'
import MCQ from '../../Components/MCQ/MCQ'
import Gridin from '../../Components/Gridin/Gridin'

import practiceQuestion from '../../API/practiceQuestion'

import styles from '../../styles/commonStyles'

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index
}

class PracticeQuestion extends React.Component {
	state = {
		message: '',
		formulas: false,
		solution: false,
		solutionText: '',

		currentQuestion: 0,
		numQuestions: 0,
		questionUUID: null,
		question: null,
		questionAnswer: null,
		type: null,

		checked: false,
		checkMessage: '',
	}

	fetchData() {
		const topicUUID = this.props.route.params?.topicUUID ?? 'NO_UUID'

		practiceQuestion
			.get(topicUUID, this.state.currentQuestion)
			.then((res) => {
				this.setState(res)
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem fetching your data' })
			})
	}

	componentDidMount() {
		this.props.navigation.setParams({
			handleBottomSheets: this.handleBottomSheets,
			checked: this.state.checked,
			currentQuestion: this.state.currentQuestion,
			numQuestions: this.state.numQuestions,
		})

		this.fetchData()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.currentQuestion !== this.state.currentQuestion) {
			this.props.navigation.setParams({ currentQuestion: this.state.currentQuestion })
			this.fetchData()
		}

		if (prevState.checked !== this.state.checked) {
			this.props.navigation.setParams({ checked: this.state.checked })
		}

		if (prevState.numQuestions != this.state.numQuestions) {
			this.props.navigation.setParams({ numQuestions: this.state.numQuestions })
		}
	}

	handleBottomSheets = (name, value) => {
		this.setState({ [name]: value })
	}

	check(studentAnswer, uuid, type) {
		let correct
		if (type == 'mcq') {
			correct = studentAnswer.toString() === this.state.questionAnswer ? true : false
		} else {
			const questionAnswers = this.state.questionAnswer.map((answer) => {
				return evaluate(answer)
			})

			try {
				studentAnswer = evaluate(studentAnswer)
			} finally {
				correct = questionAnswers.includes(studentAnswer) ? true : false
			}
		}

		practiceQuestion
			.submit(correct, studentAnswer, uuid, type)
			.then((res) => {
				if (res['status'] === 201) {
					let formattedAnswer = []
					if (correct === false && type === 'gridin') {
						formattedAnswer = this.state.questionAnswer.map((row) => {
							return parseFloat(evaluate(row)).toString()
						})
						formattedAnswer = formattedAnswer.filter(onlyUnique)
					} else if (correct === false && type === 'mcq') {
						const mapping = ['A', 'B', 'C', 'D']
						formattedAnswer = mapping[this.state.questionAnswer]
					}
					this.setState({
						checkMessage:
							correct === true
								? 'Correct'
								: 'Incorrect; Correct answer(s): ' + formattedAnswer.toString(),
						checked: true,
					})
				} else {
					this.setState({
						message: 'There was a problem submitting your question, please try again',
					})
				}
			})
			.catch((err) => {
				this.setState({
					message: 'There was a problem submitting your question, please try again',
				})
			})
	}

	render() {
		let nextButton
		if (this.state.currentQuestion + 1 === this.state.numQuestions && this.state.checked) {
			nextButton = (
				<NeuButton
					onPress={() => this.props.navigation.navigate('Practice', { refresh: true })}
				>
					Back to practice
				</NeuButton>
			)
		} else if (this.state.checked === true) {
			nextButton = (
				<NeuButton
					onPress={() =>
						this.setState({
							currentQuestion: this.state.currentQuestion + 1,
							checkMessage: '',
							checked: false,
						})
					}
				>
					Next question
				</NeuButton>
			)
		}

		return (
			<>
				<BottomSheet
					type='formulas'
					name='Formulas'
					isActive={this.state.formulas}
					onClose={this.handleBottomSheets}
				>
					<Text>Formulas</Text>
				</BottomSheet>

				<BottomSheet
					type='solution'
					name='Solution'
					isActive={this.state.solution}
					onClose={this.handleBottomSheets}
				>
					<Text>Solution: {this.state.solutionText}</Text>
				</BottomSheet>
				<ScrollView>
					<SafeAreaView style={[styles.page, {}]}>
						<View>
							<Text style={[styles.message, { marginTop: 25 }]}>
								{this.state.message}
							</Text>

							{this.state.type == 'mcq' && (
								<MCQ
									disabled={this.state.checked}
									questionUUID={this.state.questionUUID}
									onPress={(studentAnswer, uuid) =>
										this.check(studentAnswer, uuid, 'mcq')
									}
									usage={2}
								/>
							)}
							{this.state.type == 'gridin' && (
								<Gridin
									disabled={this.state.checked}
									questionUUID={this.state.questionUUID}
									onPress={(boxOne, boxTwo, boxThree, boxFour, uuid) =>
										this.check(
											boxOne + boxTwo + boxThree + boxFour,
											uuid,
											'gridin'
										)
									}
									usage={2}
								/>
							)}
							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 18,
									marginTop: 15,
									textAlign: 'center',
								}}
							>
								{this.state.checkMessage}
							</Text>
						</View>

						{nextButton}
					</SafeAreaView>
				</ScrollView>
			</>
		)
	}
}

export default PracticeQuestion
