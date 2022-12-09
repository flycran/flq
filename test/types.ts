// tiny small medium big

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

type WithLengthType = `${'char' | 'varchar' | 'text'}(${number})`

type Type = keyof BaseType | WithLengthType


interface Model<T extends Type = Type> {
  type: T
  create?: string
  table?: string
  join?: Model
  get?: (value: ToNodeType<T>) => any
  set?: (value: any) => ToNodeType<T>
  proxyGet?: (row: ToNodeType<T>) => any
  proxySet?: (row: any) => ToNodeType<T>
}

type ModelTypeRecord = {
  [x: string]: Type
}

type ModelRecord ={ [f: string]: Model }
type ToNodeType<T extends Type> = T extends keyof BaseType ? BaseType[T] : string
type ModelRecordNodeType<M extends ModelRecord> =
  {
    [F in keyof M]: ToNodeType<M[F]['type']>
  }

function defineTable(modelRecord: ModelRecord) {
  return new Table(modelRecord)
}

class Table<M extends ModelRecord, T = ModelRecordNodeType<M>> {
  readonly Type!: T

  constructor(public readonly modelRecord: M) {
  }

  field<T extends keyof M>(field: T): Model {
    return <any>0
  }

  fields<T extends keyof M>(...field: T[]): { [x in keyof M]: M[T] & {proxyGet: Function} } {
    return <any>0
  }

  find(): T {
    return <any>0
  }

  first(): T {
    return <any>0
  }
}

function fiedl<T extends Type>(m: Model<T>) {
  return m
}

const user = new Table({
  id: {
    type: 'int',
  },
  shopId: {
    type: 'int',
  },
})

const shop = new Table({
  id: {
    type: 'int',
  },
  name: {
    type: 'int',
  },
})
