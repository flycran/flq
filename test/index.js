const { Flq } = require('../lib')
const { length } = require('../lib/functions')
let db = new Flq(
  {
    user: 'root',
    password: process.env.SQLPASSWORD,
    database: 'jd',
  },
  {
    user: {
      id: 'int',
      shop: {
        default: '没有店铺',
        postreat() {},
      },
    },
  }
)

const sql = db
  .from('user')
  .value({
    a: 1,
    b: 2
  })
  .format('insert')
console.log(sql)
db.end()
