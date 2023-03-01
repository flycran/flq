import { DbType, FieldOption } from './types'

export class Field<T extends DbType> {
  constructor(option: FieldOption<T>) {

  }
}

export class ProxyField<G, S> {
  constructor(readonly get: () => any, readonly set: () => any) {
  }
}
