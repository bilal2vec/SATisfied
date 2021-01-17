import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

export default class Accordian extends Component {
	state = {
		expanded: false,
	}

	render() {
		return (
			<View>
				<TouchableOpacity onPress={() => this.toggleExpand()}>
					<Text>{this.props.title} -> </Text>
				</TouchableOpacity>
				<View />
				{this.state.expanded && <View>{this.props.children}</View>}
			</View>
		)
	}

	toggleExpand = () => {
		this.setState({ expanded: !this.state.expanded })
	}
}
