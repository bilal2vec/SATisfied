import React from 'react'

import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'

import BottomSheet from '../BottomSheet/BottomSheet'

const confidenceToWord = (confidence) => {
	if (confidence === 0) {
		return 'High'
	} else if (confidence === 1) {
		return 'Medium'
	} else {
		return 'Low'
	}
}

class AnswerSheet extends React.Component {
	render() {
		return (
			<BottomSheet type='answers' isActive={this.props.isActive} onClose={this.props.onClose}>
				<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 22, marginLeft: 15 }}>
					Answer Sheet
				</Text>
				<View
					style={{
						width: '100%',
						flexDirection: 'row',
						justifyContent: 'space-around',
						marginTop: 15,
					}}
				>
					<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 18 }}> </Text>
					<View
						style={{
							flexDirection: 'row',
							width: 100,
							justifyContent: 'space-between',
						}}
					>
						<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 18 }}>A</Text>
						<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 18 }}>B</Text>
						<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 18 }}>C</Text>
						<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 18 }}>D</Text>
					</View>
					<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 18, width: 100 }}>
						Confidence
					</Text>
					<Text style={{ fontFamily: 'Roboto_Slab', fontSize: 18 }}> </Text>
				</View>
				{this.props.userAnswers && (
					<ScrollView>
						{this.props.userAnswers.map((item, i) => (
							<TouchableOpacity
								onPress={() => this.props.onPress(item['questionNumber'])}
								style={{ marginTop: 10 }}
							>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-around',
										width: '100%',
									}}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab',
											fontSize: 18,
										}}
									>
										{item['questionNumber'] + 1}
									</Text>

									{item['type'] === 'mcq' ? (
										<View
											style={{
												flexDirection: 'row',
												width: 100,
												justifyContent: 'space-between',
											}}
										>
											<Text
												style={{
													fontFamily: 'Roboto_Slab',
													fontSize: 18,
													marginTop: 7,
												}}
											>
												{item['choice'] == 0 ? (
													<Image
														source={require('../../../assets/circle/full/full.png')}
													/>
												) : (
													<Image
														source={require('../../../assets/circle/empty/empty.png')}
													/>
												)}
											</Text>
											<Text
												style={{
													fontFamily: 'Roboto_Slab',
													fontSize: 18,
													marginTop: 7,
												}}
											>
												{item['choice'] == 1 ? (
													<Image
														source={require('../../../assets/circle/full/full.png')}
													/>
												) : (
													<Image
														source={require('../../../assets/circle/empty/empty.png')}
													/>
												)}
											</Text>
											<Text
												style={{
													fontFamily: 'Roboto_Slab',
													fontSize: 18,
													marginTop: 7,
												}}
											>
												{item['choice'] == 2 ? (
													<Image
														source={require('../../../assets/circle/full/full.png')}
													/>
												) : (
													<Image
														source={require('../../../assets/circle/empty/empty.png')}
													/>
												)}
											</Text>

											<Text
												style={{
													fontFamily: 'Roboto_Slab',
													fontSize: 18,
													marginTop: 7,
												}}
											>
												{item['choice'] == 3 ? (
													<Image
														source={require('../../../assets/circle/full/full.png')}
													/>
												) : (
													<Image
														source={require('../../../assets/circle/empty/empty.png')}
													/>
												)}
											</Text>
										</View>
									) : (
										<View
											style={{
												flexDirection: 'row',
												width: 100,
												justifyContent: 'space-between',
											}}
										>
											<Text
												style={{
													borderColor: 'black',
													borderWidth: 2,
													textAlignVertical: 'center',
													textAlign: 'center',
													fontFamily: 'Roboto_Slab',
													fontSize: 18,
												}}
											>
												{item['boxOne'] == ''
													? '\u00A0\u00A0'
													: item['boxOne']}
											</Text>

											<Text
												style={{
													borderColor: 'black',
													borderWidth: 2,
													textAlignVertical: 'center',
													textAlign: 'center',
													fontFamily: 'Roboto_Slab',
													fontSize: 18,
													padding: 1,
												}}
											>
												{item['boxTwo'] == ''
													? '\u00A0\u00A0'
													: item['boxTwo']}
											</Text>

											<Text
												style={{
													borderColor: 'black',
													borderWidth: 2,
													textAlignVertical: 'center',
													textAlign: 'center',
													fontFamily: 'Roboto_Slab',
													fontSize: 18,
													padding: 1,
												}}
											>
												{item['boxThree'] == ''
													? '\u00A0\u00A0'
													: item['boxThree']}
											</Text>

											<Text
												style={{
													borderColor: 'black',
													borderWidth: 2,
													textAlignVertical: 'center',
													textAlign: 'center',
													fontFamily: 'Roboto_Slab',
													fontSize: 18,
													padding: 1,
												}}
											>
												{item['boxFour'] == ''
													? '\u00A0\u00A0'
													: item['boxFour']}
											</Text>
										</View>
									)}
									<Text
										style={{
											fontFamily: 'Roboto_Slab',
											fontSize: 18,
											width: 100,
										}}
									>
										{confidenceToWord(item['confidence'])}
									</Text>
									<Image source={require('../../../assets/right/right.png')} />
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				)}
			</BottomSheet>
		)
	}
}

export default AnswerSheet
