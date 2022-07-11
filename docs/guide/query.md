# 查询

## 准备

为了方便演示后续的操作，我们先准备一个用于测试的表格

它看起来应该像这样：

| id  | name | gender | chinese | math | english | class | age | association |
| --- | ---- | ------ | ------- | ---- | ------- | ----- | --- | ----------- |
| 1   | 张三 | 男     | 86      | 78   | 65      | 2     | 11  | 1,5,6       |
| 2   | 李四 | 女     | 56      | 56   | 23      | 1     | 12  | 2,4         |
| 3   | 王五 | 女     | 89      | 41   | 91      | 2     | 10  | 3,6         |
| 4   | 赵六 | 男     | 86      | 97   | 78      | 3     | 11  |             |
| 5   | 钱七 | 男     | 91      | 100  | 86      | 4     | 11  | 2,3,4       |
| 6   | 郑八 | 女     | 86      | 63   | 75      | 3     | 13  | 1,3,5,6     |
| 7   | 周九 | 女     | 65      | 57   | 36      | 1     | 12  | 3,5         |
| 8   | 孙十 | 男     | 58      | 63   | 75      | 4     | 13  | 1,2         |

你可以在[演示表格](/table/student.html)处找到此表的 sql 语句。

在阅读下文前，确保你已经阅读了本文档中的[入门](./introduction.html)

## 基础查询

#### 演示

```ts
// from 要查询的表格
const db = flq.from('student')
// find 执行查询
const result = await db.find()
console.log(result)
```

#### 结果

```sh
[
  {
    id: 1,
    name: '张三',
    gender: '男',
    chinese: 86,
    math: 78,
    english: 65,
    class: 2,
    age: 11,
    association: '1,5,6'
  },
  {
    id: 2,
    name: '李四',
    gender: '女',
    chinese: 56,
    math: 56,
    english: 23,
    class: 1,
    age: 12,
    association: '2,4'
  },
  //...省略不必要的代码
]
```

## 查询部分字段

#### 演示

