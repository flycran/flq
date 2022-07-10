import {
  Connection,
  createConnection,
  createPool,
  escape as $escape,
  Pool,
} from 'mysql2'
import { AsyncEvent } from './event'

import {
  ConnectOption,
  FieldOption,
  FlqOption,
  FromOption,
  GroupOption,
  LimitOption,
  ModelOption,
  OrderOption,
  SetOption,
  SubFieldOption,
  ValueOption,
  WhereOption,
} from './types'
/**sql模板 */
import * as templates from './templates'

/**安全处理 */
export function escape(value: any): string {
  if (value instanceof Sql) return value.sql
  return $escape(value)
}
/**格式化需要的正则表达式 */
const RGE = /^.+\(.*?\)$/

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
  if (n.includes('`'))
    throw new FlqError(`非法的字段名"${n}"，字段名不允许包含反引号"\`"`)
  return '`' + n + '`'
}

/**预处理字段名 */
export function field(field: Sql | string): string
export function field(from: string, field: string): string
export function field(p1: any, p2?: any): string {
  if (p1 instanceof Sql) return p1.sql
  if (p2) {
    return pf(p1) + '.' + pf(p2)
  }
  const fs = p1.split('.')
  if (fs.length > 1) return field(fs[0], fs[1])
  if (RGE.test(p1)) return p1
  return pf(p1)
}

/**防重名 */
const $field = field
/**sql解析方法 */
export namespace methods {
  const boolOpers = new Set(['AND', 'OR'])
  const compOpers = new Set([
    '>',
    '<',
    '=',
    '!=',
    '<=',
    '>=',
    '<>',
    'IS NULL',
    'IS NOT NULL',
    'BETWEEN',
    'LIKE',
    'IN',
    'NOT IN',
    'REGEXP',
  ])

  const noVal = new Set(['IS NULL', 'IS NOT NULL'])
  const arrVal = new Set(['IN', 'NOT IN'])

  /**处理字段,并建立字段映射 */
  function fieldM(this: Flq, field: string, as?: string, met?: string): string {
    const fs = field.split('.')
    let f, tb
    if (fs.length > 1) {
      f = pf(fs[0]) + '.' + pf(fs[1])
      tb = fs[0]
      field = fs[0]
    } else {
      f = pf(fs[0])
      tb = this.fieldMap.table[0]
      if (!tb)
        console.log(
          `Warning!Flq.field:建立字段映射时无法确定from的值,映射建立失败`
        )
    }
    if (met) {
      f = `${met.toUpperCase()}(${f})`
      if (!as) as = field
    }
    if (as) {
      f = f + ' as ' + escape(as)
    }
    this.fieldMap.field[tb + '.' + field] = as || field
    return f
  }

  export function from(this: Flq, ...option: FromOption[]): string {
    this.fieldMap.table.push(...option)
    //@ts-ignore
    return option
      .map((e) => {
        return $field(e)
      })
      .join(', ')
  }

  const polyMet = new Set(['AVG', 'COUNT', 'MAX', 'MIN', 'SUM'])

  export function field(
    this: Flq,
    option: FieldOption,
    met?: FieldOption.PolyMet
  ): string {
    if (typeof option === 'string')
      return fieldM.call(this, option, undefined, met)
    if (Array.isArray(option)) {
      return option.map((e) => field.call(this, e, met)).join(', ')
    }
    if (typeof option === 'object') {
      let r: any[] = []
      for (const key in option) {
        const e = option[key]
        if (polyMet.has(key)) {
          r.push(field.call(this, e, key as FieldOption.PolyMet))
        } else if (Array.isArray(e)) {
          //@ts-ignore
          r.push(fieldM.call(this, key, e[1], e[0]))
        } else {
          //@ts-ignore
          r.push(fieldM.call(this, key, e, met))
        }
      }
      return r.join(', ')
    }
    throw new FlqError(
      `methods.field: 不受支持的参数类型:${JSON.stringify(option)}`
    )
  }

