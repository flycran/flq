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
export type DTCNT<T> =
  T extends DbType.Number ? number
    : T extends DbType.String ? string
      : T extends DbType.Boolean ? boolean | 0 | 1
        : T extends DbType.Date ? Date | number | string
          : never

export type Get<G = any, T = void> = (vaue: T, row: Record<string, DbType>) => Promise<G> | G
export type Set<S = any, T = void> = (value: S) => Promise<T> | T

//* 字段选项
export interface FieldOption<T = DbType, G = void, S = void> {
  type: T
  get?: Get<G, DTCNT<T>>
  set?: Set<S, DTCNT<T>>
}

export interface ProxyFieldOption<T = void, G = void, S = void> {
  get?: Get<T, G>
  set?: Set<T, G>
}

//* 键固定为string类型的键值对
type ValuePair<T> = { [x: string]: T }

//-----工具泛型-----//
//* 对象交集+重命名
export type PickRename<T extends {}, F extends { [K in keyof T]?: string | true }> = { [K in keyof T & keyof F as F[K] extends string ? F[K] : K]: T[K] }

//* 字段选项集合
export type FieldOptionSet = ValuePair<Field<any, any, any> | ProxyField<any, any, any>>

export type PromiseReturnType<T extends (...args: any) => any> = ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>

export type DecFieldType<T extends Field<any, any, any>> = DTCNT<T['option']['type']>
export type DecFieldGet<T extends Field<any, any, any> | ProxyField<any, any, any>> =
  T['get'] extends never ?
    never :
    Exclude<T['get'], void>

export type DecFieldSet<T extends Field<any, any, any> | ProxyField<any, any, any>> =
  T['set'] extends never ?
    never :
    Exclude<T['set'], void>

export type DecTableFieldSet<T> = T extends Table<infer A> ? A : never

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

export type GetRow<T extends Table> = FOSCNTS_F<DecTableFieldSet<T>>

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

