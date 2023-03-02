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
          : unknown

//* 字段选项
export interface FieldOption<T extends DbType = DbType, G = unknown, S = unknown> {
  default?: DTCNT<T> | (() => DTCNT<T>)
  type: T
  get?: (vaue: DTCNT<T>, row: Record<string, DbType>) => Promise<G> | G
  set?: (value: S) => Promise<DTCNT<T>> | DTCNT<T>
}

export interface ProxyFieldOption<G = unknown, S = unknown> {
  get?: () => Promise<G> | G
  set?: (value: S) => Promise<void> | void
}

//* 键固定为string类型的键值对
type ValuePair<T> = { [x: string]: T }

//-----工具泛型-----//
//* 对象交集+重命名
export type PickRename<T extends {}, F extends { [K in keyof T]?: string | true }> = { [K in keyof T & keyof F as F[K] extends string ? F[K] : K]: T[K] }

//* 字段选项集合
export type FieldOptionSet = ValuePair<Field | ProxyField>

export type PromiseReturnType<T extends (...args: any) => any> = ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>

//* 字段选项转Node类型(查询类型) field option conversion node type .find
export type FOCNT_F<T> = T extends { get: () => any } ? PromiseReturnType<T['get']> : T extends { type: DbType } ? DTCNT<T['type']> : unknown
//* 字段选项转Node类型(更新类型) field option conversion node type .update
export type FOCNT_U<T> = T extends { set: () => any } ? Parameters<T['set']>[0] : T extends { type: DbType } ? DTCNT<T['type']> : unknown

export type DecFieldType<T> = T extends Field<infer D, any, any> ? DTCNT<D> : unknown
export type DecFieldGet<T> = T extends ProxyField<infer A> ? A :
  T extends Field<any, infer D, any> ? D extends unknown ? DecFieldType<T> :
      D :
    unknown
export type DecFieldSet<T> = T extends ProxyField<any, infer A> ? A :
  T extends Field<any, any, infer D> ? D extends unknown ? DecFieldType<T> :
      D :
    unknown

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

