import React from 'react'

import { SafeAreaView, View, Text, ScrollView } from 'react-native'

import NeuButton from '../../Components/NeuButton/NeuButton'

import progress from '../../API/progress'

import styles from '../../styles/commonStyles'

class Progress extends React.Component {
	state = {
		message: '',

		tests: [],
	}

	fetchData() {
		progress
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

	render() {
		return (
			<ScrollView>
				<SafeAreaView style={[styles.page]}>
					{this.state.tests && (
						<View>
							{this.state.tests.map((item, i) => (
								<View>
									<NeuButton
										onPress={() =>
											this.props.navigation.navigate('ProgressTest', {
												testUUID: item.testUUID,
											})
										}
									>
										{item.name + ' - ' + item.score + '/800'}
									</NeuButton>
								</View>
							))}
						</View>
					)}
					<Text style={[styles.message, { marginTop: 25 }]}>{this.state.message}</Text>
				</SafeAreaView>
			</ScrollView>
		)
	}
}

export default Progress
