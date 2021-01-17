import React from 'react'

import { View, Text } from 'react-native'

import millisToMinutesAndSeconds from '../../utils.js'

class Timer extends React.Component {
	state = {
		timeElapsed: 0,

		startQuestionTimestamp: null,
	}

	componentDidMount() {
		// set timestamp for start of question
		this.setState({
			startQuestionTimestamp: Date.now(),
		})

		// Create timer that will increase timeElapsed every second
		this.timer = !this.props.paused
			? setInterval(() => {
					this.setState({ timeElapsed: this.state.timeElapsed + 1000 })
			  }, 1000)
			: null
	}

	componentWillUnmount() {
		// Test over, clear the timer
		clearInterval(this.timer)
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		// Went to a different question
		if (prevProps.currentQuestion !== this.props.currentQuestion) {
			// clear the timer
			clearInterval(this.timer)

			// set new timer
			this.timer = setInterval(() => {
				this.setState({ timeElapsed: this.state.timeElapsed + 1000 })
			}, 1000)

			// set start timestamp and clear old timestamp
			this.setState({
				startQuestionTimestamp: Date.now(),
				endQuestionTimestamp: null,
			})
		}

		if (prevProps.paused !== this.props.paused) {
			// Now on onConfidence; pause timer
			if (this.props.paused == true) {
				// clear the timer
				clearInterval(this.timer)

				// Get question end timestamp
				const endQuestionTimestamp = Date.now()

				// Send start and end timestamps to db
				this.props.onConfidence(this.state.startQuestionTimestamp, endQuestionTimestamp)
			}
			// Now back to a question; start timer
			// The only time that calling this is *necessary* is when you have finished the last question in the test, but since we clear the timer first, then set a new one, there isn't anything wrong with this. The currentQuestion changes all other times after the timer has paused except when finishing the last question in a test.
			else if (this.props.paused == false) {
				// clear the timer
				clearInterval(this.timer)

				// set new timer
				this.timer = setInterval(() => {
					this.setState({ timeElapsed: this.state.timeElapsed + 1000 })
				}, 1000)
			}
		}

		// Out of time
		if (this.props.time - this.state.timeElapsed < 1000) {
			clearInterval(this.timer)
			this.props.onTimeRanOut()
		}
	}

	render() {
		return (
			<View style={{ justifyContent: 'center' }}>
				<Text
					style={{
						fontFamily: 'Roboto_Slab_Bold',
						fontSize: 18,
						color: '#0AEEA8',
					}}
				>
					{millisToMinutesAndSeconds(this.props.time - this.state.timeElapsed)}
				</Text>
			</View>
		)
	}
}

export default Timer
