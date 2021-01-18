import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'

import { NeuView } from 'react-native-neu-element'

const NeuCard = ({ onPress, children }) => (
	<TouchableOpacity
		onPress={() => {
			onPress()
		}}
		style={{ marginTop: 25 }}
	>
		<NeuView
			color='#EBECF0'
			height={100}
			width={Dimensions.get('window').width - 50}
			borderRadius={10}
			customDarkShadow={{ color: '#d4d4d8', offsetX: 5, offsetY: 5, blur: 20, opacity: 1 }}
		>
			{children}
		</NeuView>
	</TouchableOpacity>
)

export default NeuCard
