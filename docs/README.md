---
home: true
heroImage: /hero.png
heroText: FLQ
tagline: Node与数据库交互的应用层解决方案（未完成，谨慎使用）
actions: 
  - text: 快速上手  ▶
    link: /guide/
    type: primary
lang: zh
features:
  - title: 步进配置
    details: 分别配置sql的每个部分，或者多次配置sql中的一部分。您可以先配置公共的选项，将其保存下来，以便以后使用。
  - title: 并行查询
    details: FLQ在内部进行虚拟字段和子字段的查询时，将并行查询，极大地提高查询效率。
  - title: 异步订阅
    details: FLQ内部使用自带的AsyncEvent异步订阅事件，将顺序执行所有同步侦听器，并且并行执行所有异步侦听器。
footer: 湘ICP备2022005467号
---

- **没有任何后端开发经验？**
- **手写 SQL 语句繁琐冗长？**
- **数据库的多表联合查询？**
- **数据库的递归迭代查询？**

## FLQ [![npm type version](https://badgen.net/npm/v/flq)](https://www.npmjs.com/package/flq) 都能满足！

### 步进式配置

> **!** 复用公共配置项

```ts
const dbTest = db.from('test').where({ deleteAt: 1 })
const my = await dbTest.where({ uid: 1 }).find()
const all = await dbTest.limit({ size: 10, page: 1 }).find()
```
