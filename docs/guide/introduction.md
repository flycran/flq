# 入门

## 安装FLQ

使用`yarn`或者`npm`安装`FLQ`

::: tip
FLQ只有一个依赖项：`mysql`
:::

```bash
yarn add flq #npm i flq
```

## 连接数据库

连接数据库的配置继承[`Node MySQL`](https://github.com/mysqljs/mysql)，可前往它的文档查看所有可用的连接配置

::: tip
`pool`用于启用连接池，强烈推荐开启连接池。因为FLQ在内部大量使用并行查询，连接池可以极大的发挥并行查询的效率
:::

```js
const { Flq } = require('flq')
const flq = new Flq({
  pool: true, // 使用连接池 !推荐使用
  user: 'root', // 登陆用户
  password: process.env.SQLPASSWORD, // 登陆密码
  database: 'test', // 数据库名
})
```

## 发起查询

首先使用`flq.from()`配置表名，再使用`find()`发起查询

```js
const db = flq.from('student')
db.find().then((e) => console.log(e))
```

## 测试模式

使用测试模式可用更好的测试FLQ，只需在`hooks`中绑定一个特殊的事件`test`

::: tip
`test`事件侦听器将异步执行，并且在侦听器执行完成后立即关闭mysql连接
:::

```js
const { Flq, hooks } = require('flq')

new Flq({
  pool: true, // 使用连接池 !推荐使用
  user: 'root', // 登陆用户
  password: process.env.SQLPASSWORD, // 登陆密码
  database: 'test', // 数据库名
})
// 使用测试模式
hooks.on('test', async (flq) => {
  const db = flq.from('student')
  const result = await db.find()
  console.log(result)
})
```

为了方便演示，后续教程将始终以测试模式运行
