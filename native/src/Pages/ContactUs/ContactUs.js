import React from 'react'

import { View, Text } from 'react-native'
import Accordian from '../../Components/Accordian/Accordian'

class ContactUs extends React.Component {
	state = {
		menu: [
			{
				title: 'Email Customer Service',
				data: 'Email Customer Service Dropdown',
			},
			{
				title: 'Provide Feedback',
				data: 'Provide Feedback Dropdown',
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
				<Text>ContactUs Page</Text>
				{AccordianItems}
			</View>
		)
	}
}

export default ContactUs
