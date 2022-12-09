import {Flq, hooks} from '../oldSrc'

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

flq.setModel({
  student: {
    id: {
      mainKey: true
    },
    association: {
      toArray: true,
      async postreat(val) {
        if(val.length === 0) return []
        const res = await flq.from('association').mainKey(val).find()
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
  },
  association: {
    id: {
      mainKey: true
    }
  }
})

flq.test(async () => {
  // const db = flq.from('classify').where({
  //   id: 9
  // })
  // const res = await db.recursion({
  //   type: 'up',
  //   // gradation: true,
  //   stop: 2
  // })
  // console.log(res)
  // const db = flq.from('student').field('id', 'name').mainKey(1)
  // const result = await db.find()
  // // from 要查询的表格
  // const db = flq.from('student')
  // // find 执行查询
  // const result = await db.find()
  // console.log(result)
  const db = flq.from('class').value({name: 205})
  const result = db.format('insert')
  console.log(db.sql)
  console.log(result)
})
