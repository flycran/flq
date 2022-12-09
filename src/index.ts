import { Connection, createConnection, createPool, escape as $escape, Pool } from 'mysql2'
import { AsyncErgodic, AsyncEvent } from './event'
import './model'
import { Option, use } from './model'
/**sql模板 */
import * as templates from './templates'
import { foundRows } from './templates'

import {
  CallOption,
  ConnectOption,
  Data,
  Dbany,
  FieldOption,
  FlqOption,
  FromOption,
  GroupOption,
  HooksEvent,
  LimitOption,
  ModelData,
  ModelOption,
  OrderOption,
  RecursionOption,
  SetOption,
  ValueOption,
  VirtualGet,
  VirtualSet,
  WhereOption,
} from './types'

const uppers = new Set('QWERTYUIOPASDFGHJKLZXCVBNM')

export function toHump(key: string) {
  let s = ''
  for(let i = 0; i < key.length; i++) {
    const e = key[i]
    if(e === '-') {
      s += key[i + 1].toUpperCase()
      i++
    } else {
      s += e
    }
  }
  return s
}

export function toBar(key: string) {
  let s = ''
  for(let i = 0; i < key.length; i++) {
    const e = key[i]
    if(uppers.has(e)) {
      s += '-' + e.toLowerCase()
    } else {
      s += e
    }
  }
  return s
}

/**安全处理 */
export function escape(value: any): Sql {
  if(value instanceof Sql) return value
  return new Sql($escape(value))
}

