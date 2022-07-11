import { Flq, slot, field, escape } from '../lib'
import { comp, oper, method, FIND_IN_SET } from '../lib/methods'

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
        postreat(value) {
          return value + '周岁'
        },
      },
      avg: {
        get(row) {
          return (row.chinese + row.math + row.english) / 3
        },
      },
      all: {
        set(value, row) {
          row.chinese = row.math = row.english = value
        },
      },
    },
    class: {
      createAt: {
        default() {
          return new Date()
        },
      },
      updateAt: {
        default() {
          return new Date()
        },
      },
    },
  }
)

flq.test(async () => {
  const db = flq
    .from('student')
    .field('name', 'chinese', 'math', 'english')
    .where(
      {
        math: slot('math'),
      },
      'AND',
      '>'
    )
  const result = await db.find({
    math: oper('english', '+', 20),
  })
  console.log(db.sql)
  console.log(result)
})
