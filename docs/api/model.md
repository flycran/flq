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

`rename: string`

重命名字段

提供应用层的重命名方案。与sql的`as`不同，该选项不会影响sql语句的格式化

## toArray

`toArray: boolean`

转数组

在查询后将结果按`,`分隔成字符串。
该选项对插入数据没有影响，在插入数据时若传入数组则始终按`,`拼接，与模型无关。

## subJoin（未完成）

``

定义子表，用于建立多表联合
