import { DbType, FieldOption, ProxyFieldOption } from './types'



export class Field<T extends DbType = DbType, G = unknown, S = unknown> {
  get?: FieldOption<T, G, S>['get']
  set?: FieldOption<T, G, S>['set']
  constructor(readonly option: FieldOption<T, G, S>) {
    this.get = option.get
    this.set = option.set
  }
}

export class ProxyField<G = unknown, S = unknown> {
  get?: ProxyFieldOption<G, S>['get']
  set?: ProxyFieldOption<G, S>['set']
  constructor(readonly option: ProxyFieldOption<G, S>) {
    this.get = option.get
    this.set = option.set
  }
}
