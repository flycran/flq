namespace DbType {
  export type Number = 'int' | 'double'
  export type String = 'varchar' | 'text'
  export type Boolean = 'tinyint'
  export type Date = 'date' | 'time' | 'datetime'
}

export interface InsertResult {
  insertId: number
}

export interface UpdateResult {
  changedRows: number
}

//* 数据库类型
export type DbType = DbType.Number | DbType.String | DbType.Boolean | DbType.Date
//* 数据库类型转node类型
export type DTNT<T extends DbType> =
  T extends DbType.Number ? number
    : T extends DbType.String ? string
      : T extends DbType.Boolean ? boolean | 0 | 1
        : T extends DbType.Date ? Date | number | string
          : unknown

//* 字段选项
export type FieldOption<T extends DbType = DbType> = FieldOptionType & FieldOptionBase

interface FieldOptionBase {
  default?: DbType | (() => DbType)
}

interface FieldOptionType1 {
  type: DbType
  get?: <T = DbType, R = Record<string, DbType>>(vaue: T, row: R) => Promise<any> | any
  set?: <T = DbType>(value: any) => Promise<T> | T
}

interface FieldOptionType2 {
  get?: () => Promise<any> | any
  set?: (value: any) => Promise<void> | void
}

type FieldOptionType = FieldOptionType1 | FieldOptionType2


//-----工具泛型-----//
//* 对象交集+重命名
type PickRename<T extends {}, F extends { [K in keyof T]?: string | true }> = { [K in keyof T & keyof F as F[K] extends string ? F[K] : K]: T[K] }

//* 字段选项集合
type FieldOptionSet = Record<string, FieldOption>

type PromiseReturnType<T extends (...args: any) => any> = ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>

//* 字段选项转Node类型(查询类型) field option conversion node type .find
export type FOCNT_F<T extends FieldOption> = T extends { get: () => any } ? PromiseReturnType<T['get']> : T extends { type: DbType } ? DTNT<T['type']> : unknown
//* 字段选项转Node类型(更新类型) field option conversion node type .update
export type FOCNT_U<T extends FieldOption> = T extends { set: () => any } ? Parameters<T['set']>[0] : T extends { type: DbType } ? DTNT<T['type']> : unknown

//* 字段选项集合转Node类型(查询类型) field option set conversion node type set .find
export type FOSCNTS_F<T extends FieldOptionSet> = { [K in keyof T]: FOCNT_F<T[K]> }
//* 字段选项集合转Node类型(更新类型) field option set conversion node type set .update
export type FOSCNTS_U<T extends FieldOptionSet> = { [K in keyof T]: FOCNT_U<T[K]> }

//* 字段选项集合转Node类型并筛选(查询类型) field option set conversion node type set and filter
export type FOSCNTSAF<T extends FieldOptionSet, F extends { [K in string]: string | true }> = PickRename<FOSCNTS_F<T>, F>

//* 字段选项转字段联合类型 field option conversion field union type
export type FOCFUT<T extends FieldOptionSet> = keyof T

export interface TableOption {

}

function geKeys<T extends {}>(o: T) {
  return Object.keys(o) as (keyof T)[]
}

type FieldFilter = { [K in string]: string | true }

class Sql {

}

interface Context {

}

interface SelectContext extends Context {
  row: { [x: string]: any }
  data: { [x: string]: any }[]
}

interface InsertContext extends Context {
  data: InsertResult
}

interface UpdateContext extends Context {
  data: UpdateResult
}

export type GetRow<T extends Table> = T extends Table<infer A> ? FOSCNTS_F<A> : unknown

export class Table<
  //* 字段选项集合 FieldOptionSet
  FOS extends FieldOptionSet = FieldOptionSet,
  //* 字段重命名 FieldRename
  FF extends FieldFilter = { [K in keyof FOS]: true }
> {
  fieldFilter?: { [K in keyof FOS]?: true | string }

  constructor(readonly fieldOptionSet: FOS, readonly modelOption: TableOption = {}) {

  }

  end() {

  }

  async test(a: () => any) {
    await a()
    this.end()
  }

  field<T extends keyof FOS>(field: T[]): Table<FOS, { [K in T]: true }>
  field(field: (keyof FOS)[]): unknown {
    if(!this.fieldFilter) this.fieldFilter = {}
    let o: { [K in keyof FOS]?: true } = {}
    field.forEach(e => {
      this.fieldFilter![e] = true
    })
    return this
  }

  exclField<T extends keyof FOS>(field: T): Table<FOS, { [K in Exclude<keyof FOS, T>]: true }>
  exclField(field: unknown): unknown {
    return this
  }

  rename<T extends { [K in keyof FOS]?: string }>(field: T): Table<FOS, FF & T>
  rename(field: unknown) {
    return this as any
  }

  findOne(): Promise<FOSCNTSAF<FOS, FF>>
  findOne() {
    return 0 as unknown as any
  }

  findAll(): Promise<FOSCNTSAF<FOS, FF>[]>
  findAll() {
    return 0 as unknown as any
  }

  update(data: { [K in keyof FOS]?: FOCNT_U<FOS[K]> | Sql }): Promise<any>
  update() {
    return 0 as unknown as any
  }
}

const user = new Table({
  //* 用户id
  userId: {
    type: 'varchar',
  },
  //* 用户名
  // name: {
  //   type: 'varchar',
  //   get(value) {
  //
  //   }
  // },
  // pass: {
  //   type: 'varchar',
  // },
})

const video = new Table({
  userId: user.fieldOptionSet.userId,
  user: {
    async get() {
      return await user.findOne()
    },
  },
  /** 阅读量 */
  read: {
    type: 'int',
  },
  //* 封面
  cover: {
    type: 'varchar',
  },
})

user.test(async () => {
  const a = await user.findOne()
  const b = await user.update({})
})

video.test(async () => {
  const a = await video.findOne()
  // video.update()
})









