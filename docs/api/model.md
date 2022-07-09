# Model

## get

`get: (this: Flq, row: Data) => Promise<any>`

虚拟字段获取回调

在获取虚拟字段时调用

## set

`set: (this: Flq, value: any, row: Data) => Promise<void>`

虚拟字段设置回调

在设置虚拟字段时调用

## default

`default: ((this: Flq, value: Record<string, any>) => Promise<any>) | any`

插入时默认值，对虚拟字段无效

当传入回调函数时

- **this**

  `this`指向`Flq`实例本身

- **value**

  插入时传入的其他字段值

## update

`update: ((this: Flq, value: Record<string, any>) => Promise<any>) | any`

更新时默认值，对虚拟字段无效

当传入回调函数时

- **this**

  `this`指向`Flq`实例本身

- **value**

  更新时传入的其他字段值

## pretreat

`(this: Flq, value: any, data: Data) => Promise<any>`

预处理回调

当插入或更新数据时调用

- **this**

  `this`指向`Flq`实例本身

- **value**

  更新或插入时传入的值

- **data**

  更新或插入时传入的所有字段值

## postreat

`(this: Flq, value: any, data: Data) => Promise<any>`

后处理回调

当查询完数据库即将返回时调用

- **this**

  `this`指向`Flq`实例本身

- **value**

  查询后返回的值

- **data**

  查询后返回的所有字段值

## rename

`rename: (( this: Flq, key: string, value: any, row: Data ) => Promise<string> | string) | string`

重命名字段

提供应用层的重命名方案。与 sql 的`as`不同，该选项不会影响 sql 语句的格式化，并支持动态重命名

当传入函数时，接收以下参数

- **this**

  函数的 this 指向`Flq`实例

- **value**

  字段的值

- **key**

  字段名

- **row**

  所有字段的对象

## toArray

`toArray: boolean`

转数组

提供字符串到数组的自动转换，支持自定义分隔符
传入`true`时默认以`,`作为分隔符
在插入和更新时将数组转为字符串
在查询时将字符串转为数组

## subJoin（未完成）

``

定义子表，用于建立多表联合
