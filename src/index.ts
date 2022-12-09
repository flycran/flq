class Connect {

}

export type BaseType = {
  int: number
  tinyint: number
  smallint: number
  mediumint: number
  bigint: number
  float: number
  double: number
  real: number
  decimal: number
  numeric: number
  date: string
  time: string
  datetime: string
  year: string
  char: string
  varchar: string
  text: number
  enum: string
  blob: Buffer
  binary: Buffer
  set: any[]
}

export type WithLengthType = `${'char' | 'varchar' | 'text'}(${number})`

export type Type = keyof BaseType | WithLengthType

export interface Model<D extends DatabaseModel> {
  type: Type
  create?: string
  table?: string
  get?: (value: ToNodeType<Type>) => any
  set?: (value: any) => ToNodeType<Type>
  proxyGet?: (row: ToNodeType<Type>) => any
  proxySet?: (row: any) => ToNodeType<Type>
}

export interface JoinModel<D> {
  tab
}

// export type ModelTypeRecord = {
//   [x: string]: Type
// }

export type ModelRecord = { [f: string]: {type: Type} }
export type ToNodeType<T extends Type> = T extends keyof BaseType ? BaseType[T] : string
export type ModelRecordNodeType<M extends ModelRecord> =
  {
    [F in keyof M]: ToNodeType<M[F]['type']>
  };
export interface DatabaseModel {
  [t: string]: TableModel<this>
}

export interface TableModel<D extends DatabaseModel> {
  [f: string]: Model<D>
}

class Database<M extends DatabaseModel> {
  constructor() {
  }
}