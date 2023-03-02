import { Field, ProxyField, Table } from '../src'
import { DbType, DecFieldGet, DTCNT, FieldOption } from '../src/types'

class ListField<T extends DbType.String = DbType.String, G extends string[] = string[], S extends string[] = string[]> extends Field<DbType.String> {
  constructor(option: Omit<FieldOption<DbType.String>, 'get' | 'set'>) {
    super(Object.assign(option, {
      get: (value: string) => value ? value.split(',') : [],
      set: (value: string[]) => value.join(',')
    }))
  }
}

const name = new Field({
  type: 'varchar',
  get(value) {
    return value ? value.split(',') : []
  }
})

const user = new Table({
  name,
})

type N = typeof name

const c: DecFieldGet<typeof name> = ['']

type C = DecFieldGet<N>

class A<T = unknown> {

}

class B<T extends string[] = string[]> extends A<string[]> {

}

const a: A = new B()

const video = new Table({
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
