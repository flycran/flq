import { createConnection, createPool, Connection, Pool, escape as $escape } from 'mysql2'
import { AsyncEvent } from './event'
import {
  FlqOption,
  PromiseSet,
  ConnectOption,
  FromOption,
  WhereOption,
  FieldOption,
  OrderOption,
  LimitOption,
  GroupOption,
  ValueOption,
  SetOption,
  ModelOption,
  SubFieldOption,
  EventParam,
} from './types'
/**安全处理 */
export const escape = $escape
/**格式化需要的正则表达式 */
const FORMATREG = /\[(.+?)\]/g
const RGE = /^.+\(.*?\)$/
/**sql模板 */
import * as templates from './templates'
/**钩子 */
export const hooks = new AsyncEvent()
/**Flq抛出错误 */
export class FlqError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}
/**深拷贝 */
function deepClone<T>(target: T): T {
  const targetType = typeof target
  if (Array.isArray(target)) {
    //@ts-ignore
    return target.map((e) => deepClone(e))
  }
  if (targetType === 'object') {
    const result: any = {}
    for (let key in target) {
      const value = target[key]
      const valueType = typeof value
      if (valueType === 'object') {
        // @ts-ignore
        result[key] = deepClone(value)
      } else {
        // @ts-ignore
        result[key] = value
      }
    }
    return result
  }
  return target
}
function pf(n: string) {
  if (n.includes('`')) throw new FlqError(`非法的字段名"${n}"，字段名不允许包含反引号"\`"`)
  return '`' + n + '`'
}
/**预处理字段名 */
export function field(field: string): string
export function field(from: string, field: string): string
export function field(param: [string, string]): string
export function field(p1: string | [string, string], p2?: string): string {
  if (Array.isArray(p1)) return field(...p1)
  if (p2) {
    return pf(p1) + '.' + pf(p2)
  }
  if (RGE.test(p1)) return p1
  return pf(p1)
}
/**防重名 */
const $field = field
/**sql解析方法 */
namespace methods {
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
              `methods.field: "${op}"比较符仅支持数组,不受支持的参数类型:${JSON.stringify(
                option[2]
              )}`
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
}
/**Flq */
export class Flq {
  constructor(option: ConnectOption, model?: ModelOption) {
    if (!option) return
    if (option.pool) {
      //@ts-ignore
      this.pool = createPool(option)
    } else {
      //@ts-ignore
      this.connection = createConnection(option)
    }
    this.model = model
    setTimeout(() => {
      if (hooks.listener.has('test')) {
        hooks.emit('test', this).then(() => this.end())
      }
    }, 0)
  }
  /**sql参数 */
  option: FlqOption = {}
  /**字段映射 */
  fieldMap = {
    table: [] as string[],
    field: {} as Record<string, string[]>,
  }
  /**sql语句 */
  sql: string = ''
  /**模型 */
  model?: ModelOption
  /**连接 */
  connection?: Connection
  /**连接池 */
  pool?: Pool
  /**最后操作的条数 */
  total?: number
  /**获取连接 */
  getConnect(): Connection | Promise<Connection> {
    const { pool } = this
    if (pool) {
      return new Promise((e, r) => {
        pool.getConnection((err, ctn) => {
          if (err) return r(err)
          e(ctn)
        })
      })
    }
    //@ts-ignore
    return this.connection
  }
  /**结束连接 */
  end() {
    return new Promise((e, r) => {
      const callBack = (err: Error) => {
        if (err) return r(err)
      }
      //@ts-ignore
      this.pool ? this.pool.end(callBack) : this.connection?.end(callBack)
    })
  }
  /**查询 */
  query(sql: string, connection?: Connection | Pool): Promise<Record<string, any>[]> {
    return new Promise(async (e, r) => {
      if (!connection) connection = await this.getConnect()
      connection.query(sql, (err, data) => {
        if (err) return r(err)
        //@ts-ignore
        e(data)
      })
    })
  }
  /**
   * 格式化为sql语句
   * @param method 格式方法
   * @returns sql语句
   */
  format(method: string): string {
    //@ts-ignore
    let rsql = templates[method]
    const sql = rsql.replace(FORMATREG, (a: string, e: string) => {
      //@ts-ignore
      const v = this.option[e]
      switch (e) {
        case 'value':
          //@ts-ignore
          const k = Object.keys(v)
          //@ts-ignore
          const l = Object.values(v)
          return `(${k.join(', ')}) VALUES (${l.join(', ')})`
        case 'from':
          if (!v) throw new FlqError('Flq.format:from为必选参数')
          return v
        case 'field':
          if (!v) return '*'
          return v
        case 'where':
          if (!v) return ''
          return 'WHERE ' + v
        case 'order':
          if (!v) return ''
          return 'ORDER BY ' + v
        case 'limit':
          if (!v) return ''
          return 'LIMIT ' + v.join(', ')
        case 'group':
          if (!v) return ''
          return 'GROUP BY ' + v
        case 'value':
          if (!v) return ''
          return `(${Object.keys(v).join(', ')}) VALUES (${Object.values(', ')})`
        default:
          if (!v) return ''
          return v
      }
    })
    this.sql = sql
    hooks.emit('format', sql)
    return sql
  }
  /**
   * 发送sql语句, 并根据模型处理数据
   * @param method 格式方法
   * @returns 数据
   */
  async send(method: string) {
    const { option } = this
    //@ts-ignore
    const ctn: Connection = await this.getConnect()
    const sql = this.format(method)
    const data: any = await this.query(sql, ctn)
    await postreat({ flq: this, data, method, connect: ctn })
    // 释放连接
    if (this.pool) {
      //@ts-ignore
      ctn.release()
    }
    hooks.emit('send', { data, method, option, sql })
    return data
  }
  /**克隆实例 */
  clone() {
    // @ts-ignore
    const db = new Flq()
    db.option = deepClone(this.option)
    db.fieldMap = deepClone(this.fieldMap)
    db.model = this.model
    db.connection = this.connection
    db.pool = this.pool
    return db
  }
  /**设置表格 */
  from(...option: FromOption[]) {
    const db = this.clone()
    const { option: sp } = db
    db.fieldMap.table.push(...option)
    const sql = option.map((e) => methods.from(e)).join(', ')
    if (sp.from) {
      sp.from += ', ' + sql
    } else {
      sp.from = sql
    }
    return db
  }
  /**设置字段 */
  field(...option: FieldOption[]) {
    const db = this.clone()
    const { option: sp } = db
    const sql = option.map((e) => methods.field(e, db)).join(', ')
    if (sp.field) {
      sp.field += ', ' + sql
    } else {
      sp.field = sql
    }
    return db
  }
  /**设置条件 */
  where(...option: WhereOption[]) {
    const db = this.clone()
    const { option: sp } = db
    const sql = option.map((e) => methods.where(e)).join(' AND ')
    if (sp.where) {
      sp.where += ' AND ' + sql
    } else {
      sp.where = sql
    }
    return db
  }
  /**设置值 */
  set(option: SetOption) {
    const db = this.clone()
    const { option: sp } = db
    const sql = methods.set(option)
    if (sp.set) {
      sp.set += ', ' + sql
    } else {
      sp.set = sql
    }
    return db
  }
  /**排序 */
  order(option: OrderOption, defOp: OrderOption.Op) {
    const db = this.clone()
    const { option: sp } = db
    const sql = methods.order(option, defOp)
    if (sp.where) {
      sp.where += ', ' + sql
    } else {
      sp.order = sql
    }
    return db
  }
  /**分组 */
  group(option: GroupOption) {
    const db = this.clone()
    const { option: sp } = db
    sp.group = methods.group(option)
    return db
  }
  /**插入数据 */
  value(option: ValueOption) {
    const db = this.clone()
    const { option: sp } = db
    if (sp.value) {
      Object.assign(sp.value, methods.value(option))
    } else {
      sp.value = methods.value(option)
    }
    return db
  }
  /**分页 */
  limit(...option: LimitOption) {
    const db = this.clone()
    const { option: sp } = db
    sp.limit = methods.limit(option)
    return db
  }
  /**每页条数 */
  size(size: number) {
    const db = this.clone()
    const { option: sp } = db
    if (size > 0) {
      sp.limit = [, size]
      return db
    }
    throw new FlqError('Flq.page: 必须传入大于0的整数')
  }
  /**页码 */
  page(page: number) {
    const db = this.clone()
    const { option: sp } = db
    if (page > 0) {
      const { limit } = sp
      if (!limit || !limit[1]) throw new FlqError('Flq.page: 必须先设置每页条数')
      limit[0] = (page - 1) * limit[1]
      return db
    }
    throw new FlqError('Flq.page: 必须传入大于0的整数')
  }
  /**虚拟获取 */
  virtualGet(...option: string[]) {
    const db = this.clone()
    const { option: sp } = db
    if (sp.virtualGet) sp.virtualGet.push(...option)
    else sp.virtualGet = [...option]
    return db
  }
  /**虚拟插入 */
  virtualSet(...option: FlqOption['virtualSet'][]) {
    const db = this.clone()
    const { option: sp } = db
    if (sp.virtualSet) {
      Object.assign(sp.virtualSet, ...option)
      db.option.traversal = true
    } else {
      sp.virtualSet = Object.assign({}, ...option)
    }
    return db
  }
  /**子字段 */
  subField(...option: SubFieldOption[]) {
    const db = this.clone()
    const { option: sp } = db
    if (sp.subField) Object.assign(sp.subField, methods.subField(option, db))
    else sp.subField = Object.assign({}, methods.subField(option, db))
    return db
  }
  /**获取上一次查询的总列数 */
  foundRows() {
    const db = this.clone()
    const { option: sp } = db
    sp.foundRows = 'SQL_CALC_FOUND_ROWS'
    return db
  }
  /**获取最后一个插入的id */
  insertId() {
    const db = this.clone()
    const { option: sp } = db
    sp.insertId = true
    return db
  }
  /**查询 */
  async find() {
    return await this.send('select')
  }
  /**查询第一个 */
  async first() {
    const data = await this.send('select')
    return data[0]
  }
  /**插入 */
  async insert() {
    const data = await this.send('insert')
    return data
  }
  /**计数 */
  async count() {
    const data = await this.send('count')
    return Object.values(data[0])[0]
  }
}

