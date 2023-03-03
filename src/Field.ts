import {
  DbType,
  FieldOption,
  Get,
  Set,
  ProxyFieldOption,
  DTCNT,
} from './types'

export class Field<T extends DbType = DbType, G = DTCNT<T>, S = DTCNT<T>> {
  get?: G
  set?: S
  constructor(readonly option: FieldOption<T, G, S>) {

  }
}

export class ProxyField<T = void, G = never, S = never> {
  get?: G
  set?: S
  constructor(readonly option: ProxyFieldOption<T, G, S>) {
  }
}
