const reconlx = require('reconlx')

const db = new reconlx.reconDB(`${process.env.MONGO_URI}`)

module.exports = db;