  export function where(
    option: WhereOption,
    operator: WhereOption.Operator = 'AND',
    comparator: WhereOption.Comparator = '='
  ): string {
    if (option instanceof Sql) return option.sql
    if (Array.isArray(option)) {
      const ws = []
      for (let i = 0; i < option.length; i++) {
        const value = option[i]
        if (!(value instanceof Sql))
          throw new FlqError(
            `methods.where: 不受支持的参数类型:${JSON.stringify(option)}`
          )
        ws.push(value.sql)
      }
      return ws.join(` ${operator} `)
    }
    if (typeof option === 'object') {
      const ws = []
      for (const key in option) {
        let val: any = option[key]
        if (val === undefined) continue
        if (val instanceof Sql) {
          ws.push(val.sql)
          continue
        }
        let com = comparator
        if (typeof val === 'object') {
          if ('com' in val) com = val.com as WhereOption.Comparator
          if ('val' in val) val = val.val
        }
        // 键名是布尔运算符
        if (boolOpers.has(key)) {
          //@ts-ignore
          ws.push(`(${where(val, key)})`)
          continue
        }
        // 键名是比较运算符
        if (compOpers.has(key)) {
          //@ts-ignore
          ws.push(`(${where(val, operator, key)})`)
          continue
        }
        // 键名是字段名
        let pk = $field(key)
        // 操作符不需要传入
        if (noVal.has(com)) {
          ws.push(`${pk} ${com}`)
        }
        // 操作符要求传入数组
        if (arrVal.has(com)) {
          if (!Array.isArray(val))
            throw new FlqError(
              `methods.where: 不受支持的参数类型:${JSON.stringify(option)}`
            )
          ws.push(`${pk} ${com} (${val.map((e) => escape(e)).join(', ')})`)
        }
        // 操作符要求传入任意值
        ws.push(`${pk} ${com} ${escape(val)}`)
      }
      return ws.join(` ${operator} `)
    }
    throw new FlqError(
      `methods.where: 不受支持的参数类型:${JSON.stringify(option)}`
    )
  }

  const orderOp = new Set(['DESC', 'ASC', '1', '-1'])

  export function order(option: OrderOption, defOp?: OrderOption.Op): string {
    if (typeof option === 'string') {
      if (!defOp || defOp === 'ASC' || defOp == '1') return $field(option)
      return $field(option) + ' DESC'
    }
    if (Array.isArray(option)) {
      if (!defOp || defOp === 'ASC' || defOp == '1' || defOp === 1)
        return option.map((e) => $field(e)).join(', ')
      return option.map((e) => $field(e) + ' DESC').join(', ')
    }
    if (typeof option === 'object') {
      const arr = []
      for (const key in option) {
        //@ts-ignore
        const v = option[key]
        if (orderOp.has(key)) {
          //@ts-ignore
          arr.push(order(v, key as OrderOption.Op))
        } else if (v === 'ASC' || v === '1' || v === 1) arr.push($field(key))
        else arr.push($field(key) + ' DESC')
      }
      return arr.join(', ')
    }
    throw new FlqError(
      `methods.order: 不受支持的参数类型:${JSON.stringify(option)}`
    )
  }

  function pl(p: any) {
    const a = Number(p)
    if (isNaN(a) || a < 0)
      throw new FlqError(`limit: 不受支持的参数类型:${JSON.stringify(p)}`)
    return a
  }

  export function limit(option: LimitOption): number[] {
    const [lim, off] = option
    if (typeof lim === 'object') {
      return [pl((lim.page - 1) * lim.size), pl(lim.size)]
    }
    if (!off) {
      return [pl(lim)]
    }
    return [pl(lim), pl(off)]
  }

  export function group(option: GroupOption): string {
    return $field(option)
  }

  export function value(option: ValueOption): string {
    if (typeof option === 'object') {
      const ks: any[] = []
      const vs: any[] = []
      for (const k in option) {
        const v = option[k]
        ks.push($field(k))
        vs.push($field(escape(v)))
      }
      return `(${ks.join(', ')}) VALUES (${vs.join(', ')})`
    }
    throw new FlqError('methods.value: 不受支持的参数类型')
  }

  export function set(option: SetOption): string {
    if (typeof option === 'object') {
      const arr: any[] = []
      for (const k in option) {
        const v = option[k]
        arr.push(`${$field(k)} = ${escape(v)}`)
      }
      return arr.join(', ')
    }
    throw new FlqError('methods.set: 不受支持的参数类型')
  }

  export function subField(option: SubFieldOption[]): SubFieldOption.Obj {
    const obj: SubFieldOption.Obj = {}
    for (let i = 0; i < option.length; i++) {
      const e = option[i]
    }
    return obj
  }
}

async function format(e: string, v: any, flq: Flq) {
  switch (e) {
    case 'value':
      if (!v) throw new FlqError('Flq.format:缺少必选配置value')
      await hooks.emit('pretreat', { flq, row: v })
      return methods.value(v)
    case 'set':
      if (!v) throw new FlqError('Flq.format:缺少必选配置set')
      await hooks.emit('pretreat', { flq, row: v })
      return methods.set(v)
    case 'from':
      if (!v) throw new FlqError('Flq.format:缺少必选配置from')
      return v
    case 'field':
      if (!v) return '*'
      return v
    case 'where':
      if (!v) return
      return 'WHERE ' + v
    case 'order':
      if (!v) return
      return 'ORDER BY ' + v
    case 'limit':
      if (!v) return
      return 'LIMIT ' + v.join(', ')
    case 'group':
      if (!v) return
      return 'GROUP BY ' + v
    default:
      return v
  }
}

export class Sql {
  sql: string
  constructor(sql: string) {
    this.sql = sql
  }
  toString() {
    return this.sql
  }
}
/**sql语句 */
export function sql(sql: string) {
  return new Sql(sql)
}

