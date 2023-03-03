import { Field, ProxyField, Table } from '../src'
import {
  DbType,
  DecFieldGet, DecTableFieldSet,
  FieldOption,
  GetRow,
} from '../src/types'

class ListField extends Field<DbType.String, string[], string[]> {
  constructor(option: Omit<FieldOption<DbType.String>, 'get' | 'set'>) {
    super({
      ...option,
      get: (value: string) => value ? value.split(',') : [],
      set: (value: string[]) => value.join(','),
    })
  }
}

// interface subTableFieldOption<G = void, S = void> extends ProxyFieldOption<G, S> {
//   table:
// }

class subTableField<T extends Table, F extends DecTableFieldSet<T>, G = never, S = never> extends ProxyField<GetRow<T>, G, S> {
}

const pf = new ProxyField({
  get() {
    return ''
  },
})

const f = new Field({
  type: 'int',
  get() {
    return ''
  },
})

type A = DecFieldGet<typeof pf>

const user = new Table({
  userId: new  Field({
    type: 'int'
  }),
  name: new ListField({
    type: 'varchar'
  }),
})

user.test(async () => {
  const a = await user.findOne()
  a.userId
  const b = await user.update({})
})


const video = new Table({
  user: new ProxyField({
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

video.test(async () => {
  const a = await video.findOne()
  a.user.name
  a.cover
  // video.update()
})
