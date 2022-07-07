# Flq

## test

`test(callBack: (this: Flq) => Promise<any>): void`

> 用于测试连接。
> 在`callBack`执行完后自动调用`flq.end()`方法结束连接。

- **callBack**

  异步回调函数。该回调的`this`指向`flq`实例本身。

```js
flq.test(async () => {
  const db = flq.from('student')
  const result = await db.find()
  console.log(result)
})
```

## getConnect

`getConnect(): Promise<Connection>`

> 返回一个数据库连接

## end

`end(): Promise<void>`

> 用于结束数据库连接

## query

`query(sql: string, connection?: Connection | Pool): Promise<any>`

> 传入一个sql语句发起查询，可自定义执行查询的连接

- **sql**

  sql语句
- **connection**

  连接

## format

`format(template: string): string`

> 格式化sql语句

- **template**

  sql模板。所用可用的模板可以在[flq/src/templates](https://gitee.com/flycran/flq/blob/master/src/templates.ts)
  下找到。

## send

`send(template: string): Promise<any>`

> 发送sql语句。与`query`不同，`send`将自动调用`format`生成sql语句，并调用模型处理。

- **template**

  sql模板。所用可用的模板可以在[flq/src/templates](https://gitee.com/flycran/flq/blob/master/src/templates.ts)
  下找到。

## clone

`clone(): Flq`

> 克隆`flq`实例，将继承mysql连接和FLQ模型，拷贝sql配置和字段映射。

## from

`from(...option: string[])`

> 配置操作的表格，尽量优先配置该选项，否则模型处理将不会工作

- **option**
  直接填表名即可，可以传多个表名，若传递多个表名，在引用字段时则需要显式指定表名。例如:`'student.name'`，否则将影响[字段映射](/)

## field

`field(...option: FieldOption[]): Flq`

> 配置查询的字段，该配置会影响[字段映射](/)

- **option**
  字段配置，可选字符串、字符串数组或者对象

    - 当传入字符串时

      将查询该字段，支持显式指定表名，例如：`'student.name'`

      :::tip
      `Flq`所有需要用到字段名的地方都支持显式指定表名，下文不再赘述
      :::

      ```js
      field('name', 'age')
      // 'name', 'age'
      ```

    - 当传入字符串数组时

      将查询所有数组中的字段，与上述用法类似，通常配合聚合方法使用。

      ```js
      field(['name', 'age'])
      // 'name', 'age'
      ```

- 当传入对象时

  将键`key`重命名为值`value`

  ```js
  field({ gender: 'sex' })
  // result: `gende` as 'sex'
  ```

  当`value`是数组时，可以指定聚合方法和可选的重命名

  ```js
  field({ chinese: ['AVG'], math: ['AVG', '数学平均成绩'] })
  // AVG(`chinese`) as 'chinese', AVG(`math`) as '数学平均成绩'
  ```

  :::tip
  使用聚合方法的字段，如果不指定重命名，将默认重命名为字段本身的名字
  :::

  当键名时聚合方法时，`value`将作为`option`被重新传入`field`解析，但默认会包裹聚合方法，在多个字段需要用同一个聚合方法时尤其好用

  ```js
  field({
    AVG: ['chinese', 'math', 'english'],
  })
  // AVG(`chinese`) as 'chinese', AVG(`math`) as 'math', AVG(`english`) as 'english'
  ```

  如果需要重命名

  ```js
  field({
    AVG: { chinese: '语文', math: '数学', english: '英语' },
  })
  // AVG(`chinese`) as '语文', AVG(`math`) as '数学', AVG(`english`) as '英语'
  ```

## group

`group(option: string): Flq`

分组查询

- **option**

  传入分组的字段即可

```js
group('gender')
```

## limit

`limit(...option: LimitOption): Flq`

> 配置分页

- **...option**

  传入对象或字符串数组

    - 传入对象时

      `{ page: number, size: number }`

        - page

          页码

        - page

          每页条数
      ```js
      limit({
        page: 1,
        size: 5
      })
      // LIMIT 0, 5
      ```
    - 传入数值时

      `[offset: number, limit: number]`

        - offset

          偏移量

        - limit

          条数
      ```js
      limit(5, 5)
      // LIMIT 5, 5
      ```

## size

`size(size: number): Flq`

> 单独设置每页条数

- **size**

  每页条数

## page

`page(page: number): Flq`

> 单独设置每页条数

- **page**

  页码

:::warning

在配置`page`前必须先配置`size`

:::

## foundRows

`foundRows(): Flq`

> 在分页查询时，自动返回查询的总条数。总条数将保存在调用`flq.find()`的实例下。

```js

```