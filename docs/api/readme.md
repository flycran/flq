# Flq

## 方法

### test

`test(callBack: (this: Flq) => Promise<any>): void`

用于测试连接。

在`callBack`执行完后自动调用`flq.end()`方法结束连接。

- **callBack**

  异步回调函数。该回调的`this`指向`flq`实例本身。

:::tip

如果只是想利用异步环境，可以`return false`以阻止自动关闭连接

:::

```ts
flq.test(async () => {
  const db = flq.from('student')
  const result = await db.find()
  console.log(result)
})
```

### getConnect

`getConnect(): Promise<Connection>`

返回一个数据库连接

### end

`end(): Promise<void>`

用于结束数据库连接

### query

`query(sql: string, connection?: Connection | Pool): Promise<any>`

传入一个 sql 语句发起查询，可自定义执行查询的连接

- **sql**

  sql 语句

- **connection**

  连接

### format

`format(template: string): string`

格式化 sql 语句

- **template**

  sql 模板。所用可用的模板可以在[flq/src/templates](https://gitee.com/flycran/flq/blob/master/src/templates.ts)
  下找到。

### send

`send(template: string): Promise<any>`

发送 sql 语句。与`query`不同，`send`将自动调用`format`生成 sql 语句，并调用模型处理。

- **template**

  sql 模板。所用可用的模板可以在[flq/src/templates](https://gitee.com/flycran/flq/blob/master/src/templates.ts)
  下找到。

### clone

`clone(): Flq`

克隆`flq`实例，将继承 mysql 连接和 FLQ 模型，拷贝 sql 配置和字段映射。

### insert

`insert(slot: Record<string, any>): Flq`

插入（插槽）

- **slot**
  由插槽名和值组成的键值对

### from

`from(...option: string[]): Flq`

配置操作的表格，尽量优先配置该选项，否则模型处理将不会工作

- **option**
  直接填表名即可，可以传多个表名，若传递多个表名，在引用字段时则需要显式指定表名。例如:`'student.name'`
### mainKey

`mainKey(value: Dbany | Dbany[], idKey?: string): Flq`

按主键查询或指定键查询

- **value**
  查询值，传入数组将查询匹配数组中任意元素的数据，否则查询`idKey`等于`value`的数据
- **idKey**
  键名，省略时将使用

### field

`field(...option: FieldOption[]): Flq`

配置查询的字段，该配置会影响[字段映射](/)

- **option**
  字段配置，可选字符串、字符串数组或者对象

  - 当传入字符串时

    将查询该字段，支持显式指定表名，例如：`'student.name'`

    :::tip
    `Flq`所有需要用到字段名的地方都支持显式指定表名，下文不再赘述
    :::

    ```ts
    field('name', 'age')
    // 'name', 'age'
    ```

  - 当传入字符串数组时

    将查询所有数组中的字段，与上述用法类似，通常配合聚合方法使用。

    ```ts
    field(['name', 'age'])
    // 'name', 'age'
    ```

- 当传入对象时

  将键`key`重命名为值`value`

  ```ts
  field({ gender: 'sex' })
  // result: `gende` as 'sex'
  ```

  当`value`是数组时，可以指定聚合方法和可选的重命名

  ```ts
  field({ chinese: ['AVG'], math: ['AVG', '数学平均成绩'] })
  // AVG(`chinese`) as 'chinese', AVG(`math`) as '数学平均成绩'
  ```

  :::tip
  使用聚合方法的字段，如果不指定重命名，将默认重命名为字段本身的名字
  :::

  当键名时聚合方法时，`value`将作为`option`被重新传入`field`解析，但默认会包裹聚合方法，在多个字段需要用同一个聚合方法时尤其好用

  ```ts
  field({
    AVG: ['chinese', 'math', 'english'],
  })
  // AVG(`chinese`) as 'chinese', AVG(`math`) as 'math', AVG(`english`) as 'english'
  ```

  如果需要重命名

  ```ts
  field({
    AVG: { chinese: '语文', math: '数学', english: '英语' },
  })
  // AVG(`chinese`) as '语文', AVG(`math`) as '数学', AVG(`english`) as '英语'
  ```

### where

`where(...option: WhereOption[]): Flq`

查询条件

### group

`group(option: string): Flq`

分组查询

- **option**

  传入分组的字段即可

```ts
group('gender')
```

### limit

`limit(...option: LimitOption): Flq`

配置分页

- **...option**

  传入对象或字符串数组

  - 传入对象时

    `{ page: number, size: number }`

    - page

      页码

    - page

      每页条数

    ```ts
    limit({
      page: 1,
      size: 5,
    })
    // LIMIT 0, 5
    ```

  - 传入数值时

    `[offset: number, limit: number]`

    - offset

      偏移量

    - limit

      条数

    ```ts
    limit(5, 5)
    // LIMIT 5, 5
    ```

### size

`size(size: number): Flq`

单独设置每页条数

- **size**

  每页条数

### page

`page(page: number): Flq`

单独设置每页条数

- **page**

  页码

:::warning

在配置`page`前必须先配置`size`

:::

### order

`order(option: OrderOption, defOp?: OrderOption.Op): Flq`

配置排序

- **option**

  传入字符串、字符串数组或对象

  - 传入字符串时

    按传入的字段排序，排序规则取决于`defOp`的值

    ```ts
    order('age')
    // ORDER BY `age`
    order('age', -1)
    // ORDER BY `age` DESC
    ```

  - 传入数组时

    将所有数组中的字段按顺序排序，排序规则取决于`defOp`的值

    ```ts
    order(['age', 'id'])
    // ORDER BY `age`, `id`
    order(['age', 'id'], -1)
    // ORDER BY `age` DESC, `id` DESC
    ```

  - 传入对象时

    将按照`value`的值决定排序规则

    ```ts
    order({ age: 1, id: -1 })
    // ORDER BY `age`, `id` DESC
    ```

    当键名是排序规则时，将`value`重新传入`order`解析。可以传入所有`option`允许的值，但通常配合数组使用。

    ```ts
    order({
      1: ['id', 'age'],
      '-1': ['chinese', 'math', 'english'],
    })
    // ORDER BY `id`, `age`, `chinese` DESC, `math` DESC, `english` DESC
    ```

- **defOp**

  默认排序规则，可用的排序规则为`1`、`-1`、`ASC`、`DESC`。其中的`1`和`-1`可以是字符串或数值

### foundRows

`foundRows(): Flq`

在分页查询时，自动返回查询的总条数。总条数将保存在调用`flq.find()`的实例下。

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

### find

`find(): Promise<Record<string, any>[]>`

执行查询语句[（template: select）](https://gitee.com/flycran/flq/blob/master/src/templates.ts)

### first

`first(): Promise<Record<string, any>>`

查询匹配的第一条数据[（template: first）](https://gitee.com/flycran/flq/blob/master/src/templates.ts)

该方法会忽略分页、分组、排序等无意义的配置项。

### add

`add(): Promise<Record<string, any>>`

执行插入语句[（template: insert）](https://gitee.com/flycran/flq/blob/master/src/templates.ts)

### count

`count(): Promise<number>`

查询复合条件的数据条数[（template: count）](https://gitee.com/flycran/flq/blob/master/src/templates.ts)

### del

`del(): Promise<Record<string, any>>`

指向删除语句[（template: delete）](https://gitee.com/flycran/flq/blob/master/src/templates.ts)

## 属性

### type

`type: 'select' | 'insert' | 'update' | 'delect'`

sql语句的类型，在调用查询时定义
