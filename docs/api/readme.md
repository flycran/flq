# Flq

## from

**from(...option: string[])**

> 配置操作的表格，尽量优先配置该选项，否则[字段映射](/)和模型处理将不会工作

- **option**
  直接填表名即可，可以传多个表名，若传递多个表名，在引用字段时则需要显式指定表名。例如:`'student.name'`，否则将影响[字段映射](/)

## field

**field(...option: FieldOption[])**

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
    // result: 'name', 'age'
    ```

  - 当传入字符串数组时

    将查询所有数组中的字段，与上述用法类似，通常配合聚合方法使用。

    ```js
    field(['name', 'age'])
    // result: 'name', 'age'
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
  // result: AVG(`chinese`) as 'chinese', AVG(`math`) as '数学平均成绩'
  ```

  :::tip
  使用聚合方法的字段，如果不指定重命名，将默认重命名为字段本身的名字
  :::

  当键名时聚合方法时，`value`将作为`option`被重新传入`field`解析，但默认会包裹聚合方法，在多个字段需要用同一个聚合方法时尤其好用

  ```js
  field({
    AVG: ['chinese', 'math', 'english'],
  })
  // result: AVG(`chinese`) as 'chinese', AVG(`math`) as 'math', AVG(`english`) as 'english'
  ```

  如果需要重命名

  ```js
  field({
    AVG: { chinese: '语文', math: '数学', english: '英语' },
  })
  ```

## group

**group(option: string)\***

分组查询

- **option**

  传入分组的字段即可

```js
group('gender')
```
