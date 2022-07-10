import { Flq, slot } from '../lib'
import { compare, find_in_set } from '../lib/functions'

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
  // const db = flq
  //   .from('student')
  //   .field('name', 'chinese', 'math', 'english')
  //   .where(
  //     [
  //       find_in_set(1, 'association'),
  //       {
  //         id: 1,
  //       },
  //     ],
  //     'AND',
  //     '!='
  //   )
  //   .insert({
  //     line: 60,
  //   })
  const db = flq.from('class').value({name: 205})
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
