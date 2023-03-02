import { exec } from 'child_process'
import { Field, ProxyField, Table } from '../src'
import { DbType, DecFieldGet, DecFieldSet, DTCNT, FieldOption, FOCNT_F } from '../src/types'

class ListField<T extends DbType.String = DbType.String, G extends string[] = string[], S extends string[] = string[]> extends Field<DbType.String, string[], string[]> {
  constructor(option: Omit<FieldOption<DbType.String>, 'get' | 'set'>) {
    super(option)
    this.get = (value: string) => value? value.split(','): []
    const a: DTCNT<DbType.String> = ''
    this.set = (value: string[]) => value.join(',')
  }
}

const user = new Table({
  //* 用户id
  userId: new Field({
    type: 'int',
  }),
  //* 用户名
  name: new ListField({
    type: 'varchar',
  })
})

const f = new ListField({
  type: 'varchar'
})

type A = ListField<DbType.String, string[], string[]> extends Field<DbType, unknown, unknown> | ProxyField<unknown, unknown> ? 0 : 1

const video = new Table({
  userId: user.fieldOptionSet.userId,
  user: new ProxyField({
    async get() {
      return await user.findOne()
    },
  }),
  /** 阅读量 */
  read: new Field({
    type: 'int',
  }),
  //* 封面
  cover: new Field({
    type: 'varchar',
  }),
})

user.test(async () => {
  const a = await user.findOne()
  const b = await user.update({})
})

video.test(async () => {
  const a = await video.findOne()
  // video.update()
})
