import { Sql } from './Sql'
import {
  DecFieldSet,
  FieldFilter,
  FieldOptionSet,
  FOSCNTSAF,
  TableOption,
  UpdateResult,
} from './types'

export class Table<
  //* 字段选项集合 FieldOptionSet
  FOS extends FieldOptionSet = FieldOptionSet,
  //* 字段重命名 FieldRename
  FF extends FieldFilter = { [K in keyof FOS]: true }
> {
  fieldFilter?: { [K in keyof FOS]?: true | string }

  constructor(readonly fieldOptionSet: FOS, readonly modelOption: TableOption = {}) {

  }

  clone(): Table<FOS, FF> {
    return new Table(this.fieldOptionSet, this.modelOption)
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

  update(data: { [K in keyof FOS]?: DecFieldSet<FOS[K]> | Sql }): Promise<UpdateResult>
  update() {
    return 0 as unknown as any
  }
}
