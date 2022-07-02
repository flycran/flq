import { FlqError, FromOption, WhereOption, FieldOption, field as pf, escape } from './index'

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

export function from(option: FromOption): string {
  //@ts-ignore
  if (typeof option === 'string') return pf(option)
  throw new FlqError(`methods.from: 不受支持的参数类型:${JSON.stringify(option)}`)
}
export function field(option: FieldOption): string {
  if (typeof option === 'string') return pf(option)
  let r: any[] = []
  if (Array.isArray(option)) {
    if (option.length < 2)
      throw new FlqError(`methods.field: 不受支持的参数类型:${JSON.stringify(option)}`)
    if (option.length === 2) {
      return pf(option[0]) + ' as ' + pf(option[1])
    } else {
      return pf(option[0]) + '.' + pf(option[1]) + ' as ' + pf(option[2])
    }
  }
  if (typeof option === 'object') {
    let r: any[] = []
    for (const key in option) {
      const e = option[key]
      let f: string
      if (typeof e === 'object') {
        //@ts-ignore
        f = e.from ? pf(e.from, key) : pf(key)
        if (e.met) f = `${e.met.toUpperCase()}(${f})`
        //@ts-ignore
        if (e.as) f = f + ' as ' + pf(e.as)
      } else {
        //@ts-ignore
        f = pf(key) + ' as ' + pf(e)
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
      return pf(option[0]) + ' = ' + escape(option[1])
    } else {
      let op = option[1]
      if (!compOpers.includes(op))
        throw new FlqError(`methods.field: 不受支持的比较运算符:"${option[1]}"`)
      if (op === 'between') {
        return `${pf(option[0])} BETWEEN ${escape(option[2])} AND ${escape(option[3])}`
      }
      if (op === 'in' || op === 'not in') {
        if (!Array.isArray(option[2]))
          throw new FlqError(
            `methods.field: "${op}"比较符仅支持数组,不受支持的参数类型:${JSON.stringify(option[2])}`
          )
        return `${pf(option[0])} ${op} (${option[2].map((e: any) => escape(e)).join(', ')})`
      }
      //@ts-ignore
      op = op.toUpperCase()
      return `${pf(option[0])} ${op} ${escape(option[2])}`
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
      let pk = pf(key)
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
export function order(param: any) {
  if (typeof param === 'string') return param
  if (param === undefined) return ''
  const sql = 'ORDER BY '
  const arr = []
  if (typeof param !== 'object') throw new FlqError('order 参数必须为对象')
  for (const key in param) {
    const val = param[key]
    arr.push(`\`${key}\`${typeof val === 'string' ? ' ' + val : ''}`)
  }
  return sql + arr.join(',')
}
export function limit(param: any) {
  if (typeof param === 'string') return param
  if (param === undefined) return ''
  if (typeof param === 'number') {
    if (param % 1 === 0 && param > 0) return `LIMIT ${param}`
    throw new FlqError('limit: 分页参数必须为正整数')
  }
  if (param instanceof Array) {
    const [lim, off] = param
    if (lim % 1 === 0 && off % 1 === 0 && lim > 0 && off && off > 0)
      return `LIMIT ${param[0]}, ${param[1]}`
    throw new FlqError('limit: 分页参数必须为正整数')
  }
  if (typeof param === 'object') {
    const { page = 1, size = 10 } = param
    if (page % 1 === 0 && size % 1 === 0 && page > 0 && size > 0) {
      return `LIMIT ${(page - 1) * size}, ${size}`
    }
    throw new FlqError('limit: 分页参数必须为正整数')
  }
  throw new FlqError('limit: 不受支持的参数类型')
}
export function value(param: any) {
  if (typeof param === 'string') return param
  if (param instanceof Array) {
    return `VALUES (${param.map((a) => escape(a)).join(', ')})`
  }
  if (typeof param === 'object') {
    const key = []
    const value = []
    for (const k in param) {
      key.push('`' + k + '`')
      value.push(escape(param[k]))
    }
    return `(${key.join(', ')}) VALUES (${value.join(', ')})`
  }
  throw new FlqError('value: 不受支持的参数类型')
}
export function set(param: any) {
  if (typeof param === 'string') return param
  if (typeof param === 'object') {
    const r: string[] = []
    for (const k in param) {
      const v = param[k]
      if (v === undefined) continue
      r.push(`\`${k}\` = ${escape(param[k])}`)
    }
    return r.join(', ')
  }
  throw new FlqError('set: 不受支持的参数类型')
}
