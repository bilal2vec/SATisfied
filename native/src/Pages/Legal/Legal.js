import React from 'react'

import { View, Text } from 'react-native'
import Accordian from '../../Components/Accordian/Accordian'

class Legal extends React.Component {
	state = {
		menu: [
			{
				title: 'Terms & Conditions',
				data: 'Terms & Conditions Dropdown',
			},
			{
				title: 'Privacy Policy',
				data: 'Privacy Policy Dropdown',
			},

			{
				title: 'Add Free Policy',
				data: 'Add Free Policy Dropdown',
			},
		],
	}

	render() {
		const AccordianItems = this.state.menu.map((item, i) => {
			return (
				<Accordian key={i} title={item.title}>
					<Text>{item.data}</Text>
				</Accordian>
			)
		})

		return (
			<View>
				<Text>Legal Page</Text>
				{AccordianItems}
			</View>
		)
	}
}

export default Legal
