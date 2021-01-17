const fetch = require('node-fetch')
var mysql = require('mysql')
var util = require('util')

var pool = mysql.createPool({
	connectionLimit: process.env.mysql_connection_pool_Limit, // default
	host: '[REDACTED]',
	user: '[REDACTED]',
	database: '[REDACTED]',
	password: '[REDACTED]',
	multipleStatements: true,
})

pool.getConnection((err, connection) => {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('Database connection was closed.')
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has too many connections.')
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('Database connection was refused.')
		}
	}

	if (connection) connection.release()

	return
})

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query)

const API = {
	async query(sql, params, error_code = 500) {
		return pool
			.query(sql, params)
			.then((results) => {
				return results
			})
			.catch((err) => {
				throw new Error(error_code)
			})
	},

	async fetch(url, body) {
		return fetch(url, {
			method: 'post',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(body),
		}).then((res) => {
			if (res.status === 404) {
				throw new Error(404)
			} else if (res.status === 403) {
				throw new Error(403)
			} else {
				return res
			}
		})
	},
}

module.exports = API
