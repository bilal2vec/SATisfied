import React from 'react'
import { Button, View, Text, SafeAreaView, Dimensions, Image, TouchableOpacity } from 'react-native'

import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'

import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { NeuView } from 'react-native-neu-element'

import AuthLoading from './src/Components/AuthLoading/AuthLoading'

import TestHeader from './src/Components/TestHeader/TestHeader'

import Login from './src/Pages/Login/Login'
import Account from './src/Pages/Account/Account'

import Test from './src/Pages/Test/Test'
import StartTest from './src/Pages/StartTest/StartTest'
import TestQuestion from './src/Pages/TestQuestion/TestQuestion'

import Review from './src/Pages/Review/Review'
import ReviewQuestion from './src/Pages/ReviewQuestion/ReviewQuestion'
import Progress from './src/Pages/Progress/Progress'
import ProgressTest from './src/Pages/ProgressTest/ProgressTest'

import Learn from './src/Pages/Learn/Learn'
import Video from './src/Pages/Video/Video'

import Practice from './src/Pages/Practice/Practice'
import PracticeQuestion from './src/Pages/PracticeQuestion/PracticeQuestion'

import FAQs from './src/Pages/FAQs/FAQs'
import ContactUs from './src/Pages/ContactUs/ContactUs'
import Legal from './src/Pages/Legal/Legal'

const oneGreen = require('./assets/tabs/1-green/1-green.png')
const onePurple = require('./assets/tabs/1-purple/1-purple.png')

const twoGreen = require('./assets/tabs/2-green/2-green.png')
const twoPurple = require('./assets/tabs/2-purple/2-purple.png')

const threeGreen = require('./assets/tabs/3-green/3-green.png')
const threePurple = require('./assets/tabs/3-purple/3-purple.png')

const fourGreen = require('./assets/tabs/4-green/4-green.png')
const fourPurple = require('./assets/tabs/4-purple/4-purple.png')

const tabIcons = [
	[oneGreen, onePurple],
	[twoGreen, twoPurple],
	[threeGreen, threePurple],
	[fourGreen, fourPurple],
]

Sentry.init({
	dsn: '[REDACTED]',
	enableInExpoDevelopment: true,
	debug: true,
})

Sentry.setRelease(Constants.manifest.revisionId)

const getTabBarVisibility = (route) => {
	const routeName = route.state ? route.state.routes[route.state.index].name : ''
	if (
		[
			'StartTest',
			'TestQuestion',
			'ReviewQuestion',
			'Progress',
			'ProgressTest',
			'Video',
			'PracticeQuestion',
		].indexOf(routeName) >= 0
	) {
		return false
	}
	return true
}

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const TestStack = () => (
	<Stack.Navigator initialRouteName='Test' headerMode='screen'>
		<Stack.Screen
			name='Test'
			component={Test}
			options={({ route, navigation }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
								marginTop: 30,
							}}
						>
							<View style={{ marginLeft: 25, height: '100%', alignItems: 'center' }}>
								<Text
									style={{
										fontFamily: 'Roboto_Slab_Bold',
										fontSize: 24,
										color: '#828299',
										marginTop: 10,
									}}
								>
									Test #1
								</Text>
							</View>

							<TouchableOpacity
								style={{ marginRight: 25 }}
								onPress={() =>
									navigation.navigate('Account', {
										navigateFrom: 'Test',
									})
								}
							>
								<Image source={require('./assets/settings/settings.png')} />
							</TouchableOpacity>
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
		<Stack.Screen
			name='StartTest'
			component={StartTest}
			options={({ route, navigation }) => ({
				header: () => (
					<TestHeader
						navigation={navigation}
						disabled={false}
						lastQuestionDone={false}
						time={route.params?.time ?? 'NO_TIME'}
						uuid={route.params?.sectionUUID ?? 'NO_UUID'}
						onPress={route.params?.handleBottomSheets}
						testStarted={false}
						sectionType={
							route.params?.sectionType === 0 ? 'No Calculator' : 'Calculator'
						}
					/>
				),
			})}
		/>
		<Stack.Screen
			name='TestQuestion'
			component={TestQuestion}
			options={({ route }) => ({
				gestureEnabled: false,
				header: () => (
					<TestHeader
						navigation={false}
						disabled={route.params?.onConfidence ?? false}
						currentQuestion={route.params?.currentQuestion ?? 'NO_QUESTION'}
						lastQuestionDone={route.params?.lastQuestionDone ?? 'NO_QUESTION'}
						time={route.params?.time ?? 'NO_TIME'}
						uuid={route.params?.sectionUUID ?? 'NO_UUID'}
						onPress={route.params?.handleBottomSheets ?? false}
						onTimeRanOut={route.params?.handleTimeRanOut ?? false}
						onConfidence={route.params?.handleAnswer ?? false}
						sectionType={
							route.params?.sectionType === 0 ? 'No Calculator' : 'Calculator'
						}
					/>
				),
			})}
		/>
	</Stack.Navigator>
)

