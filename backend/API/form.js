const validator = require('validator')

const form = {
	validate(email, password) {
		if (validator.isEmail(email) && validator.isLength(password, '1')) {
			return true
		} else {
			return false
		}
	},
}

module.exports = form
