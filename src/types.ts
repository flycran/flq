import { Field, ProxyField } from './Field'
import { Table } from './Table'

export namespace DbType {
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
export type DTCNT<T extends DbType> =
  T extends DbType.Number ? number
    : T extends DbType.String ? string
      : T extends DbType.Boolean ? boolean | 0 | 1
        : T extends DbType.Date ? Date | number | string
          : never

export type Get<T extends DbType> = (vaue: DTCNT<T>, row: Record<string, DbType>) => | any
export type Set<T extends DbType> = (value: any) => Promise<DTCNT<T>> | DTCNT<T>

//* 字段选项
export interface FieldOption<T extends DbType = DbType, G extends Get<T> = Get<T>> {
  type: T
  get?: G
  // set?:
}

export interface ProxyFieldOption {
  get?: () => Promise<any> | any
  set?: (value: any) => Promise<void> | void
}

//* 键固定为string类型的键值对
type ValuePair<T> = { [x: string]: T }

//-----工具泛型-----//
//* 对象交集+重命名
export type PickRename<T extends {}, F extends { [K in keyof T]?: string | true }> = { [K in keyof T & keyof F as F[K] extends string ? F[K] : K]: T[K] }

//* 字段选项集合
export type FieldOptionSet = ValuePair<Field | ProxyField>

export type PromiseReturnType<T extends (...args: any) => any> = ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>

export type DecFieldType<T extends Field> = DTCNT<T['option']['type']>
export type DecFieldGet<T extends Field | ProxyField> =
  T['option']['get'] extends (...args: any) => any ?
    PromiseReturnType<T['option']['get']> :
    T extends Field ?
      DTCNT<T['option']['type']> :
      void

export type DecFieldSet<T extends Field | ProxyField> =
  T['option']['set'] extends (...args: any) => any ?
    PromiseReturnType<T['option']['set']> :
    T extends Field ?
      DTCNT<T['option']['type']> :
      void

//* 字段选项集合转Node类型(查询类型) field option set conversion node type set .find
export type FOSCNTS_F<T extends FieldOptionSet> = { [K in keyof T]: DecFieldGet<T[K]> }
//* 字段选项集合转Node类型(更新类型) field option set conversion node type set .update
export type FOSCNTS_U<T extends FieldOptionSet> = { [K in keyof T]: DecFieldSet<T[K]> }

//* 字段选项集合转Node类型并筛选(查询类型) field option set conversion node type set and filter
export type FOSCNTSAF<T extends FieldOptionSet, F extends { [K in string]: string | true }> = PickRename<FOSCNTS_F<T>, F>

//* 字段选项转字段联合类型 field option conversion field union type
export type FOCFUT<T extends FieldOptionSet> = keyof T

export interface TableOption {

}

export type FieldFilter = { [K in string]: string | true }

interface Context {

}

export interface SelectContext extends Context {
  row: { [x: string]: any }
  data: { [x: string]: any }[]
}

export interface InsertContext extends Context {
  data: InsertResult
}

export interface UpdateContext extends Context {
  data: UpdateResult
}

export type GetRow<T> = T extends Table<infer A> ? FOSCNTS_F<A> : unknown

