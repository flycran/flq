import { Flq } from '../lib'

const flq = new Flq(
  {
    pool: true, // 使用连接池 !推荐使用
    user: 'root', // 登陆用户
    password: process.env.SQLPASSWORD, // 登陆密码
    database: 'test', // 数据库名
  },
  {
    student: {
      association: {
        toArray: true,
      },
      age: {
        pretreat(value, data) {
          console.log(value)
          if (value < 12) return 12
          return value
        },
      },
      avg: {
        get(row) {
          return (row.chinese + row.math + row.english) / 3
        },
        set(value, row) {
          console.log(value, row)
        },
      },
    },
  }
)

flq.test(async () => {
  const db = flq
    .from('student')
    .field('name', 'chinese', 'math', 'english')
    .where({
      // chinese: {
      //   com: '>',
      //   val: 60
      // },
      // math: {
      //   com: '>',
      //   val: 60,
      // },
      // english: {
      //   com: '>',
      //   val: 60,
      // },
      
    })
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
