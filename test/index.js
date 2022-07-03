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
  const dbe = db.from('student').value({
    name: '孙十',
    gender: '男',
    age: 13
  })
  console.log(await dbe.insert())
  console.log(dbe.sql)
  db.end()
}, 600)
