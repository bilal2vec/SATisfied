import React from 'react'
import { Image } from 'react-native'

// from: https://github.com/railsjack/react-native-latex
import FastImage from 'react-native-fast-image'

const API_URL = 'http://sciencesoft.at/image/latexurl/image.png?dpi=600&src='

class Latex extends React.Component {
	constructor(props) {
		super(props)
	}

	state = {
		latexURL: '',
		gotSize: false,
		width: 1,
		height: 1,
	}

	componentDidMount() {
		if (typeof this.props.children === 'string') {
			this.setState({ latexURL: API_URL + this.props.children })
		}
	}

	onLoad = (event) => {
		const { width, height } = event.nativeEvent.source
		this.setState({
			gotSize: true,
			width: height < this.props.height ? width : (width / height) * this.props.height,
			height: height < this.props.height ? this.props.minHeight : this.props.height,
		})
		this.props.onLoad && this.props.onLoad(event)
	}

	render() {
		const { gotSize, width, height, latexURL } = this.state
		return latexURL ? (
			<Image
				onLoad={this.onLoad}
				style={[this.props.style]}
				resizeMode={FastImage.resizeMode.contain}
				source={{ uri: latexURL }}
			/>
		) : null
	}
}

export default Latex
