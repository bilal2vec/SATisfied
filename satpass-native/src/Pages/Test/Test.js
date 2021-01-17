import React from 'react'

import { SafeAreaView, Text, View, Image, ScrollView } from 'react-native'

import test from '../../API/test'
import authLoading from '../../API/authLoading'

import styles from '../../styles/commonStyles'
import NeuButton from '../../Components/NeuButton/NeuButton'
import NeuCard from '../../Components/NuCard/NuCard'

import millisToMinutesAndSeconds from '../../utils.js'

class Test extends React.Component {
	state = {
		message: '',

		test_uuid: null,
		test_name: null,
		test_sections: null,
		wrongStep: false,
		continueButton: false,
	}

	getCurrentStep() {
		authLoading
			.getTab()
			.then((res) => {
				if (res['tab'] != 'Test') {
					this.setState({ wrongStep: true })
				}
			})
			.catch((error) => {
				this.setState({ message: 'Could not find current step' })
			})
	}

	fetchData() {
		test.get()
			.then((res) => {
				if (res['lastTest']) {
					this.setState({ message: 'You completed all tests' })
				} else {
					let testComplete = true
					res['test_sections'].forEach((row) => {
						if (!row['isComplete']) {
							testComplete = false
						}
					})
					this.setState({ continueButton: testComplete })
					this.setState(res)
				}
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem fetching your data' })
			})
	}

	componentDidMount() {
		this.fetchData()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.route.params?.refresh ?? false === true) {
			this.props.navigation.setParams({ refresh: false })

			this.getCurrentStep()
			this.fetchData()
		}
	}

	render() {
		return (
			<>
				<ScrollView>
					<View style={styles.page}>
						{this.state.test_uuid && (
							<View style={{ marginTop: 10 }}>
								{this.state.test_sections.map((item, i) => (
									<NeuCard
										onPress={() =>
											this.props.navigation.navigate('StartTest', {
												sectionUUID: item.uuid,
												time: item.time,
												sectionType: i,
											})
										}
									>
										<View
											style={{
												flex: 1,
												width: '100%',
												justifyContent: 'space-between',
											}}
										>
											<View
												style={{
													flexDirection: 'row',
													justifyContent: 'space-between',
													marginHorizontal: 15,
													marginTop: 15,
												}}
											>
												<Text
													style={{
														fontFamily: 'Roboto_Slab_Bold',
														fontSize: 22,
													}}
												>
													Section {item.key}: {item.name}
												</Text>
												<Image
													source={require('../../../assets/check/check.png')}
												/>
											</View>
											<View
												style={{
													flexDirection: 'row',
													justifyContent: 'space-between',
													marginHorizontal: 15,
													marginBottom: 15,
												}}
											>
												<Text
													style={{
														fontFamily: 'Roboto_Slab',
														fontSize: 16,
													}}
												>
													{item.numQuestions} Questions
												</Text>
												<Text
													style={{
														fontFamily: 'Roboto_Slab',
														fontSize: 16,
													}}
												>
													{millisToMinutesAndSeconds(item.time)}
												</Text>
											</View>
										</View>
									</NeuCard>
								))}
							</View>
						)}

						<Text style={[styles.message, { marginTop: 25 }]}>
							{this.state.message}
						</Text>

						<NeuButton onPress={() => this.props.navigation.navigate('Review')}>
							Continue
						</NeuButton>
					</View>
				</ScrollView>
			</>
		)
	}
}

export default Test
