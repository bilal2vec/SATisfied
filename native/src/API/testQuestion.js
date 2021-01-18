import API from './API'

const testQuestion = {
	async get(sectionUUID, questionNumber) {
		return API.fetch('testQuestion', {
			sectionUUID: sectionUUID,
			questionNumber: questionNumber,
		})
	},

	async submit(sectionUUID, userAnswers) {
		return API.fetch('testQuestion/submit', {
			sectionUUID: sectionUUID,
			userAnswers: userAnswers,
		})
	},
}

export default testQuestion
