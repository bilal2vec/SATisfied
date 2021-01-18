import React from 'react'

import { SafeAreaView, View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native'

import { NeuView } from 'react-native-neu-element'

import MCQ from '../../Components/MCQ/MCQ'
import Gridin from '../../Components/Gridin/Gridin'
import BottomSheet from '../../Components/BottomSheet/BottomSheet'
import NeuButton from '../../Components/NeuButton/NeuButton'

import reviewQuestion from '../../API/reviewQuestion'

import styles from '../../styles/commonStyles'

class ReviewQuestion extends React.Component {
	state = {
		message: '',

		currentQuestion: 0,
		numQuestions: null,
		questionUUID: null,
		type: null,

		solution: null,

		solutionBottomSheet: false,
	}

	handleBottomSheets = (name, value) => {
		this.setState({ [name]: value })
	}

	onReason = (value) => {
		reviewQuestion
			.submit(value, this.state.questionUUID, this.state.type)
			.then((res) => {
				if (res['status'] === 201) {
					if (this.state.currentQuestion == this.state.numQuestions - 1) {
						const sectionType =
							this.props.route.params?.section_type ?? 'NO_SECTION_TYPE'
						const reviewDone = sectionType === 2 ? true : false

						this.props.navigation.navigate('Review', {
							reviewDone: reviewDone,
							sectionDone: sectionType,
							refresh: true,
						})
					} else {
						this.setState({ currentQuestion: this.state.currentQuestion + 1 })
					}
				} else {
					this.setState({
						message: 'There was a problem submitting your review, please try again',
					})
				}
			})
			.catch((err) => {
				this.setState({
					message: 'There was a problem submitting your review, please try again',
				})
			})
	}

	fetchData() {
		const testUUID = this.props.route.params?.uuid ?? 'NO_UUID'
		const sectionType = this.props.route.params?.section_type ?? 'NO_SECTION_TYPE'

		reviewQuestion
			.get(testUUID, sectionType, this.state.currentQuestion)
			.then((res) => {
				this.setState(res)
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem fetching your data' })
			})
	}

	componentDidMount() {
		this.props.navigation.setParams({
			currentQuestion: this.state.currentQuestion,
			numQuestions: this.state.numQuestions,
		})

		this.fetchData()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.currentQuestion !== this.state.currentQuestion) {
			this.fetchData()
		}

		if (prevState.currentQuestion !== this.state.currentQuestion) {
			this.props.navigation.setParams({ currentQuestion: this.state.currentQuestion })
		}

		if (prevState.numQuestions !== this.state.numQuestions) {
			this.props.navigation.setParams({ numQuestions: this.state.numQuestions })
		}
	}

	getSolution = (solution) => {
		this.setState({ solution: solution })
	}

	render() {
		return (
			<>
				<BottomSheet
					type='solutionBottomSheet'
					isActive={this.state.solutionBottomSheet}
					onClose={() => this.setState({ solutionBottomSheet: false })}
				>
					<Text>Solution: {this.state.solution}</Text>
				</BottomSheet>
				<ScrollView>
					<SafeAreaView style={styles.page}>
						{this.state.message !== '' && (
							<Text style={[styles.message]}>{this.state.message}</Text>
						)}

						<View style={{ marginTop: 25 }}>
							{this.state.type == 'mcq' && (
								<MCQ
									disabled={true}
									getAnswer={true}
									questionUUID={this.state.questionUUID}
									usage={1}
									getSolution={this.getSolution}
									handleBottomSheets={this.handleBottomSheets}
								/>
							)}
							{this.state.type == 'gridin' && (
								<Gridin
									disabled={true}
									getAnswer={true}
									questionUUID={this.state.questionUUID}
									usage={1}
									getSolution={this.getSolution}
									handleBottomSheets={this.handleBottomSheets}
								/>
							)}
							{this.state.type && (
								<NeuView
									color='#EBECF0'
									height={205}
									width={Dimensions.get('window').width - 50}
									borderRadius={10}
									customDarkShadow={{
										color: '#d4d4d8',
										offsetX: 5,
										offsetY: 5,
										blur: 20,
										opacity: 1,
									}}
									style={{ marginTop: 15 }}
								>
									<View
										style={{
											justifyContent: 'space-between',
											width: '100%',
										}}
									>
										<View style={{ width: '100%' }}>
											<Text
												style={{
													fontFamily: 'Roboto_Slab_Bold',
													fontSize: 18,
													marginLeft: 15,
												}}
											>
												Analysis
											</Text>
											<Text
												style={{
													fontFamily: 'Roboto_Slab',
													fontSize: 16,
													marginLeft: 15,
												}}
											>
												Why did you get this question wrong?
											</Text>
										</View>
										<View style={{ width: '100%', alignItems: 'center' }}>
											<TouchableOpacity
												onPress={() => this.onReason(0)}
												style={{ marginTop: 15 }}
											>
												<Text
													style={{
														fontFamily: 'Roboto_Slab_Bold',
														fontSize: 16,
													}}
												>
													I didn't know how to solve the question
												</Text>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => this.onReason(1)}
												style={{ marginTop: 15 }}
											>
												<Text
													style={{
														fontFamily: 'Roboto_Slab_Bold',
														fontSize: 16,
													}}
												>
													The question was just too hard
												</Text>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => this.onReason(2)}
												style={{ marginTop: 15 }}
											>
												<Text
													style={{
														fontFamily: 'Roboto_Slab_Bold',
														fontSize: 16,
													}}
												>
													I didn't have enough time
												</Text>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => this.onReason(3)}
												style={{ marginTop: 15 }}
											>
												<Text
													style={{
														fontFamily: 'Roboto_Slab_Bold',
														fontSize: 16,
													}}
												>
													I made a careless mistake
												</Text>
											</TouchableOpacity>
										</View>
									</View>
								</NeuView>
							)}
						</View>
					</SafeAreaView>
				</ScrollView>
			</>
		)
	}
}

export default ReviewQuestion
