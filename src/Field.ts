import { DbType, FieldOption, Get, ProxyFieldOption } from './types'

interface Type<G extends Get<any>, S extends Set<any>> {

}

export class Field<T extends DbType = DbType, G extends Get<T> = Get<T>> {
  constructor(readonly option: FieldOption<T, G>) {
  }
}

new Field({
  type: 'varchar',
  get(value) {
    return value ? value.split(',') : []
  }
})

export class ProxyField {
  constructor(readonly option: ProxyFieldOption) {
  }
}
