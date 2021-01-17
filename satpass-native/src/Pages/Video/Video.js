import React from 'react'
import { SafeAreaView, Text, ScrollView, Dimensions } from 'react-native'

import { WebView } from 'react-native-webview'

import BottomSheet from '../../Components/BottomSheet/BottomSheet'
import NeuButton from '../../Components/NeuButton/NeuButton'

import video from '../../API/video'

import styles from '../../styles/commonStyles'

class Video extends React.Component {
	state = {
		transcript: false,

		currentVideo: 0,
		numVideos: null,
		video: null,
		transcriptUrl: null,

		message: '',
	}

	webview = null

	fetchData() {
		const topicUuid = this.props.route.params?.topicUUID ?? 'NO_UUID'

		video
			.get(topicUuid, this.state.currentVideo)
			.then((res) => {
				this.setState(res)
			})
			.catch((error) => {
				this.setState({ message: 'There was a problem fetching your data' })
			})
	}

	componentDidMount() {
		this.props.navigation.setParams({ handleBottomSheets: this.handleBottomSheets })

		this.fetchData()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.currentVideo !== this.state.currentVideo) {
			this.fetchData()
		}
	}

	handleBottomSheets = (name, value) => {
		this.setState({ [name]: value })
	}

	render() {
		let nextButton
		if (this.state.currentVideo === this.state.numVideos - 1) {
			nextButton = (
				<NeuButton onPress={() => this.props.navigation.navigate('Learn')}>
					Back To Learn
				</NeuButton>
			)
		} else {
			nextButton = (
				<NeuButton
					onPress={() => this.setState({ currentVideo: this.state.currentVideo + 1 })}
				>
					Next Video
				</NeuButton>
			)
		}

		return (
			<>
				<BottomSheet
					type='transcript'
					name='Transcript'
					isActive={this.state.transcript}
					onClose={this.handleBottomSheets}
				>
					<Text>Transcript: {this.state.transcriptUrl}</Text>
				</BottomSheet>
				<ScrollView>
					<SafeAreaView style={[styles.page, { width: '100%' }]}>
						<Text style={[styles.message, { marginTop: 25 }]}>
							{this.state.message}
						</Text>
						<Text>Video: {this.state.video}</Text>
						<WebView
							ref={(ref) => (this.webview = ref)}
							source={{
								uri:
									'https://www.youtube.com/embed/kZzoVCmUyKg?rel=0&autoplay=0&showinfo=0&controls=0',
							}}
							onNavigationStateChange={(newNavState) => {
								const { url } = newNavState
								if (
									url !==
									'https://www.youtube.com/embed/kZzoVCmUyKg?rel=0&autoplay=0&showinfo=0&controls=0'
								) {
									this.webview.stopLoading()
								}
							}}
							style={{
								marginTop: 20,
								height: 200,
								width: Dimensions.get('window').width,
							}}
						/>
						{nextButton}
					</SafeAreaView>
				</ScrollView>
			</>
		)
	}
}

export default Video
