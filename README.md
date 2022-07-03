# flq

- 基于 mysql2 的步进式数据库交互框架

- 让缺乏 SQL 语句经验的前端开发者也可以轻松与数据库交互

- 下面是一个基本的示例

```js
const { Flq } = require('flq')
let db = new Flq({...})
const { length } = require('flq/functions')

const sql = await db
  .from('user')
  .field('name', 'password')
  .field({
    power: '权限',
    mail: {
      as: '邮箱',
    },
  })
  .where({
    id: 1,
  })
  .where([length('mail'), '>', 18])
  .format('select')
// output:
// 	SELECT `name`, `password`, `power` as 权限, `mail` as `邮箱`
// 		FROM `user`
//		WHERE `id` = 1 AND LENGTH(`mail`) > 18
```

该框架仍在开发中，暂不提供接口文档，但一定会在不久的将来发布。
