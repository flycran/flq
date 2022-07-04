import { createConnection, createPool, escape as $escape } from 'mysql2'
import { AsyncEvent } from './event'
import {
  FlqOption,
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
} from './types'

export const escape = $escape

import { Connection, Pool } from 'mysql2'
import * as $templates from './templates'
const templates: Record<string, string> = $templates

/**钩子 */
export const hooks = new AsyncEvent()
const Reg0 = /^.+\(.*?\)$/
/**模型处理 */
import { postreat } from './model'

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
  if (Reg0.test(p1)) return p1
  return pf(p1)
}

import {} from './functions'

/**Flq抛出错误 */
export class FlqError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

import * as methods from './methods'

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

const Reg = /\[(.+?)\]/g

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
    let rsql = templates[method]
    const sql = rsql.replace(Reg, (a, e) => {
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