/**格式化要的正则表达式 */
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
  if(Array.isArray(target)) {
    //@ts-ignore
    return target.map((e) => deepClone(e))
  }
  if(targetType === 'object') {
    const result: any = {}
    for(let key in target) {
      const value = target[key]
      const valueType = typeof value
      if(valueType === 'object') {
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
  if(n.includes('`'))
    throw new FlqError(`非法的字段名"${ n }"，字段名不允许包含反引号"\`"`)
  if(n.includes("''"))
    throw new FlqError(`非法的字段名"${ n }"，字段名不允许包含连续单引号"''"`)
  return '`' + n + '`'
}

/**预处理字段名 */
export function field(field: Sql | string): Sql
export function field(from: string, field: string): Sql
export function field(p1: any, p2?: any): Sql {
  if(p1 instanceof Sql) return p1
  if(p2) {
    return new Sql(pf(p1) + '.' + pf(p2))
  }
  const fs = p1.split('.')
  if(fs.length > 1) return field(fs[0], fs[1])
  if(RGE.test(p1)) return p1
  return new Sql(pf(p1))
}

/**防重名 */
const $field = field
/**sql解析方法 */
export namespace methods {
  const boolOpers = new Set([ 'AND', 'OR' ])
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

  export const noVal = new Set([ 'IS NULL', 'IS NOT NULL' ])
  export const arrVal = new Set([ 'IN', 'NOT IN' ])

  /**处理字段 */
  function fieldM(this: Flq, field: string, as?: string, met?: string): string {
    const fs = field.split('.')
    let f
    if(fs.length > 1) {
      f = pf(fs[0]) + '.' + pf(fs[1])
      field = fs[0]
    } else {
      f = pf(fs[0])
    }
    if(met) {
      f = `${ met.toUpperCase() }(${ f })`
      if(!as) as = field
    }
    if(as) {
      f = f + ' as ' + escape(as)
    }
    return f
  }

  export const polyMet = new Set([ 'AVG', 'COUNT', 'MAX', 'MIN', 'SUM' ])

  export function field(
    this: Flq,
    option: FieldOption,
    met?: FieldOption.PolyMet,
  ): string {
    if(option instanceof Sql) return option.sql
    if(typeof option === 'string')
      return fieldM.call(this, option, undefined, met)
    if(Array.isArray(option)) {
      return option.map((e) => field.call(this, e, met)).join(', ')
    }
    if(typeof option === 'object') {
      let r: any[] = []
      for(const key in option) {
        const e = option[key]
        if(polyMet.has(key)) {
          r.push(field.call(this, e, key as FieldOption.PolyMet))
        } else if(Array.isArray(e)) {
          r.push(fieldM.call(this, key, e[1], e[0]))
        } else {
          r.push(fieldM.call(this, key, e, met))
        }
      }
      return r.join(', ')
    }
    throw new FlqError(
      `methods.field: 不受支持的参数类型:${ JSON.stringify(option) }`,
    )
  }

  export function where(
    option: WhereOption,
    connector: WhereOption.Connector = 'AND',
    comparator: WhereOption.Comparator = '=',
  ): string {
    if(option instanceof Sql) return option.sql
    if(Array.isArray(option)) {
      const ws = []
      for(let i = 0; i < option.length; i++) {
        const value = option[i]
        if(value instanceof Sql) ws.push(value.sql)
        else ws.push(where(value, connector, comparator))
      }
      return ws.join(` ${ connector } `)
    }
    if(typeof option === 'object') {
      const ws = []
      for(const key in option) {
        let val: any = option[key]
        if(val === undefined) continue
        let com = comparator
        if(typeof val === 'object') {
          if('com' in val) com = val.com as WhereOption.Comparator
          if('val' in val) val = val.val
        }
        // 键名是布尔运算符
        if(boolOpers.has(key)) {
          //@ts-ignore
          ws.push(`(${ where(val, key) })`)
          continue
        }
        // 键名是比较运算符
        if(compOpers.has(key)) {
          //@ts-ignore
          ws.push(`(${ where(val, connector, key) })`)
          continue
        }
        // 键名是字段名
        let pk = $field(key)
        // 操作符不需要传入
        if(noVal.has(com)) {
          ws.push(`${ pk } ${ com }`)
          continue
        }
        // 操作符要求传入数组
        if(arrVal.has(com)) {
          if(!Array.isArray(val))
            throw new FlqError(
              `methods.where: 不受支持的参数类型:${ JSON.stringify(option) }`,
            )
          ws.push(`${ pk } ${ com } (${ val.map((e) => escape(e)).join(', ') })`)
          continue
        }
        // 操作符是BETWEEN
        if(com === 'BETWEEN') {
          if(!Array.isArray(val))
            throw new FlqError(
              `methods.where: 不受支持的参数类型:${ JSON.stringify(option) }`,
            )
          ws.push(`${ pk } ${ com } ${ escape(val[0]) } AND ${ escape(val[1]) }`)
          continue
        }
        // 操作符要求传入任意值
        ws.push(`${ pk } ${ com } ${ escape(val) }`)
      }
      return ws.join(` ${ connector } `)
    }
    throw new FlqError(
      `methods.where: 不受支持的参数类型:${ JSON.stringify(option) }`,
    )
  }

  const orderOp = new Set([ 'DESC', 'ASC', '1', '-1' ])

  export function order(option: OrderOption, defOp?: OrderOption.Op): string {
    if(typeof option === 'string') {
      if(!defOp || defOp === 'ASC' || defOp == '1') return $field(option).sql
      return $field(option) + ' DESC'
    }
    if(Array.isArray(option)) {
      if(!defOp || defOp === 'ASC' || defOp == '1' || defOp === 1)
        return option.map((e) => $field(e)).join(', ')
      return option.map((e) => $field(e) + ' DESC').join(', ')
    }
    if(typeof option === 'object') {
      const arr = []
      for(const key in option) {
        //@ts-ignore
        const v = option[key]
        if(orderOp.has(key)) {
          //@ts-ignore
          arr.push(order(v, key as OrderOption.Op))
        } else if(v === 'ASC' || v === '1' || v === 1) arr.push($field(key))
        else arr.push($field(key) + ' DESC')
      }
      return arr.join(', ')
    }
    throw new FlqError(
      `methods.order: 不受支持的参数类型:${ JSON.stringify(option) }`,
    )
  }

  function pl(p: any) {
    const a = Number(p)
    if(isNaN(a) || a < 0)
      throw new FlqError(`limit: 不受支持的参数类型:${ JSON.stringify(p) }`)
    return a
  }

  export function limit(option: LimitOption): number[] {
    const [ lim, off ] = option
    if(typeof lim === 'object') {
      return [ pl((lim.page - 1) * lim.size), pl(lim.size) ]
    }
    if(!off) {
      return [ pl(lim) ]
    }
    return [ pl(lim), pl(off) ]
  }

  export function group(option: GroupOption): string {
    return $field(option).sql
  }

  export function value(option: ValueOption): string {
    if(typeof option === 'object') {
      const ks: any[] = []
      const vs: any[] = []
      for(const k in option) {
        const v = option[k]
        ks.push($field(k))
        vs.push(escape(v))
      }
      return `(${ ks.join(', ') }) VALUES (${ vs.join(', ') })`
    }
    throw new FlqError('methods.value: 不受支持的参数类型')
  }

  export function set(option: SetOption): string {
    if(typeof option === 'object') {
      const arr: any[] = []
      for(const k in option) {
        const v = option[k]
        if(v instanceof Sql) {
          arr.push(`${ $field(k) } = ${ v }`)
        } else {
          arr.push(`${ $field(k) } = ${ escape(v) }`)
        }
      }
      return arr.join(', ')
    }
    throw new FlqError('methods.set: 不受支持的参数类型')
  }
}

function format(e: string, v: any) {
  switch(e) {
    case 'value':
      return methods.value(v)
    case 'set':
      return methods.set(v)
    case 'from':
      if(!v) throw new FlqError('Flq.format:缺少必选配置from')
      return v
    case 'field':
      if(!v) return '*'
      return v
    case 'where':
      if(!v) return
      return 'WHERE ' + v
    case 'order':
      if(!v) return
      return 'ORDER BY ' + v
    case 'limit':
      if(!v) return
      return 'LIMIT ' + v.join(', ')
    case 'group':
      if(!v) return
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
  return new Sql(`''${ name }''`)
}

/**递归查询方法 */
function getKeys(data: Record<string, any>[], key: string) {
  const nr = new Set<number>()
  for(let i = 0; i < data.length; i++) {
    nr.add(data[i][key])
  }
  return Array.from(nr)
}

/**向下递归+层级 */
async function callDown0(data: Data[], option: CallOption) {
  const { flq, parentField, childField, mainKey, stop } = option
  for(let i = 0; i < data.length; i++) {
    const e = data[i]
    const res = await flq.mainKey(e[mainKey], parentField).find()
    if(res.length === 0) return data
    e[childField] = await callDown0(res, option)
    if(stop !== undefined && stop(res)) return data
  }
  return data
}

/**向上递归+层级 */
async function callUp0(data: Data[], option: CallOption): Promise<Data[]> {
  if(data.length === 0) return data
  const { flq, childField, parentField, stop } = option
  const nr = []
  const map = new Map<number, Data>()
  for(let i = 0; i < data.length; i++) {
    const e = data[i]
    const pid = e[parentField]
    const rs = map.get(pid)
    if(rs) {
      rs.push(e)
    } else {
      const cs: Data[] = [ e ]
      const res = await flq.mainKey(pid).first()
      if(!res) return data
      res[childField] = cs
      map.set(pid, cs)
      nr.push(res)
    }
  }
  if(stop !== undefined && stop(nr)) return nr
  return callUp0(nr, option)
}

/**向下递归+扁平 */
async function callDown1(data: Data[], option: CallOption): Promise<Data[]> {
  if(data.length === 0) return data
  const { flq, mainKey, parentField, stop } = option
  let ids = getKeys(data, mainKey)
  while(ids.length) {
    const res = await flq.mainKey(ids, parentField).find()
    if(res.length === 0) return data
    data.push(...res)
    if(stop !== undefined && stop(res)) return data
    ids = getKeys(res, mainKey)
  }
  return data
}

/**向上递归+扁平 */
async function callUp1(data: Data[], option: CallOption): Promise<Data[]> {
  if(data.length === 0) return data
  const { flq, parentField, stop } = option
  let ids = getKeys(data, parentField)
  while(true) {
    const res = await flq.mainKey(ids).find()
    if(res.length === 0) return data
    data.push(...res)
    if(stop !== undefined && stop(res)) return data
    ids = getKeys(res, parentField)
  }
}

/**Flq */
export class Flq {
  /**sql参数 */
  option: FlqOption = {
    set: {},
    value: {},
  }
  /**sql语句 */
  sql: string = ''
  /**模型 */
  model?: ModelOption
  /**模型数据 */
  modelData?: ModelData
  /**连接 */
  connection?: Connection
  /**连接池 */
  pool?: Pool
  /**最后操作的条数 */
  total?: number
  /**查询类型 */
  type?: 'select' | 'insert' | 'update' | 'remove' | 'list'
  /**插槽 */
  slot?: Record<string, any>

  constructor(option: ConnectOption) {
    if(!option) return
    if(option.pool) {
      //@ts-ignore
      this.pool = createPool(option)
    } else {
      //@ts-ignore
      this.connection = createConnection(option)
    }
  }

  /**插件 */
  static use<T extends keyof ModelOption.Model>(name: T, option: Option<T>) {
    use(name, option)
  }

  setModel(model: ModelOption) {
    const md: ModelData = {}
    this.modelData = md
    for(const key in model) {
      const mod = model[key]
      const mp: Partial<ModelData.Data> = {}
      md[key] = mp
      for(const key in mod) {
        const op = mod[key]
        if(op.indexField) {
          mp.indexField = key
        } else if(op.parentField) {
          mp.parentField = key
        } else if(op.gradeField) {
          mp.gradeField = key
        } else if(op.mainKey) {
          mp.mainKey = key
        } else if(op.childField) {
          mp.childField = key
        }
      }
    }
    this.model = model
  }

  /**测试 */
  async test(callBack: (this: Flq) => Promise<any>) {
    const b = await callBack.call(this)
    if(b !== false)
      await this.end()
  }

  /**获取连接 */
  getConnect(): Connection | Promise<Connection> {
    const { pool } = this
    return new Promise((e, r) => {
      if(pool) {
        pool.getConnection((err, ctn) => {
          if(err) return r(err)
          e(ctn)
        })
      } else if(this.connection) {
        e(this.connection)
      }
    })
  }

  /**结束连接 */
  end() {
    return new Promise((e, r) => {
      const callBack = (err: Error) => {
        if(err) return r(err)
      }
      //@ts-ignore
      this.pool ? this.pool.end(callBack) : this.connection?.end(callBack)
    })
  }

  /**查询 */
  query(sql: string, connection?: Connection | Pool): Promise<any> {
    return new Promise(async (e, r) => {
      if(!connection) connection = await this.getConnect()
      connection.query(sql, (err, data) => {
        if(err) return r(err)
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
  format(template: string): string {
    const { slot, option } = this
    if(slot && option.where) {
      for(const key in slot) {
        const value = slot[key]
        option.where = option.where.replace(
          new RegExp(`''${key}''`, 'g'),
          escape(value).sql,
        )
      }
    }
    //@ts-ignore
    let rsql = templates[template]
    let sr = []
    let i = 0
    while(i < rsql.length) {
      const s = rsql.indexOf(' [', i)
      if(s === -1) break
      sr.push(rsql.slice(i, s))
      const e = rsql.indexOf(']', s + 1)
      const m = rsql.slice(s + 2, e)
      // @ts-ignore
      const v = format(m, this.option[m])
      if(v) {
        sr.push(' ' + v)
      }
      i = e + 1
    }
    const sql = sr.join('')
    this.sql = sql
    hooks.emit('format', sql).then()
    return sql
  }

  /**
   * 发送sql语句, 并根据模型处理数据
   * @param template 格式方法
   * @returns 数据
   */
  async send(template: string): Promise<any> {
    if(this.type === 'insert')
      await hooks.emit('pretreat', { flq: this, row: this.option.value })
    if(this.type === 'update')
      await hooks.emit('pretreat', { flq: this, row: this.option.set })
    const { option } = this
    //@ts-ignore
    const ctn: Connection = await this.getConnect()
    const sql = this.format(template)
    const data: any = await this.query(sql, ctn)
    await hooks.emit('postreat', {
      flq: this,
      data,
      method: template,
      connect: ctn,
    })
    // 释放连接
    if(this.pool) {
      //@ts-ignore
      ctn.release()
    }
    hooks.emit('send', { data, method: template, option, sql }).then()
    return data
  }

  /**克隆实例 */
  clone(): Flq {
    // @ts-ignore
    const db = new Flq()
    db.option = deepClone(this.option)
    db.model = this.model
    db.modelData = this.modelData
    db.connection = this.connection
    db.pool = this.pool
    return db
  }

  /**插入（插槽） */
  insert(slot: Record<string, any>) {
    const db = this.clone()
    db.slot = slot
    return db
  }

  /**设置表格 */
  from(...option: FromOption[]) {
    const db = this.clone()
    const { option: sp } = db

    if(sp.from) {
      sp.from.push(...option)
    } else {
      sp.from = option
    }
    return db
  }

  /**设置字段 */
  field(...option: FieldOption[]) {
    const db = this.clone()
    const { option: sp } = db
    const sql = option.map((e) => methods.field.call(db, e)).join(', ')
    if(sp.field) {
      sp.field += ', ' + sql
    } else {
      sp.field = sql
    }
    return db
  }

  /**设置条件 */
  where(
    option: WhereOption,
    connector: WhereOption.Connector = 'AND',
    comparator: WhereOption.Comparator = '=',
  ) {
    const db = this.clone()
    const { option: sp } = db
    const sql = methods.where(option, connector, comparator)
    if(sp.where) {
      sp.where += ` ${ connector } ` + sql
    } else {
      sp.where = sql
    }
    return db
  }

  /**查询主键 */
  mainKey(id: Dbany | Dbany[], idKey?: string) {
    const table = this.option.from![0]
    if(!idKey) {
      idKey = this.modelData![table].mainKey
      if(!idKey) throw new FlqError(`${ table } missing mainKey`)
    }
    if(Array.isArray(id)) {
      return this.where(sql(`${ idKey } IN (${ id.map(e => escape(e)).join(', ') })`))
    }
    return this.where(sql(`${ idKey } = ${ id }`))
  }

  /**插入数据 */
  value(option: ValueOption) {
    const db = this.clone()
    const { option: sp } = db
    if(sp.value) {
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
    if(sp.set) {
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
    if(sp.order) {
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
    if(size > 0) {
      sp.limit = [ 0, size ]
      return db
    }
    throw new FlqError('Flq.page: 必须传入大于0的整数')
  }

  /**页码 */
  page(page: number) {
    const db = this.clone()
    const { option: sp } = db
    if(page > 0) {
      const { limit } = sp
      if(!limit || !limit[1])
        throw new FlqError('Flq.page: 必须先设置每页条数')
      limit[0] = (page - 1) * limit[1]
      return db
    }
    throw new FlqError('Flq.page: 必须传入大于0的整数')
  }

  /**虚拟获取 */
  vget(option: VirtualGet) {
    const db = this.clone()
    const { option: sp } = db
    if(!sp.virtualGet) sp.virtualGet = {}
    if(Array.isArray(option)) {
      for(let i = 0; i < option?.length; i++) {
        const e = option[i]
        sp.virtualGet[e] = true
      }
    } else {
      Object.assign(sp.virtualGet, option)
    }
    return db
  }

  /**虚拟插入 */
  vset(option: VirtualSet) {
    const db = this.clone()
    const { option: sp } = db
    if(sp.virtualSet) {
      Object.assign(sp.virtualSet, option)
    } else {
      sp.virtualSet = Object.assign({}, option)
    }
    return db
  }

  /**
   * @deprecated
   * 记录查询总列数
   * 使用`findRows`方法代替
   */
  foundRows() {
    const db = this.clone()
    const { option: sp } = db
    return db
  }

  /**查询 */
  async find(): Promise<Record<string, any>[]> {
    this.type = 'select'
    return await this.send('select')
  }

  /**查询总列数 */
  async findRows(): Promise<{ total: number, data: Record<string, any>[] }> {
    this.option.foundRows = 'SQL_CALC_FOUND_ROWS'
    const data = await this.find()
    return {
      total: this.total!,
      data,
    }
  }

  /**查询第一个 */
  async first(): Promise<Record<string, any>> {
    this.type = 'select'
    const data = await this.send('select')
    return data[0]
  }

  /**插入 */
  async add() {
    this.type = 'insert'
    return await this.send('insert')
  }

  /**插入 */
  async update() {
    this.type = 'update'
    return await this.send('update')
  }

  /**计数 */
  async count(): Promise<number> {
    this.type = 'select'
    const data = await this.send('count')
    // @ts-ignore
    return Object.values(data[0])[0]
  }

  /**删除 */
  async remove() {
    this.type = 'remove'
    return await this.send('remove')
  }

  /**获取列表-仅列表结构有效 */
  async getList() {
    const table = this.option.from![0]
    const { indexField } = this.modelData![table]
    if(!indexField) throw new FlqError(`${ table } missing indexField`)
    const data = await this.find()
    data.sort((a, b) => a[indexField] - b[indexField])
    return data
  }

  /**设置列表-仅列表结构有效 */
  async setList(values: Data[]) {
    const table = this.option.from![0]
    const { indexField } = this.modelData![table]
    if(!indexField) throw new FlqError(`${ table } missing indexField`)
    this.where(this.option.value)
    const remove = await this.remove()
    const inserts = await AsyncErgodic(values, (e, i) => {
      e[indexField] = i
      return this.value(e).add()
    })
    return {
      remove,
      inserts,
    }
  }

  /**截取列表-仅列表结构有效 */
  async sliceList(index: number, count: number = 1) {
    const table = this.option.from![0]
    const { indexField } = this.modelData![table]
    if(!indexField) throw new FlqError(`${ table } missing indexField`)
    const remove = await this.where({
      [indexField]: {
        com: 'BETWEEN',
        val: [ index, index + count - 1 ],
      },
    }).remove()
    const update = this.where({
      [indexField]: {
        val: index,
        com: '>',
      },
    }).set({
      [indexField]: sql(`field(indexField) - ${ count }`),
    }).update()
    return {
      remove,
      update,
    }
  }

  /**插入列表-仅列表结构有效 */
  async insertList(index: number, data: Data[]) {
    const count = data.length
    const table = this.option.from![0]
    const { indexField } = this.modelData![table]
    if(!indexField) throw new FlqError(`${ table } missing indexField`)
    const update = this.where({
      [indexField]: {
        val: index,
        com: '>',
      },
    }).set({
      [indexField]: sql(`field(indexField) + ${ count }`),
    }).update()
    const inserts = []
    for(let i = 0; i < data.length; i++) {
      inserts.push(await this.value({ ...data[i], [indexField]: index + i }).add())
    }
    return {
      update,
      inserts,
    }
  }

  /**递归查询-仅递归结构有效 */
  async recursion(option: RecursionOption = {}) {
    const { type = 'up', gradation, flq = this.clone() } = option
    let { stop } = option
    if(!option.flq) {
      delete flq.option.where
    }
    const table = this.option.from![0]
    if(!this.modelData![table]) throw new FlqError(`${ table } missing model`)
    const mainKey = this.modelData![table].mainKey
    const childField = this.modelData![table].childField
    const parentField = this.modelData![table].parentField
    const gradeField = this.modelData![table].gradeField
    if(!mainKey) throw new FlqError(`${ table } missing mainKey`)
    if(!parentField) throw new FlqError(`${ table } missing parentField`)
    if(!childField) throw new FlqError(`${ table } missing childField`)
    const data = await this.find()
    if(data.length === 0) return data
    if(stop !== undefined && !(typeof stop === 'function')) {
      if(!gradeField) throw new FlqError(`${ table } missing gradeField`)
      const n = stop
      stop = (data: Data[]) => data[0][gradeField] === n
    }
    if(stop !== undefined && stop(data)) return data
    // @ts-ignore
    const callop: CallOption = { flq, parentField, childField, mainKey, stop }
    switch(type) {
      case 'up': {
        if(gradation)
          return await callUp0(data, callop)
        return await callUp1(data, callop)
      }
      case 'down': {
        if(gradation)
          return await callDown0(data, callop)
        return await callDown1(data, callop)
      }
    }
  }
}

/**总列数 */
hooks.on('postreat', async ({ flq, data, connect }: HooksEvent['postreat']) => {
  if(!flq.option.foundRows) return
  if(!Array.isArray(data)) return
  const d = await flq.query(foundRows, connect)
  flq.total = Object.values(d[0])[0] as number
})

