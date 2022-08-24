import {Flq, hooks} from '../src'

hooks.on('format', (e: string) => {
  console.log(e)
})

const flq = new Flq(
  {
    pool: true, // 使用连接池 !推荐使用
    user: 'root', // 登陆用户
    password: process.env.SQLPASSWORD, // 登陆密码
    database: 'test', // 数据库名
  }
)
const association = flq.from('association')

flq.setModel({
  student: {
    association: {
      toArray: true,
      async postreat(val) {
        const res = await association.where({
          id: {
            com: 'IN',
            val
          }
        }).find()
        console.log(11111)
        return res
      }
    },
    age: {
      postreat(value) {
        return value + '周岁'
      },
    },
    avg: {
      get(row) {
        return (row.chinese + row.math + row.english) / 3
        // return association.find()
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
  albums: {
    index: {indexField: true}
  },
  classify: {
    id: {
      mainKey: true
    },
    child: {
      childField: true
    },
    parent: {
      parentField: true
    },
    level: {
      gradeField: true
    }
  }
})

flq.test(async () => {
  const db = flq.from('classify').where({
    id: 9
  })
  const res = await db.recursion({
    type: 'up',
    // gradation: true,
    stop: 2
  })
  console.log(res)
  return false
})
