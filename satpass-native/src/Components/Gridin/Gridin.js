import React from 'react'

import {
	View,
	Text,
	Button,
	Picker,
	Dimensions,
	Platform,
	Image,
	TouchableOpacity,
} from 'react-native'

import { NeuView } from 'react-native-neu-element'

import NeuButton from '../NeuButton/NeuButton'
import Latex from '../Latex/Latex'

import gridin from '../../API/gridin'

import styles from '../../styles/commonStyles'

class Gridin extends React.Component {
	state = {
		message: '',

		uuid: null,
		question: '',

		questionSkipped: null,
		answer: null,
		correctAnswer: null,
		solution: null,

		BoxOne: '',
		BoxTwo: '',
		BoxThree: '',
		BoxFour: '',

		solutionBottomSheet: false,
	}

	componentDidMount() {
		const getAnswer = this.props.getAnswer === true ? true : false
		gridin
			.get(this.props.questionUUID, this.props.usage, getAnswer)
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

	render() {
		return (
			<View
				style={{
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<View>
					<Latex
						style={{
							width: Dimensions.get('window').width - 50,
							height: 50,
							marginTop: 15,
						}}
					>
						{this.state.question}
					</Latex>
					<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 16 }}>
						{this.props.getAnswer &&
							this.state.questionSkipped &&
							'This question was skipped'}
					</Text>
					<Text style={[styles.message]}>{this.state.message}</Text>
					{this.state.answer !== null && (
						<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 16 }}>
							My answer: {this.state.answer}
						</Text>
					)}
					{this.state.correctAnswer && (
						<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 16 }}>
							Correct answer(s):{' '}
							{this.state.correctAnswer.map((row) => {
								return parseFloat(row).toFixed(2) + ', '
							})}
						</Text>
					)}
				</View>
				{!this.props.getAnswer && (
					<NeuView
						color='#EBECF0'
						height={Platform.OS === 'ios' ? 250 : 100}
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
								justifyContent: 'space-between',
								width: '100%',
							}}
						>
							<Text
								style={{
									fontFamily: 'Roboto_Slab',
									fontSize: 18,
									marginLeft: 15,
									marginTop: 15,
								}}
							>
								Answer:
							</Text>
							<Text
								style={{
									fontFamily: 'Roboto_Slab',
									fontSize: 18,
									marginRight: 15,
									marginTop: 15,
								}}
							>
								{this.state.BoxOne +
									' ' +
									this.state.BoxTwo +
									' ' +
									this.state.BoxThree +
									' ' +
									this.state.BoxFour}
							</Text>
						</View>

						<View
							style={{
								flexDirection: 'row',
							}}
						>
							<Picker
								selectedValue={this.state.BoxOne}
								enabled={!this.props.disabled}
								style={{ width: 50 }}
								onValueChange={(itemValue, _) =>
									!this.props.disabled && this.setState({ BoxOne: itemValue })
								}
							>
								<Picker.Item label='' value='' />
								<Picker.Item label='.' value='.' />
								<Picker.Item label='1' value='1' />
								<Picker.Item label='2' value='2' />
								<Picker.Item label='3' value='3' />
								<Picker.Item label='4' value='4' />
								<Picker.Item label='5' value='5' />
								<Picker.Item label='6' value='6' />
								<Picker.Item label='7' value='7' />
								<Picker.Item label='8' value='8' />
								<Picker.Item label='9' value='9' />
							</Picker>
							<Picker
								selectedValue={this.state.BoxTwo}
								enabled={!this.props.disabled}
								style={{ width: 50 }}
								onValueChange={(itemValue, _) =>
									!this.props.disabled && this.setState({ BoxTwo: itemValue })
								}
							>
								<Picker.Item label='' value='' />
								<Picker.Item label='/' value='/' />
								<Picker.Item label='.' value='.' />
								<Picker.Item label='1' value='1' />
								<Picker.Item label='2' value='2' />
								<Picker.Item label='3' value='3' />
								<Picker.Item label='4' value='4' />
								<Picker.Item label='5' value='5' />
								<Picker.Item label='6' value='6' />
								<Picker.Item label='7' value='7' />
								<Picker.Item label='8' value='8' />
								<Picker.Item label='9' value='9' />
							</Picker>

							<Picker
								selectedValue={this.state.BoxThree}
								enabled={!this.props.disabled}
								style={{ width: 50 }}
								onValueChange={(itemValue, _) =>
									!this.props.disabled && this.setState({ BoxThree: itemValue })
								}
							>
								<Picker.Item label='' value='' />
								<Picker.Item label='/' value='/' />
								<Picker.Item label='.' value='.' />
								<Picker.Item label='1' value='1' />
								<Picker.Item label='2' value='2' />
								<Picker.Item label='3' value='3' />
								<Picker.Item label='4' value='4' />
								<Picker.Item label='5' value='5' />
								<Picker.Item label='6' value='6' />
								<Picker.Item label='7' value='7' />
								<Picker.Item label='8' value='8' />
								<Picker.Item label='9' value='9' />
							</Picker>

							<Picker
								selectedValue={this.state.BoxFour}
								enabled={!this.props.disabled}
								style={{ width: 50 }}
								onValueChange={(itemValue, _) =>
									!this.props.disabled && this.setState({ BoxFour: itemValue })
								}
							>
								<Picker.Item label='' value='' />
								<Picker.Item label='.' value='.' />
								<Picker.Item label='1' value='1' />
								<Picker.Item label='2' value='2' />
								<Picker.Item label='3' value='3' />
								<Picker.Item label='4' value='4' />
								<Picker.Item label='5' value='5' />
								<Picker.Item label='6' value='6' />
								<Picker.Item label='7' value='7' />
								<Picker.Item label='8' value='8' />
								<Picker.Item label='9' value='9' />
							</Picker>
						</View>
					</NeuView>
				)}
				{!this.props.disabled && (
					<NeuButton
						disabled={this.props.disabled}
						onPress={() => {
							this.setState({ BoxOne: '', BoxTwo: '', BoxThree: '', BoxFour: '' })
							this.props.onPress(
								this.state.BoxOne,
								this.state.BoxTwo,
								this.state.BoxThree,
								this.state.BoxFour,
								this.state.uuid
							)
						}}
					>
						Submit
					</NeuButton>
				)}
				{this.props.getAnswer && (
					<View
						style={{
							width: '100%',
							flexDirection: 'row',
							justifyContent: 'center',
							marginTop: 15,
						}}
					>
						<TouchableOpacity
							onPress={() =>
								this.props.handleBottomSheets('solutionBottomSheet', true)
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
		)
	}
}

export default Gridin
