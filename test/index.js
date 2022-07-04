const { Flq, hooks } = require('../lib')
const { length } = require('../lib/functions')

let db = new Flq(
  {
    user: 'root',
    password: process.env.SQLPASSWORD,
    database: 'test',
  },
  {
    student: {
      list: {
        toArray: true,
      },
    },
  }
)

const { modelPostreatHooks } = require('../lib/model')

hooks.off('model-postreat', modelPostreatHooks.toArray)

setTimeout(async () => {
  const dbe = db.from('student').size(3).page(1).foundRows()
  console.log(await dbe.find())
  console.log(dbe.total)
  console.log(dbe.sql)
  db.end()
}, 600)
