// from: https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000)
	var seconds = ((millis % 60000) / 1000).toFixed(0)
	return minutes + 'm ' + (seconds < 10 ? '0' : '') + seconds + 's'
}

export default millisToMinutesAndSeconds
