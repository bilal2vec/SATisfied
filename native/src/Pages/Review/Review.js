import React from 'react'

import {
	View,
	Text,
	SectionList,
	SafeAreaView,
	Dimensions,
	TouchableOpacity,
	ScrollView,
} from 'react-native'

import { NeuView } from 'react-native-neu-element'

import BottomSheet from '../../Components/BottomSheet/BottomSheet'
import NeuButton from '../../Components/NeuButton/NeuButton'

import review from '../../API/review'
import authLoading from '../../API/authLoading'

import styles from '../../styles/commonStyles'

import millisToMinutesAndSeconds from '../../utils'

class Review extends React.Component {
	state = {
		message: '',

		testUUID: null,
		name: null,
		score: null,
		rawScore: null,
		numQuestions: null,
		percentileRank: null,

		scoreAnalysisTopic: null,
		scoreAnalysisQuestionType: null,

		noCalculatorSummary: null,
		calculatorSummary: null,

		analysisTopic: false,
		analysisQuestion: false,

		wrongStep: false,
	}

	fetchData() {
		review
			.get()
			.then((res) => {
				this.setState(res)
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem fetching your data' })
			})
	}

	componentDidMount() {
		this.fetchData()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		// should get summary from backend once review is done
		if (prevProps.route.params?.reviewDone !== this.props.route.params?.reviewDone) {
			this.fetchData()
		}

		if (this.props.route.params?.refresh ?? false === true) {
			this.props.navigation.setParams({ refresh: false })
			this.fetchData()
		}
	}

	handleBottomSheets = (name, value) => {
		this.setState({ [name]: value })
	}

