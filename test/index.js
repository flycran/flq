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
  .field({
    name: 'rename',
  })
  .order({
    'id': 1,
    a: -1
  })
  // .where([length('mail'), '>', 18])
  .format('select')
console.log(sql)
db.end()
