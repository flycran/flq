import {Flq, hooks, sql} from '../src'

hooks.on('format', (e: string) => {
  console.log(e)
})

const flq = new Flq(
  {
    host: '127.0.01',
    port: 3306,
    pool: true, // 使用连接池 !推荐使用
    user: 'think-tanks', // 登陆用户
    password: '123456', // 登陆密码
    database: 'think-tanks', // 数据库名
  }
)

flq.setModel({
  admin: {
    permissions: {
      toArray: true
    },
    authButton: {
      toArray: true
    }
  },
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

hooks.on('format', e => {
  console.log(e)
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
  const db = await flq.from('video').selfPlus('readCount').update()
  console.log(db)
  // const result = await db.add()
  // console.log(db.sql)
  // console.log(result)
})