	render() {
		return (
			<>
				<BottomSheet
					type='analysisTopic'
					isActive={this.state.analysisTopic}
					onClose={this.handleBottomSheets}
					title='Score Analysis By Topic'
				>
					{this.state.scoreAnalysisTopic && (
						<SectionList
							sections={this.state.scoreAnalysisTopic}
							renderItem={({ item }) => (
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab',
											fontSize: 16,
											marginLeft: 25,
										}}
									>
										{item.name}
									</Text>
									<Text
										style={{
											fontFamily: 'Roboto_Slab',
											fontSize: 16,
											marginRight: 25,
										}}
									>
										{item.correct}/{item.total}
									</Text>
								</View>
							)}
							renderSectionHeader={({ section }) => (
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
											marginLeft: 25,
										}}
									>
										{section.name}
									</Text>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
											marginRight: 25,
										}}
									>
										{section.correct}/{section.total}
									</Text>
								</View>
							)}
						/>
					)}
				</BottomSheet>

				<BottomSheet
					type='analysisQuestion'
					isActive={this.state.analysisQuestion}
					onClose={this.handleBottomSheets}
					title='Analysis By Question Type'
				>
					{this.state.scoreAnalysisQuestionType && (
						<SectionList
							sections={this.state.scoreAnalysisQuestionType}
							renderItem={({ item }) => (
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab',
											fontSize: 16,
											marginLeft: 25,
										}}
									>
										{item.name}
									</Text>
									<Text
										style={{
											fontFamily: 'Roboto_Slab',
											fontSize: 16,
											marginRight: 25,
										}}
									>
										{item.correct}/{item.total}
									</Text>
								</View>
							)}
							renderSectionHeader={({ section }) => (
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
											marginLeft: 25,
										}}
									>
										{section.name}
									</Text>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
											marginRight: 25,
										}}
									>
										{section.correct}/{section.total}
									</Text>
								</View>
							)}
						/>
					)}
				</BottomSheet>

				<ScrollView>
					<SafeAreaView style={[styles.page, { marginTop: 0 }]}>
						<View style={{ width: '100%', marginTop: 25 }}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-around',
									alignItems: 'center',
								}}
							>
								<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 36 }}>
									{this.state.name}:{' '}
								</Text>
								<Text
									style={{
										fontFamily: 'Roboto_Slab',
										fontSize: 22,
									}}
								>
									{this.state.score} / 800
								</Text>
							</View>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-around',
								}}
							>
								<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 18 }}>
									{this.state.rawScore} / {this.state.numQuestions}
								</Text>
								<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 18 }}>
									{this.state.percentileRank}th percentile
								</Text>
							</View>

							{this.state.message !== '' && (
								<Text style={[styles.message]}>{this.state.message}</Text>
							)}

							<View
								style={{
									justifyContent: 'center',
									flexDirection: 'row',
									marginTop: 15,
								}}
							>
								<NeuView
									color='#EBECF0'
									height={50}
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
											flexDirection: 'row',
											justifyContent: 'space-evenly',
											width: '100%',
										}}
									>
										<TouchableOpacity
											onPress={() =>
												this.handleBottomSheets('analysisTopic', true)
											}
										>
											<Text
												style={{
													fontFamily: 'Roboto_Slab_Bold',
													fontSize: 16,
													color: '#828299',
												}}
											>
												Topic Analysis
											</Text>
										</TouchableOpacity>
										<View
											style={{
												backgroundColor: '#828299',
												height: '100%',
												width: 2,
											}}
										></View>
										<TouchableOpacity
											onPress={() =>
												this.handleBottomSheets('analysisQuestion', true)
											}
										>
											<Text
												style={{
													fontFamily: 'Roboto_Slab_Bold',
													fontSize: 16,
													color: '#828299',
												}}
											>
												Question Analysis
											</Text>
										</TouchableOpacity>
									</View>
								</NeuView>
							</View>

							{showSummary ? (
								<View
									style={{
										flexDirection: 'column',
										alignItems: 'center',
									}}
								>
									{this.state.noCalculatorSummary && (
										<NeuView
											color='#EBECF0'
											height={135}
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
											<Text
												style={{
													alignSelf: 'flex-start',
													fontFamily: 'Roboto_Slab_Bold',
													fontSize: 18,
													marginLeft: 15,
												}}
											>
												No Calculator Mistake Summary
											</Text>
											<View style={{ width: '100%' }}>
												{this.state.noCalculatorSummary.map((item, i) => (
													<View
														style={{
															flexDirection: 'row',
															justifyContent: 'space-around',
															marginLeft: 15,
															marginTop: 5,
														}}
													>
														<Text
															style={{
																fontFamily: 'Roboto_Slab',
																fontSize: 14,
																width: 100,
															}}
														>
															{item.name}
														</Text>
														<Text
															style={{
																fontFamily: 'Roboto_Slab',
																fontSize: 14,
																width: 100,
															}}
														>
															{item.number}
														</Text>
														<Text
															style={{
																fontFamily: 'Roboto_Slab',
																fontSize: 14,
																width: 100,
															}}
														>
															{millisToMinutesAndSeconds(
																item.avgTime
															)}
														</Text>
													</View>
												))}
											</View>
										</NeuView>
									)}
									{this.state.calculatorSummary && (
										<NeuView
											color='#EBECF0'
											height={135}
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
											<Text
												style={{
													alignSelf: 'flex-start',
													fontFamily: 'Roboto_Slab_Bold',
													fontSize: 18,
													marginLeft: 15,
												}}
											>
												Calculator Mistake Summary
											</Text>
											<View style={{ width: '100%' }}>
												{this.state.calculatorSummary.map((item, i) => (
													<View
														style={{
															flexDirection: 'row',
															justifyContent: 'space-around',
															marginLeft: 15,
															marginTop: 5,
														}}
													>
														<Text
															style={{
																fontFamily: 'Roboto_Slab',
																fontSize: 14,
																width: 100,
															}}
														>
															{item.name}
														</Text>
														<Text
															style={{
																fontFamily: 'Roboto_Slab',
																fontSize: 14,
																width: 100,
															}}
														>
															{item.number}
														</Text>
														<Text
															style={{
																fontFamily: 'Roboto_Slab',
																fontSize: 14,
																width: 100,
															}}
														>
															{millisToMinutesAndSeconds(
																item.avgTime
															)}
														</Text>
													</View>
												))}
											</View>
										</NeuView>
									)}
								</View>
							) : (
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
									}}
								>
									{this.props.route.params?.sectionDone ?? 'NO_SECTION' === 1 ? (
										<NeuButton
											onPress={() =>
												this.props.navigation.navigate('ReviewQuestion', {
													uuid: this.state.testUUID,
													section_type: 2,
												})
											}
										>
											Start Calculator Analysis
										</NeuButton>
									) : (
										<NeuButton
											onPress={() =>
												this.props.navigation.navigate('ReviewQuestion', {
													uuid: this.state.testUUID,
													section_type: 1,
												})
											}
										>
											Start No Calculator Analysis
										</NeuButton>
									)}
								</View>
							)}
						</View>

						<NeuButton onPress={() => this.props.navigation.navigate('Learn')}>
							Continue
						</NeuButton>
					</SafeAreaView>
				</ScrollView>
			</>
		)
	}
}

export default Review
