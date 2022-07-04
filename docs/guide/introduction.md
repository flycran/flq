# 入门

## 安装FLQ

使用`yarn`或者`npm`安装`FLQ`

> FLQ只有一个依赖项：`mysql`

```bash
yarn add flq #npm i flq
```

## 连接数据库

> 连接数据库的配置继承[`Node MySQL`](https://github.com/mysqljs/mysql)，可前往它的文档查看所有可用的连接配置



> `pool`用于启用连接池，强烈推荐开启连接池。因为FLQ在内部大量使用并行查询，连接池可以极大的发挥并行查询的效率

```js
const { Flq } = require('flq')
const db = new Flq({
  pool: true, // 使用连接池 !推荐使用
  user: 'root', // 登陆用户
  password: process.env.SQLPASSWORD, // 登陆密码
  database: 'test', // 数据库名
})
```

## 发起查询

> 由于
