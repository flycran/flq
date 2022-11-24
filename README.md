# FLQ

- Node 与数据库交互的应用层解决方案

- 让缺乏 SQL 语句经验的前端开发者也可以轻松与数据库交互

- 前往[FLQ 中文文档](https://flycran.gitee.io/flq/)查看完整文档

## 基本查询

```ts
const { Flq, hooks } = require('flq')

const flq = new Flq({
  pool: true, // 使用连接池 !推荐使用
  user: 'root', // 登陆用户
  password: process.env.SQLPASSWORD, // 登陆密码
  database: 'test', // 数据库名
})
// 使用测试模式
flq.test(async () => {
  const db = flq.from('student')
  const result = await db.find()
  console.log(result)
})
```

## 分组聚合

```ts
flq.test(async () => {
  const db = flq
    .from('student')
    .field(
      {
        AVG: ['chinese', 'math', 'english'],
      },
      'gender'
    )
    // group 分组
    .group('gender')
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

## 总列数

```ts
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
```
