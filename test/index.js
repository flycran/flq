const { Flq } = require('../lib')

const db = new Flq({
  pool: true, // 使用连接池 !推荐使用
  user: 'root', // 登陆用户
  password: process.env.SQLPASSWORD, // 登陆密码
  database: 'test', // 数据库名
})

setTimeout(async () => {
  const dbe = db.from('student').size(3).page(1).foundRows()
  console.log(await dbe.find())
  console.log(dbe.total)
  console.log(dbe.sql)
  db.end()
}, 600)
