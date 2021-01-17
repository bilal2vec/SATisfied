import { StyleSheet } from 'react-native'

const commonStyles = StyleSheet.create({
	page: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#EBECF0',
	},

	pageItems: {
		margin: 25,
	},

	message: {
		color: 'red',
		alignSelf: 'center',
		fontFamily: 'Roboto_Slab',
		fontSize: 16,
	},
})

export default commonStyles
