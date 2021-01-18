import React from 'react'

import { SafeAreaView, Text, ScrollView } from 'react-native'

import styles from '../../styles/commonStyles'

import NeuButton from '../../Components/NeuButton/NeuButton'

import TestBottomSheets from '../../Components/TestBottomSheets/TestBottomSheets'

class StartTest extends React.Component {
	state = {
		message: '',

		instructions: false,
		formulas: false,
		answers: false,
		submit: false,
	}

	componentDidMount() {
		this.props.navigation.setParams({ handleBottomSheets: this.handleBottomSheets })
	}

	handleBottomSheets = (name, value) => {
		this.setState({
			instructions: false,
			formulas: false,
			answers: false,
			submit: false,
			[name]: value,
		})
	}

	render() {
		return (
			<>
				<TestBottomSheets
					instructionsActive={this.state.instructions}
					formulasActive={this.state.formulas}
					answersActive={this.state.answers}
					submitActive={this.state.submit}
					onClose={this.handleBottomSheets}
					onChangeQuestion={() =>
						this.setState({
							message: "You can't go to questions before starting the test",
						})
					}
					onSubmit={() =>
						this.setState({
							message: "You can't submit the test before starting the test",
						})
					}
				/>
				<ScrollView>
					<SafeAreaView style={styles.page}>
						<Text style={[styles.message, { marginTop: 25 }]}>
							{this.state.message}
						</Text>
						<NeuButton
							onPress={() =>
								this.props.navigation.navigate('TestQuestion', {
									sectionUUID: this.props.route.params?.sectionUUID ?? 'NO_UUID',
									sectionType: this.props.route.params?.sectionType ?? 'NO_UUID',
									time: this.props.route.params?.time ?? 'NO_TIME',
								})
							}
						>
							Start Test
						</NeuButton>
					</SafeAreaView>
				</ScrollView>
			</>
		)
	}
}

export default StartTest
