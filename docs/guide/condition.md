# 条件

`Flq`对`where`提供了更为复杂的配置方法，以便迎合各种场景的需求，其核心特性包括

- Sql 方法

- 比较符

- 连接符

- 插槽

- 自定义 Sql

在阅读下文前，确保你已经阅读了本文档中的[入门](./introduction.html)

## 基本查询

先来回顾一下最简单的查询条件

```ts
flq.test(async () => {
  const db = flq.from('student').where({id: 1})
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE `id` = 1
```

## 自定义连接符

### 全局连接符

```ts
flq.test(async () => {
  const db = flq.from('student').where({id: 1, name: '张三'}, 'OR')
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE `id` = 1 OR `name` = '张三'
```

### 局部连接符

```ts
flq.test(async () => {
  const db = flq.from('student').where({
    OR: {
      id: 1,
      name: '张三',
    },
  })
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE (`id` = 1 OR `name` = '张三')
```

### 优先级

局部连接符 > 全局连接符

```ts
flq.test(async () => {
  const db = flq.from('student').where(
    {
      id: 1,
      AND: {
        age: 10,
        name: '张三',
      },
    },
    'OR'
  )
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE `id` = 1 OR (`age` = 10 AND `name` = '张三')
```

## 自定义比较符

### 全局比较符

```ts
flq.test(async () => {
  const db = flq.from('student').where({id: 1, name: '张三'}, 'AND', '!=')
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE `id` != 1 AND `name` != '张三'
```

### 局部比较符

```ts
flq.test(async () => {
  const db = flq.from('student').where({'!=': {id: 1, name: '张三'}})
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE (`id` != 1 AND `name` != '张三')
```

### 专用比较符

```ts
flq.test(async () => {
  const db = flq
    .from('student')
    .where({id: {com: '!=', val: 1}, name: '张三'})
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE `id` != 1 AND `name` = '张三'
```

## 优先级

专用比较符 > 局部比较符 > 全局比较符

```ts
flq.test(async () => {
  const db = flq
    .from('student')
    .where({id: {com: '>', val: 1}, name: '张三'}, 'AND', '!=')
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE `id` > 1 AND `name` != '张三'
```

## 特殊比较符

### IS NULL/IS NOT NULL

该类型的比较符不需要提供`val`选项

```ts
flq.test(async () => {
  const db = flq.from('student').where({
    name: {
      com: 'IS NULL',
    },
  })
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE `name` IS NULL
```

### IN/NOT IN

该类型比较符要求传入数组

```ts
flq.test(async () => {
  const db = flq.from('student').where({
    name: {
      com: 'IN',
      val: ['张三', '李四'],
    },
  })
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE `name` IN ('张三', '李四')
```

### BETWEEN

该比较符要求传入长度为 2 的数组

```ts
flq.test(async () => {
  const db = flq.from('student').where({
    id: {
      com: 'BETWEEN',
      val: [2, 4],
    },
  })
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `student` WHERE `id` BETWEEN 2 AND 4
```

## Slq 方法

所有可用的方法可以在`flq/methods`包下，需要导入使用

<CodeGroup>
  <CodeGroupItem title="TypeScript" active>

```ts
import {FIND_IN_SET} from 'flq/functions'
```

  </CodeGroupItem>

  <CodeGroupItem title="JavaScript">

```js
const {FIND_IN_SET} = require('flq/functions')
```

  </CodeGroupItem>
</CodeGroup>

后面的演示将统一使用 TypeScript 的写法，使用 Node JavaScript 的自行改变相关语法

- 方法会自行判断传入的参数是字段还是数据，你可以在方法的 JsDoc 中找到相关的定义

- 所有的方法会返回一个`Sql`的实例，`Sql`可以插入在许多位置，它可以跳过 Flq 本身的语法解析，直接拼接到 sql 中

```ts
flq.test(async () => {
  const db = flq.from('class').where(FIND_IN_SET(1, 'teachers'))
  const result = await db.find()
  console.log(db.sql)
  console.log(result)
})
```

```sql
SELECT * FROM `class` WHERE FIND_IN_SET(1, `teachers`)
```

除了 mysql 常见的方法外，Flq 也有一些独特的方法，通常用于控制 sql 结构

### brac

`brac(option: WhereOption, connector?: WhereOption.Connector, comparator?: WhereOption.Comparator): Sql`

用于插入一个括号。其参数与`flq.where`完全相同，故不再演示

### comp

`comp( field: string | Sql, comparator: 'BETWEEN', value0: Sql | Dbany, value1: Sql | Dbany ): Sql`

`comp(field: string | Sql, comparator: WhereOption.NoVal): Sql`

`comp( field: string | Sql, comparator: WhereOption.ArrVal, value: Dbany[] ): Sql`