```ts
flq.test(async () => {
  const db = flq
    .from('student')
    .where({ gender: '女' })
    // field 查询的字段
    .field('name', { gender: 'sex' })
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

#### 结果

```sh
SELECT `name`, `gender` as 'sex' FROM `student` WHERE `gender` = '女'
[
  { name: '李四', sex: '女' },
  { name: '王五', sex: '女' },
  { name: '郑八', sex: '女' },
  { name: '周九', sex: '女' }
]
```

:::tip

前往[API 文档](/api/#field)查看`field`的详细用法

:::

## 条件查询

#### 演示

```ts
flq.test(async () => {
  // where 查询条件
  const db = flq.from('student').where({ gender: '女' })
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

#### 结果

```sh
SELECT * FROM `student` WHERE `gender` = '女'
[
  {
    id: 2,
    name: '李四',
    gender: '女',
    chinese: 56,
    math: 56,
    english: 23,
    class: 1,
    age: 12,
    association: '2,4'
  },
  {
    id: 3,
    name: '王五',
    gender: '女',
    chinese: 89,
    math: 41,
    english: 91,
    class: 2,
    age: 10,
    association: '3,6'
  },
  //...省略不必要的代码
]
```

:::tip

前往[API 文档](/api/#where)查看`where`的详细用法

:::

> 由于查询条件可能会非常复杂，FLQ为查询条件提供了更复杂的语法，详情查阅[条件](/guide/condition/)

## 聚合

#### 演示

```ts
flq.test(async () => {
  // 在field中使用AVG聚合方法
  const db = flq.from('student').field({
    AVG: ['chinese', 'math', 'english'],
  })
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

#### 结果

```sh
SELECT AVG(`chinese`) as 'chinese', AVG(`math`) as 'math', AVG(`english`) as 'english' FROM `student`
[ { chinese: '77.1250', math: '69.3750', english: '66.1250' } ]
```

:::tip

前往[API 文档](/api/#field)查看`field`的详细用法

:::

## 分组

#### 演示

```ts
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
```

#### 结果

```sh
SELECT AVG(`chinese`) as 'chinese', AVG(`math`) as 'math', AVG(`english`) as 'english', `gender` FROM `student` GROUP BY `gender`
[
  {
    chinese: '80.2500',
    math: '84.5000',
    english: '76.0000',
    gender: '男'
  },
  {
    chinese: '74.0000',
    math: '54.2500',
    english: '56.2500',
    gender: '女'
  }
]
```

:::tip

`field`和`group`的配置没有先后之分，但为了良好的可读性，一般会遵循 sql 的顺序配置

:::

## 排序

#### 演示

```ts
const db = flq
  .from('student')
  .field('name', 'age', 'chinese', 'math', 'english')
  // order 排序
  .order({
    age: 1,
    '-1': ['chinese', 'math', 'english'],
  })
const result = await db.find()
console.log(db.sql)
console.log(result)
```

#### 结果

```sh
SELECT `name`, `age`, `chinese`, `math`, `english` FROM `student` ORDER BY `age`, `chinese` DESC, `math` DESC, `english` DESC
[
  { name: '王五', age: 10, chinese: 89, math: 41, english: 91 },
  { name: '钱七', age: 11, chinese: 91, math: 100, english: 86 },
  { name: '赵六', age: 11, chinese: 86, math: 97, english: 78 },
  { name: '张三', age: 11, chinese: 86, math: 78, english: 65 },
  { name: '周九', age: 12, chinese: 65, math: 57, english: 36 },
  { name: '李四', age: 12, chinese: 56, math: 56, english: 23 },
  { name: '郑八', age: 13, chinese: 86, math: 63, english: 75 },
  { name: '孙十', age: 13, chinese: 58, math: 63, english: 75 }
]
```

:::tip

前往[API 文档](/api/#order)查看`order`的详细用法

:::

## 分页

#### 演示

```ts
const db = flq
  .from('student')
  .field('name', 'age', 'chinese', 'math', 'english')
  .limit({ page: 1, size: 3 })
const result = await db.find()
console.log(db.sql)
console.log(result)
```

#### 结果

```sh
SELECT `name`, `age`, `chinese`, `math`, `english` FROM `student` LIMIT 0, 3
[
  { name: '张三', age: 11, chinese: 86, math: 78, english: 65 },
  { name: '李四', age: 12, chinese: 56, math: 56, english: 23 },
  { name: '王五', age: 10, chinese: 89, math: 41, english: 91 }
]
```

:::tip

你也可以使用`page`和`size`来分别配置每页条数和页码，详情移步[API 文档](/api/#page)

:::

## 总列数

#### 演示

```ts
const db = flq
  .from('student')
  .field('name', 'age', 'chinese', 'math', 'english')
  .limit({ page: 1, size: 3 })
  .foundRows()
const result = await db.find()
console.log(db.sql)
console.log(result)
console.log('总列数:', db.total)
```

#### 结果

```sh
SELECT SQL_CALC_FOUND_ROWS `name`, `age`, `chinese`, `math`, `english` FROM `student` LIMIT 0, 3
[
  { name: '张三', age: 11, chinese: 86, math: 78, english: 65 },
  { name: '李四', age: 12, chinese: 56, math: 56, english: 23 },
  { name: '王五', age: 10, chinese: 89, math: 41, english: 91 }
]
总列数: 8
```

:::tip

Flq 内部使用`SQL_CALC_FOUND_ROWS`来返回总列数，将结果保存在`Flq`实例下，因此务必在调用`find`前保存`Flq`实例。
若该实例可能被多次`find`，应调用`clone`方法克隆一个独立的`Flq`实例

:::

## 虚拟字段

#### 演示、

<CodeGroup>
  <CodeGroupItem title="模型配置" active>

```ts
const flq = new Flq(
  {
    pool: true, // 使用连接池 !推荐使用
    user: 'root', // 登陆用户
    password: process.env.SQLPASSWORD, // 登陆密码
    database: 'test', // 数据库名
  },
  {
    student: {
      avg: {
        get(row) {
          return (row.chinese + row.math + row.english) / 3
        },
      },
    },
  }
)
```

  </CodeGroupItem>

  <CodeGroupItem title="sql配置">

```ts
flq.test(async () => {
  const db = flq
    .from('student')
    .field('name', 'chinese', 'math', 'english')
    .virtualGet('avg')
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

  </CodeGroupItem>
</CodeGroup>

#### 结果

```sh
SELECT `name`, `chinese`, `math`, `english` FROM `student`
[
  {
    name: '张三',
    chinese: 86,
    math: 78,
    english: 65,
    avg: 76.33333333333333
  },
  { name: '李四', chinese: 56, math: 56, english: 23, avg: 45 },
  {
    name: '王五',
    chinese: 89,
    math: 41,
    english: 91,
    avg: 73.66666666666667
  },
  { name: '赵六', chinese: 86, math: 97, english: 78, avg: 87 },
  {
    name: '钱七',
    chinese: 91,
    math: 100,
    english: 86,
    avg: 92.33333333333333
  },
  //...省略
]
```

:::tip
虚拟字段属于模型的部分，有关更多模型的介绍请前往[`模型`](/guide/model.html)
:::
