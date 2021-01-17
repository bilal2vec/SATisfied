import React from 'react'
import { SafeAreaView, View, Text, Button, FlatList, Image, ScrollView } from 'react-native'

import NeuCard from '../../Components/NuCard/NuCard'
import NeuButton from '../../Components/NeuButton/NeuButton'

import practice from '../../API/practice'
import authLoading from '../../API/authLoading'

import styles from '../../styles/commonStyles'

class Practice extends React.Component {
	state = {
		message: '',
		advice: false,
		topics: [],
		wrongStep: false,
		continueButton: false,
	}

	getCurrentStep() {
		authLoading
			.getTab()
			.then((res) => {
				if (res['tab'] != 'Learn' && res['tab'] != 'Practice') {
					this.setState({ wrongStep: true })
				}
			})
			.catch((error) => {
				this.setState({ message: 'Could not find current step' })
			})
	}

	fetchData() {
		practice
			.get()
			.then((res) => {
				let practiceComplete = true
				res['topics'].forEach((row) => {
					if (!row['isComplete']) {
						practiceComplete = false
					}
				})

				this.setState({ continueButton: practiceComplete })

				this.setState(res)
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem fetching your data' })
			})
	}

	componentDidMount() {
		this.props.navigation.setParams({ handleBottomSheets: this.handleBottomSheets })

		this.getCurrentStep()
		this.fetchData()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
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
			<ScrollView>
				<SafeAreaView style={styles.page}>
					{this.state.topics && (
						<View style={{ marginTop: 25 }}>
							{this.state.topics.map((item, i) => (
								<NeuCard
									onPress={() =>
										this.props.navigation.navigate('PracticeQuestion', {
											topicUUID: item.uuid,
										})
									}
								>
									<View
										style={{
											width: '100%',
											height: '100%',
											justifyContent: 'space-between',
										}}
									>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												width: '100%',
											}}
										>
											<Text
												style={{
													fontFamily: 'Roboto_Slab_Bold',
													fontSize: 22,
													marginLeft: 15,
													marginTop: 15,
												}}
											>
												{item.name}
											</Text>
											<Image
												style={{ marginTop: 15, marginRight: 15 }}
												source={require('../../../assets/check/check.png')}
											/>
										</View>
										<View>
											<Text
												style={{
													fontFamily: 'Roboto_Slab',
													fontSize: 16,
													marginLeft: 15,
													marginBottom: 15,
												}}
											>
												10 questions
											</Text>
										</View>
									</View>
								</NeuCard>
							))}
						</View>
					)}

					<Text style={[styles.message, { marginTop: 25 }]}>{this.state.message}</Text>

					<NeuButton onPress={() => this.props.navigation.navigate('Test')}>
						Continue
					</NeuButton>
				</SafeAreaView>
			</ScrollView>
		)
	}
}

export default Practice
