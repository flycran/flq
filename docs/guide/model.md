# 模型

当掌握了基本的增删改查方法以后，就可以入门模型了。

模型是用于描述表格中字段的若干选项。在查询数据库的过程中，模型并不是必须的，但掌握模型可以极大的提高开发效率。

## 模型的定义

使用`flq.setModel`定义模型

模型定义的基本结构是

```text
{
  表名: {
    字段名: {
      选项名: 选项参数,
      选项名: 选项参数,
      ...
    },
    字段名: {
      ...选项
    },
    ...
  },
  表名: {
    ...字段
  }
}
```

比如：

```ts
flq.setModel({
  student: {
    name: {
      pretreat(value, data) {
        console.log(value)
        if (value < 12) return 12
        return value
      },
    },
  },
})
```

你可以在[model](/api/model.html)找到所有模型选项的标准定义，或者查阅下文的快速上手指南。

在阅读下文前，确保你已经阅读了本文档中的[入门](./introduction.html)

## 虚拟字段

模型的一大特色是虚拟字段，它提供了不需要修改原表的查询和储存的能力

例如想要我想在获取所有学生成绩的同时，自动计算每个学生的平均成绩，就可以定义一个虚拟字段

> 点击model切换模型配置，Query切换查询配置

<Apply>
  <template #query>

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

  </template>
  <template #model>

```ts
flq.setModel({
  student: {
    avg: {
      get(row) {
        return (row.chinese + row.math + row.english) / 3
      },
    },
  },
})
```

  </template>
</Apply>

:::tip

该模型选项不会影响 sql 语句的解析

:::

<Result>
  <template #sql>

```sql
SELECT `name`, `chinese`, `math`, `english` FROM `student`
```

  </template>
  <template #data>

```json5
[
  {
    name: '张三',
    chinese: 86,
    math: 78,
    english: 65,
    avg: 76.33333333333333,
  },
  {
    name: '李四',
    chinese: 56,
    math: 56,
    english: 23,
    avg: 45
  },
  {
    name: '王五',
    chinese: 89,
    math: 41,
    english: 91,
    avg: 73.66666666666667,
  },
  {
    name: '赵六',
    chinese: 86,
    math: 97,
    english: 78,
    avg: 87
  },
  {
    name: '钱七',
    chinese: 91,
    math: 100,
    english: 86,
    avg: 92.33333333333333,
  },
  //...省略
]
```

  </template>
</Result>

`get`选项支持`Promise`，它将阻塞数据返回，直到所有的 get 都执行完成，意味着你可以在虚拟获取函数里查询另一个表格。

:::tip

`get`选项的标准定义请前往[model](/api/model.html#get)

:::

你也可以使用`set`定义一个虚拟设置函数，该函数的返回值不会直接插入到数据库中，而是由你来自定义设置的逻辑

例如我想同时设置学生的所有成绩，我可以定义一个虚拟设置函数

<Apply>
  <template #query>

```ts
flq.test(async () => {
  const db = flq.from('student').where({id: 1}).virtualSet({all: 60})
  const result = await db.update()
  console.log(db.sql)
  console.log(result)
})
```

  </template>
  <template #model>

```ts
flq.setModel({
  student: {
    all: {
      set(value, row) {
        row.chinese = row.math = row.english = value
      },
    },
  },
})
```

  </template>
</Apply>

它将等同于如下 sql 语句

```sql
INSERT INTO `student` (`english`, `math`, `chinese`) VALUES (`60`, `60`, `60`)
```

以上演示仅仅是抛砖引玉，`set`选项同样支持`Promise`，它完全可以包含更复杂的逻辑。

:::tip

`set`选项的标准定义请前往[model](/api/model.html#set)

:::

## 预处理/后处理

模型中的另一个核心功能就是预处理/后处理。上述虚拟字段是用来操作表中不存在的数据，那么预处理/后处理就是用来处理表中存在的数据

例如我想在每个学生的年龄后拼接一段字符串

<Apply>
  <template #query>

```ts
flq.test(async () => {
  const db = flq.from('student').field('name', 'age')
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

  </template>
  <template #model>

```ts
flq.setModel({
  student: {
    age: {
      postreat(value) {
        return value + '周岁'
      },
    },
  },
})
```

  </template>
</Apply>

`postreat`选项不会影响 sql 解析

<Result>
  <template #sql>

```sql
SELECT `name`, `age` FROM `student`
```

  </template>
  <template #data>

```json5
[
  {
    name: '张三',
    age: '11周岁'
  },
  {
    name: '李四',
    age: '12周岁'
  },
  {
    name: '王五',
    age: '10周岁'
  },
  {
    name: '赵六',
    age: '11周岁'
  },
  {
    name: '钱七',
    age: '11周岁'
  },
  {
    name: '郑八',
    age: '13周岁'
  },
  {
    name: '周九',
    age: '12周岁'
  },
  {
    name: '孙十',
    age: '12周岁'
  },
]
```

  </template>
</Result>

`postreat`同样支持`Promise`

:::tip

`postreat`选项的标准定义请前往[model](/api/model.html#postreat)

:::

也可以通过`pretreat`对插入数据进行预处理，用法类似，不再赘述

:::tip

`pretreat`选项的标准定义请前往[model](/api/model.html#pretreat)

:::

## 插入/更新默认值

模型还允许对插入和更新数据分别定义默认值，并支持动态生成默认值，甚至支持`Promise`

例如实现数据创建时间

<Apply>
  <template #query>

```ts
flq.test(async () => {
  const db = flq.from('class').value({name: 205})
  const result = await db.add()
  console.log(db.sql)
  console.log(result)
})
```

  </template>
  <template #model>

```ts
flq.setModel({
  class: {
    createAt: {
      default() {
        return new Date()
      },
    },
  },
})
```

  </template>
</Apply>

#### 结果

<Result>
  <template #sql>

```sql
INSERT INTO `class` (`name`, `createAt`, `updateAt`) VALUES (205, '2022-07-10 16:38:15.844', '2022-07-10 16:38:15.844')
```

  </template>
  <template #data>

```json5
{
  fieldCount: 0,
  affectedRows: 1,
  insertId: 8,
  info: '',
  serverStatus: 2,
  warningStatus: 0
}
```

  </template>
</Result>

:::tip

`default`选项的标准定义请前往[model](/api/model.html#default)

:::

也可以用`update`选项实现数据更新时间

<Apply>
  <template #query>

```ts
flq.test(async () => {
  const db = flq.from('class').value({name: 205})
  const result = await db.add()
  console.log(db.sql)
  console.log(result)
})
```

  </template>
  <template #model>

```ts
flq.setModel({
  class: {
    updateAt: {
      update() {
        return new Date()
      },
    },
  },
})
```

  </template>
</Apply>

结果

<Result>
  <template #sql>

```sql
UPDATE `class` SET `teachers` = '1,2,3', `updateAt` = '2022-07-10 17:06:37.858' WHERE `name` = 205
```

  </template>
  <template #data>

```json5
{
  fieldCount: 0,
  affectedRows: 1,
  insertId: 8,
  info: '',
  serverStatus: 2,
  warningStatus: 0
}
```

  </template>
</Result>

`update`选项在`add`中也会调用

:::tip

`update`选项的标准定义请前往[model](/api/model.html#update)

:::

## 其他

更多的模型选项请查阅[model](/api/model.html)