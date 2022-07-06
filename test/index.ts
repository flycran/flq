const {Flq} = require('../lib')

const flq = new Flq({
  pool: true, // 使用连接池 !推荐使用
  user: 'root', // 登陆用户
  password: process.env.SQLPASSWORD, // 登陆密码
  database: 'test', // 数据库名
})

flq.test(async () => {
  const db = flq.from('student').field({
    AVG: {chinese: '语文', math: '数学', english: '英语'},
  })
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