const ReviewStack = () => (
	<Stack.Navigator initialRouteName='Review'>
		<Stack.Screen
			name='Review'
			component={Review}
			options={({ navigation, route }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
								marginTop: 30,
							}}
						>
							<TouchableOpacity
								style={{
									marginLeft: 25,
									height: '100%',
									alignItems: 'center',
								}}
								onPress={() => navigation.navigate('Progress')}
							>
								<Text
									style={{
										fontFamily: 'Roboto_Slab_Bold',
										fontSize: 24,
										color: '#828299',
										marginTop: 10,
									}}
								>
									Progress
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{ marginRight: 25 }}
								onPress={() =>
									navigation.navigate('Account', {
										navigateFrom: 'Review',
									})
								}
							>
								<Image source={require('./assets/settings/settings.png')} />
							</TouchableOpacity>
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
		<Stack.Screen
			name='ReviewQuestion'
			component={ReviewQuestion}
			options={({ navigation, route }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								width: '100%',
								justifyContent: 'space-between',
								marginTop: 30,
							}}
						>
							<TouchableOpacity
								style={{
									marginLeft: 25,
									height: '100%',
									alignItems: 'flex-start',
									flexGrow: 1,
								}}
								onPress={() => navigation.navigate('Review')}
							>
								<Image source={require('./assets/back/back.png')} />
							</TouchableOpacity>

							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 18,
									flexGrow: 1,
									alignSelf: 'center',
									alignItems: 'center',
									textAlign: 'center',
								}}
							>
								{(route.params?.currentQuestion ?? 0) + 1} /{' '}
								{route.params?.numQuestions ?? 0}
							</Text>
							<Text style={{ flexGrow: 1, marginRight: 25 }}> </Text>
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
		<Stack.Screen
			name='Progress'
			component={Progress}
			options={({ navigation, route }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								width: '100%',
								justifyContent: 'space-between',
								marginTop: 30,
							}}
						>
							<TouchableOpacity
								style={{
									marginLeft: 25,
									height: '100%',
									alignItems: 'flex-start',
									flexGrow: 1,
									flexBasis: 0,
								}}
								onPress={() => navigation.navigate('Review')}
							>
								<Image source={require('./assets/back/back.png')} />
							</TouchableOpacity>

							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 24,
									color: '#828299',
									flexGrow: 1,
									flexBasis: 0,
								}}
							>
								Progress
							</Text>
							<Text
								style={{
									flexGrow: 1,
									flexBasis: 0,
									marginRight: 25,
								}}
							>
								{' '}
							</Text>
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
		<Stack.Screen
			name='ProgressTest'
			component={ProgressTest}
			options={({ navigation, route }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								width: '100%',
								justifyContent: 'space-between',
								marginTop: 30,
							}}
						>
							<TouchableOpacity
								style={{
									marginLeft: 25,
									height: '100%',
									alignItems: 'flex-start',
									flexGrow: 1,
									flexBasis: 0,
								}}
								onPress={() => navigation.navigate('Review')}
							>
								<Image source={require('./assets/back/back.png')} />
							</TouchableOpacity>

							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 24,
									color: '#828299',
									flexGrow: 2,
									flexBasis: 0,
								}}
							>
								Progress Test
							</Text>
							<Text
								style={{
									flexGrow: 1,
									flexBasis: 0,
									marginRight: 25,
								}}
							>
								{' '}
							</Text>
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
	</Stack.Navigator>
)