/**预处理 */
export function pretreat(option: { flq: Flq; from: string; field: string; value: any }) {
  hooks.emit('pretreat', option)
  const { flq, from, field, value } = option
  const { model, fieldMap } = flq
}
/**后处理 */
export async function postreat(option: EventParam.PostreatEvent) {
  await hooks.emit('postreat', option)
  const { flq, data } = option
  const { traversal } = flq.option
  if (!Array.isArray(data)) return
  const { model: mod, fieldMap } = flq
  if (!mod) return
  // 模型映射关系
  const modMap: Map<string, string> = new Map()
  /**获取样本数据 */
  const ond = data[0]
  if (ond) {
    /**字段数组 */
    const fields = Object.keys(ond)
    fields.forEach((f) => {
      const map = fieldMap.field[f]
      if (!map) return
      const m1: any = mod[map[0]]
      if (!m1) return
      const m2 = m1[map[1]]
      if (m2) modMap.set(f, m2)
    })
  }

  // 映射表为空且没有强制遍历
  if (!modMap.size && !traversal) return
  const ps: PromiseSet = new Set()
  // 遍历数据
  data.forEach((row: any, index: number) => {
    ps.add(hooks.emit('rowPostreat', { flq, row }))
    // 遍历字段映射表
    modMap.forEach((model, key) => {
      const value = row[key]
      ps.add(hooks.emit('fieldPostreat', { flq, model, key, value, row }))
    })
  })
  await Promise.all(ps)
}

// 绑定内置事件侦听器
import * as listeners from './listeners'

for (const key in listeners) {
  //@ts-ignore
  const event = listeners[key] as Record<string, Function>
  Object.values(event).forEach((e) => hooks.on(key, e))
}
