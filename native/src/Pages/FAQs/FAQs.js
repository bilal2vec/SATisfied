import React from 'react'

import { View, Text } from 'react-native'
import Accordian from '../../Components/Accordian/Accordian'

class FAQs extends React.Component {
	state = {
		menu: [
			{
				title: 'SAT Related',
				data: 'SAT Related Dropdown',
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
				<Text>FAQs Page</Text>
				{AccordianItems}
			</View>
		)
	}
}

export default FAQs
