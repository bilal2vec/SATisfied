import React from 'react'

import { View, Text, Button, Dimensions, Image } from 'react-native'

import { NeuView } from 'react-native-neu-element'

import mcq from '../../API/mcq'
import Latex from '../Latex/Latex'

import styles from '../../styles/commonStyles'
import { TouchableOpacity } from 'react-native-gesture-handler'

class MCQ extends React.Component {
	state = {
		message: '',

		uuid: null,
		question: '',

		questionSkipped: null,
		answer: null,
		correctAnswer: null,
		solution: null,

		A: '',
		B: '',
		C: '',
		D: '',

		solutionBottomSheet: false,
	}

	fetchData() {
		const getAnswer = this.props.getAnswer === true ? true : false
		mcq.get(this.props.questionUUID, this.props.usage, getAnswer)
			.then((res) => {
				if (this.props.getSolution) {
					this.props.getSolution(res['solution'])
				}
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
		if (prevProps.questionUUID != this.props.questionUUID) {
			this.fetchData()
		}
	}

	render() {
		return (
			<View style={{ flexDirection: 'column', alignItems: 'center' }}>
				<Latex
					style={{
						width: Dimensions.get('window').width - 50,
						height: 50,
						marginTop: 15,
					}}
				>
					{this.state.question}
				</Latex>
				<Text style={[styles.message]}>{this.state.message}</Text>
				<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 16 }}>
					{this.props.getAnswer &&
						this.state.questionSkipped &&
						'This question was skipped'}
				</Text>

				{!this.state.questionSkipped && (
					<NeuView
						color='#EBECF0'
						height={200}
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
								height: '100%',
								justifyContent: 'space-around',
								alignItems: 'center',
								width: '100%',
							}}
						>
							<View
								style={{
									width: '100%',
								}}
							>
								<TouchableOpacity
									disabled={this.props.disabled}
									onPress={() => this.props.onPress(0, this.state.uuid)}
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										marginLeft: 15,
										marginRight: 15,
									}}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
										}}
									>
										A. {this.state.A}
									</Text>
									{this.state.answer && this.state.answer === '0' && (
										<Image
											source={require('../../../assets/wrong/wrong.png')}
										/>
									)}
									{this.state.correctAnswer &&
										this.state.correctAnswer === '0' && (
											<Image
												source={require('../../../assets/check/check.png')}
											/>
										)}
								</TouchableOpacity>
							</View>
							<View
								style={{
									width: '100%',
								}}
							>
								<TouchableOpacity
									disabled={this.props.disabled}
									onPress={() => this.props.onPress(1, this.state.uuid)}
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										marginLeft: 15,
										marginRight: 15,
									}}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
										}}
									>
										B. {this.state.B}
									</Text>
									{this.state.answer && this.state.answer === '1' && (
										<Image
											source={require('../../../assets/wrong/wrong.png')}
										/>
									)}
									{this.state.correctAnswer &&
										this.state.correctAnswer === '1' && (
											<Image
												source={require('../../../assets/check/check.png')}
											/>
										)}
								</TouchableOpacity>
							</View>
							<View
								style={{
									width: '100%',
								}}
							>
								<TouchableOpacity
									disabled={this.props.disabled}
									onPress={() => this.props.onPress(2, this.state.uuid)}
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										marginLeft: 15,
										marginRight: 15,
									}}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
										}}
									>
										C. {this.state.C}
									</Text>
									{this.state.answer && this.state.answer === '2' && (
										<Image
											source={require('../../../assets/wrong/wrong.png')}
										/>
									)}
									{this.state.correctAnswer &&
										this.state.correctAnswer === '2' && (
											<Image
												source={require('../../../assets/check/check.png')}
											/>
										)}
								</TouchableOpacity>
							</View>
							<View
								style={{
									width: '100%',
								}}
							>
								<TouchableOpacity
									disabled={this.props.disabled}
									onPress={() => this.props.onPress(3, this.state.uuid)}
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										marginLeft: 15,
										marginRight: 15,
									}}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
										}}
									>
										D. {this.state.D}
									</Text>
									{this.state.answer && this.state.answer === '3' && (
										<Image
											source={require('../../../assets/wrong/wrong.png')}
										/>
									)}
									{this.state.correctAnswer &&
										this.state.correctAnswer === '3' && (
											<Image
												source={require('../../../assets/check/check.png')}
											/>
										)}
								</TouchableOpacity>
							</View>
							{this.props.getAnswer && (
								<View
									style={{
										width: '100%',
										flexDirection: 'row',
										justifyContent: 'center',
									}}
								>
									<TouchableOpacity
										onPress={() =>
											this.props.handleBottomSheets(
												'solutionBottomSheet',
												true
											)
										}
									>
										<Text
											style={{
												fontFamily: 'Roboto_Slab_Bold',
												fontSize: 18,
											}}
										>
											Solution
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>
					</NeuView>
				)}
			</View>
		)
	}
}

export default MCQ
