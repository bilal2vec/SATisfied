import React from 'react'
import { View, Text } from 'react-native'

import SwipeablePanel from 'rn-swipeable-panel'

const BottomSheet = ({ type, isActive, onClose, title, children }) => {
	return (
		<SwipeablePanel
			noBackgroundOpacity={true}
			fullWidth
			openLarge
			isActive={isActive}
			onClose={() => onClose(type, false)}
			showCloseButton={true}
			closeIconStyle={{ backgroundColor: '#828299' }}
			onPressCloseButton={() => onClose(type, false)}
			style={{ backgroundColor: '#EBECF0' }}
		>
			<View>
				<Text style={{ fontFamily: 'Roboto_Slab_Bold', fontSize: 22, marginLeft: 25 }}>
					{title}
				</Text>
				{children}
			</View>
		</SwipeablePanel>
	)
}

export default BottomSheet
