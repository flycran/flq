# flq

- 基于 mysql2 的步进式数据库交互框架

- 让缺乏 SQL 语句经验的前端开发者也可以轻松与数据库交互

- 下面是一个基本的示例

```js
const { Flq, hooks } = require('flq')

const flq = new Flq({
  pool: true, // 使用连接池 !推荐使用
  user: 'root', // 登陆用户
  password: process.env.SQLPASSWORD, // 登陆密码
  database: 'test', // 数据库名
})
// 使用测试模式
hooks.on('test', async () => {
  const db = flq.from('student')
  const result = await db.find()
  console.log(result)
})
```

前往[FLQ主页](https://flq.flycran.xyz)查看完整文档
