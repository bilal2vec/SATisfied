import React from 'react'

import { SafeAreaView, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'

import TestBottomSheets from '../../Components/TestBottomSheets/TestBottomSheets'

import MCQ from '../../Components/MCQ/MCQ'
import Gridin from '../../Components/Gridin/Gridin'

import ConfidenceButtons from '../../Components/ConfidenceButtons/ConfidenceButtons'

import testQuestion from '../../API/testQuestion'

import styles from '../../styles/commonStyles'

class TestQuestion extends React.Component {
	state = {
		message: '',

		instructions: false,
		formulas: false,
		answers: false,
		submit: false,

		currentQuestion: 0,
		numQuestions: null,

		questionUUID: null,
		type: null,

		answerChoice: null,
		userAnswers: [],

		onConfidence: false,
		lastQuestionDone: false,
		timeRanOut: false,
	}

	fetchData() {
		const sectionUUID = this.props.route.params?.sectionUUID ?? 'NO_UUID'

		testQuestion
			.get(sectionUUID, this.state.currentQuestion)
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
			onConfidence: this.state.onConfidence,
			currentQuestion: this.state.currentQuestion,
			lastQuestionDone: this.state.lastQuestionDone,
			handleTimeRanOut: this.handleTimeRanOut,
			handleAnswer: this.handleAnswer,
		})

		this.fetchData()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.currentQuestion !== this.state.currentQuestion) {
			this.fetchData()
		}

		if (
			prevState.currentQuestion !== this.state.currentQuestion &&
			prevState.lastQuestionDone == true
		) {
			this.setState({
				onConfidence: false,
				lastQuestionDone: false,
			})
		}

		if (prevState.onConfidence !== this.state.onConfidence) {
			this.props.navigation.setParams({ onConfidence: this.state.onConfidence })
		}

		if (prevState.currentQuestion !== this.state.currentQuestion) {
			this.props.navigation.setParams({ currentQuestion: this.state.currentQuestion })
		}

		if (prevState.lastQuestionDone !== this.state.lastQuestionDone) {
			this.props.navigation.setParams({ lastQuestionDone: this.state.lastQuestionDone })
		}
	}

	handleBottomSheets = (name, value, isSubmit = false) => {
		if (isSubmit) {
			this.setState({
				[name]: value,
				onConfidence: false,
				lastQuestionDone: false,
			})
		} else {
			this.setState({ [name]: value })
		}
	}

	goToQuestion = (question) => {
		if (this.state.currentQuestion == this.state.numQuestions - 1) {
			this.setState({
				lastQuestionDone: true,
				submit: true,
				answerChoice: null,
				answer: false,
			})
		} else {
			this.setState({
				currentQuestion: question,
				onConfidence: false,
				answerChoice: null,
				answer: false,
			})
		}
	}

	handleTimeRanOut = () => {
		this.setState({ timeRanOut: true, submit: true })
	}

	handleAnswer = (start, stop) => {
		let answer = this.state.answerChoice
		let userAnswers = this.state.userAnswers

		let idx = userAnswers.findIndex((userAnswer) => userAnswer.uuid == answer.uuid)

		answer['start'] = start
		answer['stop'] = stop

		if (idx === -1) {
			userAnswers = [...userAnswers, answer]
		} else {
			userAnswers[idx] = answer
		}

		this.setState({
			userAnswers: userAnswers,
			onConfidence: true,
		})
	}

	handleConfidence = (confidence) => {
		let answer = this.state.answerChoice
		answer['confidence'] = confidence

		this.setState({ answerChoice: answer })

		this.goToQuestion(this.state.currentQuestion + 1)
	}

	submit = () => {
		const sectionUUID = this.props.route.params?.sectionUUID ?? 'NO_UUID'

		testQuestion
			.submit(sectionUUID, this.state.userAnswers)
			.then((res) => {
				if (res['status'] === 201) {
					this.props.navigation.navigate('Test', { refresh: true })
				} else {
					this.setState({
						message: 'There was a problem submitting your test, please try again',
					})
				}
			})
			.catch((error) => {
				this.setState({
					message: 'There was a problem submitting your test, please try again',
				})
			})
	}

	render() {
		let disableBack = this.state.currentQuestion == 0 ? true : false
		let disableNext = this.state.currentQuestion < this.state.numQuestions - 1 ? false : true

		if (!this.state.lastQuestionDone) {
			disableBack = disableBack || this.state.onConfidence
			disableNext = disableNext || this.state.onConfidence
		}

		return (
			<>
				<TestBottomSheets
					uuid={this.props.route.params?.sectionUUID ?? 'NO_UUID'}
					instructionsActive={this.state.instructions}
					formulasActive={this.state.formulas}
					answersActive={this.state.answers}
					submitActive={this.state.submit}
					onClose={this.handleBottomSheets}
					onChangeQuestion={(questionNumber) =>
						this.setState({
							currentQuestion: questionNumber,
							onConfidence: false,
							answers: false,
						})
					}
					onSubmit={() => this.submit()}
					userAnswers={this.state.userAnswers}
				/>
				<ScrollView>
					<SafeAreaView style={[styles.page, { justifyContent: 'flex-start' }]}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
								marginTop: 25,
							}}
						>
							<TouchableOpacity
								disabled={disableBack}
								onPress={() =>
									this.setState({
										currentQuestion: this.state.currentQuestion - 1,
									})
								}
								style={{
									width: 50,
									alignItems: 'center',
								}}
							>
								<Image source={require('../../../assets/left/left.png')} />
							</TouchableOpacity>
							<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 16 }}>
								{this.state.currentQuestion + 1} / {this.state.numQuestions}
							</Text>
							<TouchableOpacity
								disabled={disableNext}
								onPress={() =>
									this.setState({
										currentQuestion: this.state.currentQuestion + 1,
									})
								}
								style={{
									width: 50,
									alignItems: 'center',
								}}
							>
								<Image source={require('../../../assets/right/right.png')} />
							</TouchableOpacity>
						</View>

						<Text style={styles.message}>{this.state.message}</Text>

						{this.state.type == 'mcq' && (
							<MCQ
								disabled={this.state.onConfidence}
								questionUUID={this.state.questionUUID}
								onPress={(choice, mcqUUID) =>
									this.setState({
										onConfidence: true,
										answerChoice: {
											choice: choice,
											uuid: mcqUUID,
											type: 'mcq',
											questionNumber: this.state.currentQuestion,
										},
									})
								}
								usage={1}
							/>
						)}
						{this.state.type == 'gridin' && (
							<Gridin
								disabled={this.state.onConfidence}
								questionUUID={this.state.questionUUID}
								onPress={(boxOne, boxTwo, boxThree, boxFour, gridInUUID) =>
									this.setState({
										onConfidence: true,
										answerChoice: {
											boxOne: boxOne,
											boxTwo: boxTwo,
											boxThree: boxThree,
											boxFour: boxFour,
											uuid: gridInUUID,
											type: 'gridin',
											questionNumber: this.state.currentQuestion,
										},
									})
								}
								usage={1}
							/>
						)}

						{this.state.onConfidence && !this.state.lastQuestionDone && (
							<ConfidenceButtons
								onPress={(confidence) => this.handleConfidence(confidence)}
							/>
						)}
					</SafeAreaView>
				</ScrollView>
			</>
		)
	}
}

export default TestQuestion
