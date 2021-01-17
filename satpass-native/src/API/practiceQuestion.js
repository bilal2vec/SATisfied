import API from './API'

const practiceQuestion = {
	async get(topicUUID, questionNumber) {
		return API.fetch('practiceQuestion', {
			topicUUID: topicUUID,
			testUUID: 'test1',
			questionNumber: questionNumber,
		})
	},

	async submit(correct, userAnswer, uuid, type) {
		return API.fetch('practiceQuestion/submit', {
			correct: correct,
			userAnswer: userAnswer,
			questionTypeUUID: uuid,
			questionType: type,
		})
	},
}

export default practiceQuestion
