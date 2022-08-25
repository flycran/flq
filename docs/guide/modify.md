# 增删改

## 插入

使用`flq.add`方法插入数据

```ts
const db = flq.from('student').value({
  name: '新同学',
})
const result = await db.add()
console.log(db.sql)
console.log(result)
```

结果

<Result>
  <template #sql>

```sql
INSERT INTO `student` (`name`) VALUES ('新同学')
```

  </template>
  <template #data>

```json5
{
  fieldCount: 0,
  affectedRows: 1,
  insertId: 11,
  info: '',
  serverStatus: 2,
  warningStatus: 0
}
```

  </template>
</Result>

## 修改

使用`flq.update`方法修改数据

<Apply>
  <template #query>

```ts
const db = flq
  .from('student')
  .where({
    id: 11,
  })
  .set({
    name: '小明',
  })
const result = await db.update()
console.log(db.sql)
console.log(result)
```

  </template>
</Apply>

#### 结果

<Result>
  <template #sql>

```sql
UPDATE `student` SET `name` = '小明' WHERE `id` = 11
```

  </template>
  <template #data>

```json5
{
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  info: 'Rows matched: 1  Changed: 1  Warnings: 0',
  serverStatus: 2,
  warningStatus: 0,
  changedRows: 1
}
```

  </template>
</Result>

## 删除

使用`flq.del`方法删除数据

<Apply>
  <template #query>

```ts
const db = flq
  .from('student')
  .where({
    id: 11,
  })
const result = await db.del()
console.log(db.sql)
console.log(result)
```

  </template>
</Apply>

<Result>
  <template #sql>

```sql
DELETE FROM `student` WHERE `id` = 11
```

  </template>
  <template #data>

```json5
{
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  info: '',
  serverStatus: 2,
  warningStatus: 0
}
```

  </template>
</Result>
