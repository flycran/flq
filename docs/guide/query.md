# 查询

## 准备

为了方便演示后续的操作，我们先准备一个用于测试的表格

现在它看起来应该像这样：

| id   | name | gender | chinese | math | english | class | age  | association |
| ---- | ---- | ------ | ------- | ---- | ------- | ----- | ---- | ----------- |
| 1    | 张三 | 男     | 86      | 78   | 65      | 2     | 11   | 1,5,6       |
| 2    | 李四 | 女     | 56      | 56   | 23      | 1     | 12   | 2,4         |
| 3    | 王五 | 女     | 89      | 41   | 91      | 2     | 10   | 3,6         |
| 4    | 赵六 | 男     | 86      | 97   | 78      | 3     | 11   |             |
| 5    | 钱七 | 男     | 91      | 100  | 86      | 4     | 11   | 2,3,4       |
| 6    | 郑八 | 女     | 86      | 63   | 75      | 3     | 13   | 1,3,5,6     |
| 7    | 周九 | 女     | 65      | 57   | 36      | 1     | 12   | 3,5         |
| 8    | 孙十 | 男     | 58      | 63   | 75      | 4     | 13   | 1,2         |

你可用在[演示表格](/table/student.html)处找到此表的sql语句。

## 基础查询

### 演示

```js
hooks.on('test', async () => {
  const db = flq.from('student')
  const result = await db.find()
  console.log(result)
})
```

### 结果

```js
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

## 条件查询

### 演示

```js
hooks.on('test', async () => {
  const db = flq.from('student').where({gender: '女'})
  const result = await db.find()
  console.log(result)
})
```

### 结果

```js
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

前往[API文档](/api/flq.html#where)查看`where`的详细用法

::: 

## 查询部分字段

### 演示

```js
hooks.on('test', async () => {
  const db = flq
    .from('student')
    .where({ gender: '女' })
    .field('name', { gender: 'sex' })
  const result = await db.find()
  console.log(result)
})
```

### 结果

```js
[
  { name: '李四', sex: '女' },
  { name: '王五', sex: '女' },
  { name: '郑八', sex: '女' },
  { name: '周九', sex: '女' }
]
```

:::tip

前往[API文档](/api/flq.html#field)查看`field`的详细用法

::: 

## 聚合

### 演示

```js
hooks.on('test', async () => {
  const db = flq.from('student').field({
    chinese: {
      met: 'avg',
      as: 'chinese',
    },
    math: {
      met: 'avg',
      as: 'math',
    },
    english: {
      met: 'avg',
      as: 'english',
    },
  })
  const result = await db.find()
  console.log(result)
})
```

### 演示

```js
[ { chinese: '77.1250', math: '69.3750', english: '66.1250' } ]
```

:::tip

前往[API文档](/api/flq.html#field)查看`field`的详细用法

:::

## 虚拟字段

。。。
