import { Flq, FlqError, field as $field, escape } from './index'

import {
  FromOption,
  WhereOption,
  FieldOption,
  OrderOption,
  LimitOption,
  GroupOption,
  ValueOption,
  SetOption,
  SubFieldOption,
} from './types'

const boolOpers: WhereOption.Op[] = ['AND', 'OR']
const compOpers: WhereOption.Com[] = [
  '>',
  '<',
  '=',
  '!=',
  '<=',
  '>=',
  '<>',
  'is null',
  'is not null',
  'between',
  'like',
  'in',
  'not in',
  'regexp',
]
/**处理字段,并建立字段映射 */
function pf(
  { from, field, as, met }: { from?: string | void; field: string; as?: string; met?: string },
  flq: Flq
) {
  /**最后返回的字段，默认不影响映射建立 */
  let f: string
  f = from ? $field(from, field) : $field(field)
  if (met) {
    // 如果存在聚合方法，则影响映射建立
    f = `${met.toUpperCase()}(${field})`
    field = f
  }
  // 存在则重命名
  //@ts-ignore
  if (as) f = field + ' as ' + $field(as)
  if (from) {
    if (as) flq.fieldMap.field[as] = [from, field]
    else flq.fieldMap.field[field] = [from, field]
  } else {
    if (flq.fieldMap.table.length === 0) {
      console.log(`Warning!Flq.field:建立字段映射时from没有确定的值,映射建立失败`)
    } else {
      from = flq.fieldMap.table[0]
      if (as) flq.fieldMap.field[as] = [from, field]
      else flq.fieldMap.field[field] = [from, field]
    }
  }
  return f
}

export function from(option: FromOption): string {
  //@ts-ignore
  if (typeof option === 'string') return $field(option)
  throw new FlqError(`methods.from: 不受支持的参数类型:${JSON.stringify(option)}`)
}

export function field(option: FieldOption, flq: Flq): string {
  if (typeof option === 'string') return pf({ field: option }, flq)
  let r: any[] = []
  if (Array.isArray(option)) {
    if (option.length < 2)
      throw new FlqError(`methods.field: 不受支持的参数类型:${JSON.stringify(option)}`)
    if (option.length === 2) {
      return pf({ field: option[0], as: option[1] }, flq)
    } else {
      return pf({ from: option[0], field: option[1], as: option[2] }, flq)
    }
  }
  if (typeof option === 'object') {
    let r: any[] = []
    for (const key in option) {
      const e = option[key]
      let f: string
      if (typeof e === 'object') {
        f = pf({ ...e, field: key }, flq)
      } else {
        //@ts-ignore
        f = pf({ field: key, as: e }, flq)
      }
      r.push(f)
    }
    return r.join(', ')
  }
  throw new FlqError(`methods.field: 不受支持的参数类型:${JSON.stringify(option)}`)
}

export function where(option: WhereOption, op: WhereOption.Op = 'AND'): string {
  if (typeof option === 'string') return option
  if (Array.isArray(option)) {
    if (option.length < 2)
      throw new FlqError(`methods.field: 不受支持的参数类型:${JSON.stringify(option)}`)
    if (option.length === 2) {
      return $field(option[0]) + ' = ' + escape(option[1])
    } else {
      let op = option[1]
      if (!compOpers.includes(op))
        throw new FlqError(`methods.field: 不受支持的比较运算符:"${option[1]}"`)
      if (op === 'between') {
        return `${$field(option[0])} BETWEEN ${escape(option[2])} AND ${escape(option[3])}`
      }
      if (op === 'in' || op === 'not in') {
        if (!Array.isArray(option[2]))
          throw new FlqError(
            `methods.field: "${op}"比较符仅支持数组,不受支持的参数类型:${JSON.stringify(option[2])}`
          )
        return `${$field(option[0])} ${op} (${option[2].map((e: any) => escape(e)).join(', ')})`
      }
      //@ts-ignore
      op = op.toUpperCase()
      return `${$field(option[0])} ${op} ${escape(option[2])}`
    }
  }
  if (typeof option === 'object') {
    const ws = []
    for (const key in option) {
      //@ts-ignore
      const value = option[key]
      if (value === undefined) continue
      //@ts-ignore
      if (boolOpers.includes(key)) {
        //@ts-ignore
        ws.push(`(${where(value, key)})`)
        continue
      }
      let pk = $field(key)
      if (value instanceof Array) {
        ws.push(`${pk} IN (${value.map((e) => escape(e)).join(', ')})`)
        continue
      }
      ws.push(`${pk} = ${escape(value)}`)
    }
    return ws.join(' ' + op + ' ')
  }
  throw new FlqError(`methods.where: 不受支持的参数类型:${JSON.stringify(option)}`)
}

export function order(option: OrderOption, defOp?: OrderOption.Op) {
  if (typeof option === 'string') {
    if (!defOp || defOp === 'ACS' || defOp === 1) return $field(option)
    return $field(option) + ' DESC'
  }
  if (Array.isArray(option)) {
    if (!defOp || defOp === 'ACS' || defOp === 1) return option.map((e) => $field(e)).join(', ')
    return option.map((e) => $field(e) + ' DESC').join(', ')
  }
  if (typeof option === 'object') {
    const arr = []
    for (const key in option) {
      //@ts-ignore
      const op = option[key]
      if (op === 'ACS' || op === 1) arr.push($field(key))
      else arr.push($field(key) + ' DESC')
    }
    return arr.join(', ')
  }
  throw new FlqError(`methods.order: 不受支持的参数类型:${JSON.stringify(option)}`)
}

export function limit(option: LimitOption): number[] {
  if (option instanceof Array) {
    const [lim, off] = option
    if (typeof lim === 'object') {
      return [(lim.page - 1) * lim.size, lim.size]
    }
    if (lim > 0 && !off) {
      return [lim]
    }
    if (!off) throw new FlqError(`limit: 不受支持的参数类型:${JSON.stringify(option)}`)
    if (lim > 0 && off > 1) {
      return [lim, off]
    }
    throw new FlqError(`limit: 不受支持的参数类型:${JSON.stringify(option)}`)
  }
  throw new FlqError(`limit: 不受支持的参数类型:${JSON.stringify(option)}`)
}

export function group(option: GroupOption): string {
  return $field(option)
}

export function value(option: ValueOption): ValueOption {
  if (typeof option === 'object') {
    const obj: any = {}
    for (const k in option) {
      let v = option[k]
      if (Array.isArray(v)) v = v.join(',')
      obj[$field(k)] = escape(v)
    }
    return obj
  }
  throw new FlqError('value: 不受支持的参数类型')
}

export function set(option: SetOption): string {
  if (typeof option === 'object') {
    const arr: any = []
    for (const k in option) {
      let v = option[k]
      if (Array.isArray(v)) v = v.join(',')
      arr.push(`${$field(k)} = ${escape(v)}`)
    }
    return arr.join(', ')
  }
  throw new FlqError('set: 不受支持的参数类型')
}

export function subField(option: SubFieldOption[], flq: Flq): SubFieldOption.Obj {
  const obj: SubFieldOption.Obj = {}
  for (let i = 0; i < option.length; i++) {
    const e = option[i]

  }
  return obj
}
