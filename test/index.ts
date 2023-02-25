import {Flq, hooks, sql} from '../src'

hooks.on('format', (e: string) => {
  console.log(e)
})

const flq = new Flq(
  {
    user: 'root', // 登陆用户
    password: process.env.SQLPASSWORD, // 登陆密码
    database: 'test', // 数据库名
  }
)

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
  const db = flq.from('class').set({id: sql('id + 1')}).format('update')
  // const result = await db.add()
  // console.log(db.sql)
  // console.log(result)
})
