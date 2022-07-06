const { Flq, hooks } = require('../lib')

const flq = new Flq({
  pool: true, // 使用连接池 !推荐使用
  user: 'root', // 登陆用户
  password: process.env.SQLPASSWORD, // 登陆密码
  database: 'test', // 数据库名
})

flq.test(async () => {
  const db = flq
    .from('student')
    .field('name', 'age', 'chinese', 'math', 'english')
    .limit({ page: 1, size: 3 })
    .foundRows()
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
  console.log('总列数:', db.total);
})
