import API from './API'

const reviewQuestion = {
	async get(testUUID, sectionType, questionNumber) {
		return API.fetch('reviewQuestion', {
			testUUID: testUUID,
			sectionType: sectionType,
			questionNumber: questionNumber,
		})
	},

	async submit(wrongType, questionUUID, questionType) {
		return API.fetch('reviewQuestion/submit', {
			wrongType: wrongType,
			questionUUID: questionUUID,
			questionType: questionType,
		})
	},
}

export default reviewQuestion