`comp( field: string | Sql, comparator: WhereOption.Comparator, value: Sql | Dbany ): Sql`

用于插入一个带比较符的表达式

```ts
import {comp} from 'flq/methods'

comp('age', 'BETWEEN', 1, 2)
comp('age', '<', 1)
comp('age', 'IN', [1, 2, 3])
comp('age', 'IS NULL')
```

```sql
`age` BETWEEN 1 AND 2
`age` < 1
`age` IN (1, 2, 3)
`age` IS NULL
```

### oper

`oper(...param: (Sql | Operator | string | number)[]): Sql`

```ts
import {oper} from 'flq/methods'

oper('age', '+', 1)
oper('age', '+', 1, '%', 2)
oper(oper('age', '+', 1), '*', 2)
```

```sql
`age` + 1
`age` + 1 % 2
(`age` + 1) * 2
```

`oper`会自动判断输入值的类型，其遵循以下规则

- 传入`Sql`

  直接插入

- 传入运算符

  直接插入

- 传入字符串

  用`field`解析成字段名

- 其他

  将转为数值类型后插入

### method

`method(name: string, ...params: any[]): Sql`

自定义方法

该方法不能自动推断参数的类型，为了防止 Sql 注入，`method`默认会对所有传入进行安全处理，如果需要传入字段名，请使用`field`主动声明

```ts
import {field, escape} from 'flq'
import {method} from 'flq/methods'

method('RIGHT', field('name'), 2)
```

```sql
RIGHT(`name`, 2)
```

## 插槽

有时候查询条件的结构非常复杂，但又必须引用外部的值，迫使我们不得不把繁杂的`where`配置留到响应回调里面

插槽允许你先定义条件结构，再动态传值

只需在需要定义插槽的位置传入`slot(name: string)`即可

例如我想查询所有成绩均大于插槽`line`的学生

<Apply>
  <template #query>

```ts
// 封装
const db = flq
  .from('student')
  .field('name', 'chinese', 'math', 'english')
  .where(
    {
      chinese: slot('line'),
      math: slot('line'),
      english: slot('line'),
    },
    'AND',
    '>'
  )
// 查询
const result = await db.insert({
  line: 60,
}).find()
```

  </template>
</Apply>

#### 结果

<Result>
  <template #sql>

```sql
SELECT `name`, `chinese`, `math`, `english` FROM `student` WHERE `chinese` > 60 AND `math` > 60 AND `english` > 60
```

  </template>
  <template #data>

```json5
[
  {
    name: '张三',
    chinese: 86,
    math: 78,
    english: 65
  },
  {
    name: '赵六',
    chinese: 86,
    math: 97,
    english: 78
  },
  {
    name: '钱七',
    chinese: 91,
    math: 100,
    english: 86
  },
  {
    name: '郑八',
    chinese: 86,
    math: 63,
    english: 75
  },
]
```

  </template>
</Result>

插槽可以在任何允许传入`Sql`的地方插入，但插入的值一定会被当作数据进行安全处理，如果你想往插槽中插入原始
sql，请传入一个`Sql`对象

例如查询数学成绩比英语成绩高 20 的学生

<Apply>
  <template #query>

```ts
// 封装
const db = flq
  .from('student')
  .field('name', 'chinese', 'math', 'english')
  .where(
    {
      math: slot('math'),
    },
    'AND',
    '>'
  )
// 查询
const result = await db.insert({
  math: oper('english', '+', 20),
}).find()
```

  </template>
</Apply>

#### 结果

<Result>
  <template #sql>

```sql
SELECT `name`, `chinese`, `math`, `english` FROM `student` WHERE `math` > `english` + 20
```

  </template>
  <template #data>

```json5
[
  {
    name: '李四',
    chinese: 56,
    math: 56,
    english: 23
  },
  {
    name: '周九',
    chinese: 65,
    math: 57,
    english: 36
  }
]
```

  </template>
</Result>

当然了，如果只是为了查询数学成绩比英语成绩高的学生，完全没比较使用这么复杂的语法，以上仅仅是为了演示插入表达式的可能性

## 查询主键

如果只想简单的根据表格的某一个字段来查询(通常是主键)，使用`mainKey()`方法能节省很多代码，当省略字段名时，必须在模型中定义

<Apply>
  <template #query>

```ts
const db = flq.from('student').field('id', 'name').mainKey(1)
const result = await db.find()
```

  </template>
  <template #model>

```ts
flq.setModel({
  student: {
    id: {
      mainKey: true
    },
  }
})
```

  </template>
</Apply>

**结果**

<Result>
  <template #sql>

```sql
SELECT `id`, `name` FROM student WHERE id = 1
```

  </template>
  <template #data>

```json5
[
  {
    id: 1,
    name: '张三'
  }
]
```

  </template>
</Result>