/**插槽 */
export function slot(name: string) {
  return new Sql(`''${name}''}`)
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
  }

  /**sql参数 */
  option: FlqOption = {}
  /**字段映射 */
  fieldMap = {
    table: [] as string[],
    field: {} as Record<string, string>,
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

  /**测试 */
  async test(callBack: (this: Flq) => Promise<any>) {
    await callBack.call(this)
    await this.end()
  }

  /**获取连接 */
  getConnect(): Connection | Promise<Connection> {
    const { pool } = this
    return new Promise((e, r) => {
      if (pool) {
        pool.getConnection((err, ctn) => {
          if (err) return r(err)
          e(ctn)
        })
      } else if (this.connection) {
        e(this.connection)
      }
    })
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
  query(sql: string, connection?: Connection | Pool): Promise<any> {
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
   * @param template 格式方法
   * @returns sql语句
   */
  async format(template: string): Promise<string> {
    //@ts-ignore
    let rsql = templates[template]
    let sr = []
    let i = 0
    while (i < rsql.length) {
      const s = rsql.indexOf(' [', i)
      if (s === -1) break
      sr.push(rsql.slice(i, s))
      const e = rsql.indexOf(']', s + 1)
      const m = rsql.slice(s + 2, e)
      // @ts-ignore
      const v = await format(m, this.option[m], this)
      if (v) {
        sr.push(' ' + v)
      }
      i = e + 1
    }
    const sql = sr.join('')
    this.sql = sql
    hooks.emit('format', sql)
    return sql
  }

  /**
   * 发送sql语句, 并根据模型处理数据
   * @param template 格式方法
   * @returns 数据
   */
  async send(template: string): Promise<any> {
    const { option } = this
    //@ts-ignore
    const ctn: Connection = await this.getConnect()
    const sql = await this.format(template)
    const data: any = await this.query(sql, ctn)
    await hooks.emit('postreat', {
      flq: this,
      data,
      method: template,
      connect: ctn,
    })
    // 释放连接
    if (this.pool) {
      //@ts-ignore
      ctn.release()
    }
    hooks.emit('send', { data, method: template, option, sql })
    return data
  }

  /**克隆实例 */
  clone(): Flq {
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
    const sql = option.map((e) => methods.from.call(db, e)).join(', ')
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
    const sql = option.map((e) => methods.field.call(db, e)).join(', ')
    if (sp.field) {
      sp.field += ', ' + sql
    } else {
      sp.field = sql
    }
    return db
  }

  /**设置条件 */
  where(option: WhereOption, operator: WhereOption.Operator = 'AND') {
    const db = this.clone()
    const { option: sp } = db
    const sql = methods.where(option, operator)
    if (sp.where) {
      sp.where += ` ${operator} ` + sql
    } else {
      sp.where = sql
    }
    return db
  }

  /**插入 */
  insert(option: Record<string, any>) {
    if (!this.option.where) return
    for (const key in option) {
      const value = option[key]
      this.option.where = this.option.where.replace(`''${key}''`, escape(value))
    }
  }

  /**插入数据 */
  value(option: ValueOption) {
    const db = this.clone()
    const { option: sp } = db
    if (sp.value) {
      Object.assign(sp.value, option)
    } else {
      sp.value = option
    }
    return db
  }

  /**设置值 */
  set(option: SetOption) {
    const db = this.clone()
    const { option: sp } = db
    if (sp.set) {
      Object.assign(sp.set, option)
    } else {
      sp.set = option
    }
    return db
  }

  /**排序 */
  order(option: OrderOption, defOp?: OrderOption.Op) {
    const db = this.clone()
    const { option: sp } = db
    const sql = methods.order(option, defOp)
    if (sp.order) {
      sp.order += ', ' + sql
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
      sp.limit = [0, size]
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
      if (!limit || !limit[1])
        throw new FlqError('Flq.page: 必须先设置每页条数')
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
    } else {
      sp.virtualSet = Object.assign({}, ...option)
    }
    return db
  }

  /**子字段 */
  subField(...option: SubFieldOption[]) {
    const db = this.clone()
    const { option: sp } = db
    if (sp.subField) Object.assign(sp.subField, methods.subField(option))
    else sp.subField = Object.assign({}, methods.subField(option))
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
  async find(): Promise<Record<string, any>[]> {
    return await this.send('select')
  }

  /**查询第一个 */
  async first(): Promise<Record<string, any>> {
    const data = await this.send('select')
    return data[0]
  }

  /**插入 */
  async add() {
    return await this.send('insert')
  }

  /**插入 */
  async update() {
    return await this.send('update')
  }

  /**计数 */
  async count() {
    const data = await this.send('count')
    return Object.values(data[0])[0]
  }

  /**删除 */
  async del() {
    return await this.send('delete')
  }
}

// 绑定内置事件侦听器
import * as listeners from './listeners'

for (const key in listeners) {
  //@ts-ignore
  const event = listeners[key] as Record<string, Function>
  Object.values(event).forEach((e) => hooks.on(key, e))
}