const LearnStack = () => (
	<Stack.Navigator initialRouteName='Learn'>
		<Stack.Screen
			name='Learn'
			component={Learn}
			options={({ navigation, route }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
								marginTop: 30,
							}}
						>
							<TouchableOpacity
								style={{
									marginLeft: 25,
									height: '100%',
									alignItems: 'center',
								}}
								onPress={() => route.params?.handleBottomSheets('advice', true)}
							>
								<Text
									style={{
										fontFamily: 'Roboto_Slab_Bold',
										fontSize: 24,
										color: '#828299',
										marginTop: 10,
										// backgroundColor: 'red',
									}}
								>
									Advice
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{ marginRight: 25 }}
								onPress={() =>
									navigation.navigate('Account', {
										navigateFrom: 'Learn',
									})
								}
							>
								<Image source={require('./assets/settings/settings.png')} />
							</TouchableOpacity>
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
		<Stack.Screen
			name='Video'
			component={Video}
			options={({ route }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
								marginTop: 30,
							}}
						>
							<TouchableOpacity
								style={{
									marginLeft: 25,
									height: '100%',
									alignItems: 'center',
								}}
								onPress={() => route.params?.handleBottomSheets('transcript', true)}
							>
								<Text
									style={{
										fontFamily: 'Roboto_Slab_Bold',
										fontSize: 24,
										color: '#828299',
										marginTop: 10,
									}}
								>
									Transcript
								</Text>
							</TouchableOpacity>
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
	</Stack.Navigator>
)

const PracticeStack = () => (
	<Stack.Navigator initialRouteName='Practice'>
		<Stack.Screen
			name='Practice'
			component={Practice}
			options={({ navigation, route }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
								marginTop: 30,
							}}
						>
							<View style={{ marginLeft: 25, height: '100%', alignItems: 'center' }}>
								<Text
									style={{
										fontFamily: 'Roboto_Slab_Bold',
										fontSize: 24,
										color: '#828299',
										marginTop: 10,
									}}
								>
									Practice
								</Text>
							</View>

							<TouchableOpacity
								style={{ marginRight: 25 }}
								onPress={() =>
									navigation.navigate('Account', {
										navigateFrom: 'Practice',
									})
								}
							>
								<Image source={require('./assets/settings/settings.png')} />
							</TouchableOpacity>
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
		<Stack.Screen
			name='PracticeQuestion'
			component={PracticeQuestion}
			options={({ navigation, route }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
								marginTop: 30,
							}}
						>
							<TouchableOpacity
								style={{
									marginLeft: 25,
									height: '100%',
									flexBasis: 0,
									flexGrow: 1,
								}}
								onPress={() => navigation.navigate('Practice')}
							>
								<Image source={require('./assets/back/back.png')} />
							</TouchableOpacity>
							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 18,
									flexBasis: 0,
									flexGrow: 1,
									marginTop: 5,
									textAlign: 'center',
								}}
							>
								{route.params?.currentQuestion +
									1 +
									'/' +
									route.params?.numQuestions}
							</Text>
							{route.params?.checked ? (
								<TouchableOpacity
									style={{
										marginRight: 25,
										flexGrow: 1,
										flexBasis: 0,
										justifyContent: 'center',
									}}
									onPress={() =>
										route.params?.handleBottomSheets('solution', true)
									}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
											color: '#828299',
										}}
									>
										Solution
									</Text>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									style={{
										marginRight: 25,
										flexBasis: 0,
										flexGrow: 1,
										justifyContent: 'center',
									}}
									onPress={() =>
										route.params?.handleBottomSheets('formulas', true)
									}
								>
									<Text
										style={{
											fontFamily: 'Roboto_Slab_Bold',
											fontSize: 18,
											color: '#828299',
										}}
									>
										Formulas
									</Text>
								</TouchableOpacity>
							)}
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
	</Stack.Navigator>
)

