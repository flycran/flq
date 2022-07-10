# 入门

## 安装 FLQ

使用`yarn`或者`npm`安装`FLQ`

::: tip
FLQ 只有一个依赖项：`mysql2`
:::

<CodeGroup>
  <CodeGroupItem title="YARN" active>

```sh:no-line-numbers
yarn add flq
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```sh:no-line-numbers
npm i flq
```

  </CodeGroupItem>
</CodeGroup>

## 连接数据库

连接数据库的配置继承[`Node MySQL`](https://github.com/mysqljs/mysql)，可前往它的文档查看所有可用的连接配置

::: tip
`pool`用于启用连接池，强烈推荐开启连接池。因为 FLQ 在内部大量使用并行查询，连接池可以极大的发挥并行查询的效率
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

## 演示表格

本文档将使用统一的表格来做查询演示，你可以在[演示表格](/table/student.html)处找到本文档中使用到的所有的演示表格。

## 测试模式

使用测试模式可用更好的测试 FLQ

::: tip
`test`方法将异步执行，并且在回调完成后立即关闭`mysql`连接
:::

```js
const { Flq } = require('flq')

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
  // 打印sql语句
  console.log(db.sql)
  // 打印查询结果
  console.log(result)
})
```

为了方便演示，后续教程将始终以测试模式运行，并省略不必要的演示。

## 在线运行

你可以在线运行`FLQ`，使用`flq.format(template: string)`方法可以直接生成 sql 语句而不需要连接数据库。方便在线运行演示。

> 前往 [RunKit](https://runkit.com/flycran/flq-query) 在线运行 [![](https://img.shields.io/badge/Flq-RunKit%20-%23F55FA6)](https://runkit.com/flycran/flq-query)
