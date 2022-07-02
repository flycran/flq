const { Flq } = require('../lib')
const { length } = require('../lib/functions')
let db = new Flq({
  user: 'root',
  password: process.env.SQLPASSWORD,
  database: 'jd',
})

const sql = db
  .from('user')
  .field('name', 'password')
  .field({
    power: '权限',
    mail: {
      as: '邮箱',
    },
  })
  .where({
    id: 1,
  })
  .where([length('mail'), '>', 18])
  .format('select')
console.log(sql)
db.end()