const AccountNavigator = () => (
	<Stack.Navigator initialRouteName='Practice'>
		<Stack.Screen
			name='Account'
			component={Account}
			options={({ navigation, route }) => ({
				header: () => (
					<NeuView
						color='#EBECF0'
						height={105}
						width={Dimensions.get('window').width}
						borderRadius={25}
						customDarkShadow={{
							color: '#d4d4d8',
							offsetX: 5,
							offsetY: 5,
							blur: 20,
							opacity: 1,
						}}
					>
						<SafeAreaView
							style={{
								flexDirection: 'row',
								width: '100%',
								justifyContent: 'space-between',
								marginTop: 30,
							}}
						>
							<TouchableOpacity
								style={{
									marginLeft: 25,
									height: '100%',
									alignItems: 'flex-start',
									flexGrow: 1,
									flexBasis: 0,
								}}
								onPress={() => navigation.goBack(null)}
							>
								<Image source={require('./assets/back/back.png')} />
							</TouchableOpacity>

							<Text
								style={{
									fontFamily: 'Roboto_Slab_Bold',
									fontSize: 24,
									color: '#828299',
									flexGrow: 1,
									flexBasis: 0,
								}}
							>
								Account
							</Text>
							<Text
								style={{
									flexGrow: 1,
									flexBasis: 0,
									marginRight: 25,
								}}
							>
								{' '}
							</Text>
						</SafeAreaView>
					</NeuView>
				),
			})}
		/>
		<Stack.Screen
			name='FAQs'
			component={FAQs}
			options={({ navigation, route }) => ({
				header: () => (
					<View>
						<Text>Hello</Text>
					</View>
				),
			})}
		/>
		<Stack.Screen
			name='ContactUs'
			component={ContactUs}
			options={({ navigation, route }) => ({
				header: () => (
					<View>
						<Text>Hello</Text>
					</View>
				),
			})}
		/>
		<Stack.Screen
			name='Legal'
			component={Legal}
			options={({ navigation, route }) => ({
				header: () => (
					<View>
						<Text>Hello</Text>
					</View>
				),
			})}
		/>
	</Stack.Navigator>
)

function NeuTabBar({ state, descriptors, navigation }) {
	return (
		<NeuView
			color='#EBECF0'
			height={135}
			width={Dimensions.get('window').width}
			borderRadius={25}
			customLightShadow={{
				color: '#d4d4d8',
				offsetX: 5,
				offsetY: -5,
				blur: 20,
				opacity: 1,
			}}
			style={{ top: 15 }}
		>
			<SafeAreaView
				style={{
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					width: '100%',
				}}
			>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key]
					const label =
						options.tabBarLabel !== undefined
							? options.tabBarLabel
							: options.title !== undefined
							? options.title
							: route.name

					const isFocused = state.index === index

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						})

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name)
						}
					}

					const onLongPress = () => {
						navigation.emit({
							type: 'tabLongPress',
							target: route.key,
						})
					}

					return (
						<TouchableOpacity
							accessibilityRole='button'
							accessibilityStates={isFocused ? ['selected'] : []}
							accessibilityLabel={options.tabBarAccessibilityLabel}
							testID={options.tabBarTestID}
							onPress={onPress}
							onLongPress={onLongPress}
						>
							<View style={{ flexDirection: 'column', alignItems: 'center' }}>
								<Image source={tabIcons[index][1]} />
								<Text
									style={{
										color: 1 === 1 ? '#828299' : '#0AEEA8',
										fontFamily: 'Roboto_Slab_Bold',
										fontSize: 16,
									}}
								>
									{label}
								</Text>
							</View>
						</TouchableOpacity>
					)
				})}
			</SafeAreaView>
		</NeuView>
	)
}

const TabNavigator = () => (
	<Tab.Navigator tabBar={(props) => <NeuTabBar {...props} />}>
		<Tab.Screen
			name='Test'
			component={TestStack}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
			})}
		/>
		<Tab.Screen
			name='Review'
			component={ReviewStack}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
			})}
		/>
		<Tab.Screen
			name='Learn'
			component={LearnStack}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
			})}
		/>
		<Tab.Screen
			name='Practice'
			component={PracticeStack}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
			})}
		/>
	</Tab.Navigator>
)

const MyTheme = {
	dark: false,
	colors: {
		background: '#EBECF0',
	},
}

export default function App() {
	return (
		<NavigationContainer theme={MyTheme}>
			<Stack.Navigator initialRouteName='AuthLoading'>
				<Stack.Screen
					name='AuthLoading'
					component={AuthLoading}
					options={{ headerLeft: null, gestureEnabled: false }}
				/>
				<Stack.Screen
					name='Login'
					component={Login}
					options={{ headerShown: false, headerLeft: null, gestureEnabled: false }}
				/>
				<Stack.Screen
					name='Tabs'
					component={TabNavigator}
					options={{ headerLeft: null, gestureEnabled: false, headerShown: false }}
				/>
				<Stack.Screen
					name='Account'
					component={AccountNavigator}
					options={{ headerLeft: null, gestureEnabled: false, headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}
