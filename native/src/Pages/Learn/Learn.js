import React from 'react'
import { Text, Button, FlatList, SafeAreaView, View, Image } from 'react-native'

import NeuCard from '../../Components/NuCard/NuCard'

import BottomSheet from '../../Components/BottomSheet/BottomSheet'
import NeuButton from '../../Components/NeuButton/NeuButton'

import learn from '../../API/learn'
import authLoading from '../../API/authLoading'

import styles from '../../styles/commonStyles'

class Learn extends React.Component {
	state = {
		advice: false,
		topics: [],
		message: '',
		wrongStep: false,
	}

	componentDidMount() {
		this.props.navigation.setParams({ handleBottomSheets: this.handleBottomSheets })

		this.getCurrentStep()

		learn
			.get()
			.then((res) => {
				this.setState(res)
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem fetching your data' })
			})
	}

	handleBottomSheets = (name, value) => {
		this.setState({ [name]: value })
	}

	render() {
		return (
			<SafeAreaView style={styles.page}>
				<BottomSheet
					type='advice'
					name='Advice'
					isActive={this.state.advice}
					onClose={this.handleBottomSheets}
					title='Learn'
				>
					<Text>LEARN</Text>
				</BottomSheet>

				{this.state.topics && (
					<View style={{ top: 25 }}>
						{this.state.topics.map((item, i) => (
							<NeuCard
								onPress={() =>
									this.props.navigation.navigate('Video', {
										topicUUID: item.uuid,
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
											{item.name}
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
										<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 16 }}>
											5 Videos
										</Text>
									</View>
								</View>
							</NeuCard>
						))}
					</View>
				)}

				<Text style={[styles.message, { marginTop: 25 }]}>{this.state.message}</Text>

				<NeuButton onPress={() => this.props.navigation.navigate('Practice')}>
					Continue
				</NeuButton>
			</SafeAreaView>
		)
	}
}

export default Learn
