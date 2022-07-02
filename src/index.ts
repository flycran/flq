import { createConnection, createPool, escape as $escape } from 'mysql2'
import EventEmitter = require('events')

export const escape = $escape

import { Connection, Pool } from 'mysql2'
import { templates } from './templates'

/**钩子 */
export const hooks = new EventEmitter()
const Reg0 = /^.+\(.*?\)$/

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

import functions from './functions'

/**Flq抛出错误 */
export class FlqError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

import * as Methods from './methods'
/**深拷贝 */
const deepClone = (target: any) => {
  const targetType = typeof target
  let result
  if (targetType === 'object') {
    result = {}
  } else if (Array.isArray(target)) {
    result = []
  } else {
    return target
  }
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
/**连接配置 */
interface ConnectOption {
  /**数据库类型(目前仅支持mysql) */
  type?: 'mysql'
  /**要连接到的数据库的主机名 */
  host?: string
  /**要作为身份验证身份的 MySQL 用户 */
  user?: string
  /**要用于此连接的数据库的名称 */
  database?: string
  /**使用连接池 */
  pool?: boolean
  /**要连接到的端口号 */
  port?: number
  /**用于 TCP 连接的源 IP 地址 */
  localAddress?: string
  /**要连接到的 unix 域套接字的路径。使用时将忽略[host]、[port] */
  socketPath?: string
  /**该MySQL用户的密码 */
  password?: string
  /**连接的字符集。这在MySQL的SQL级中称为"排序规则"（如）。如果指定了 SQL 级字符集（如 ），则使用该字符集的默认排序规则 */
  charset?: string
  /**在 MySQL 服务器上配置的时区。这用于将服务器日期/时间值键入 JavaScript 对象，反之亦然 */
  timezone?: string
  /**在与MySQL服务器的初始连接期间发生超时之前的毫秒 */
  connectTimeout?: number
  /**字符串化对象，而不是转换为值 */
  stringifyObjects?: boolean
  /**许连接到要求使用旧（不安全）身份验证方法的MySQL实例 */
  insecureAuth?: boolean
  /**确定列值是否应转换为本机 JavaScript 类型 */
  typeCast?: boolean
  /**自定义查询格式函数 */
  queryFormat?: Function
  /**在数据库中处理大数字（BIGINT 和 DECIMAL 列）时，应启用此选项 */
  supportBigNumbers?: boolean
  /**启用并强制大数字（BIGINT 和 DECIMAL 列）始终作为 JavaScript 字符串对象返回 */
  bigNumberStrings?: boolean
  /**强制日期类型（时间戳、日期时间、日期）作为字符串返回，而不是膨胀到 JavaScript 日期对象中 */
  dateStrings?: boolean
  /**将协议详细信息打印到 stdout。可以是true/或应打印的数据包类型名称的数组 */
  debug?: boolean | any[]
  /**生成堆栈跟踪以包括库入口的调用站点（"长堆栈跟踪"） */
  trace?: boolean
  /**允许使用修饰符 */
  localInfile?: boolean
  /**允许每个查询使用多个 mysql 语句 */
  multipleStatements?: boolean
  /**除默认标志外要使用的连接标志的列表 */
  flags?: any
  /**具有 ssl 参数或包含 ssl 配置文件名称的字符串的对象 */
  ssl?: string | { ca: string; rejectUnauthorized: boolean }
  /**连接获取过程中超时发生之前的毫秒 */
  acquireTimeout?: number
  /**在没有可用连接且已达到限制时确定池的操作 */
  waitForConnections?: boolean | number
  /**一次创建的最大连接数 */
  connectionLimit?: boolean
  /**池将在返回错误之前排队的最大连接请求数 */
  queueLimit?: number
}

/**Flq选项描述 */
export interface FlqOption {
  from?: string
  field?: string
  where?: string
  set?: string
  value?: Record<string, DbAny>
  order?: string
  group?: string
  limit?: string
  lastId?: boolean
}

type DbAny = string | number | boolean | Date

/**分页 */
export type Limit =
  | [number, number]
  | {
      /**页码(从1开始) */
      page: number
      /**每页条数 */
      size: number
    }

type DbData = Record<string, DbAny>
export type SetOption = DbData
export type ValueOption = Record<string, DbAny>

export type FromOption = string
/**查询字段 */
export namespace FieldOption {
  interface Ops {
    as?: string
    met?: string
    from?: string
  }
  type FieldObj = Record<string, string | Ops>
  type FieldArr = [string, string] | [string, string, string]
  export type Option = string | FieldObj | FieldArr
}
export type FieldOption = FieldOption.Option
/**排序 */
export namespace OrderOption {
  export type Op = 'ACS' | 'DESC' | 1 | -1
  export type Option = string | Record<string, Op> | string[]
}
export type OrderOption = OrderOption.Option
/**分组 */
export type GroupOption = string
/**查询条件 */
export namespace WhereOption {
  export type Op = 'AND' | 'OR'
  export type Com =
    | '>'
    | '<'
    | '='
    | '!='
    | '<='
    | '>='
    | '<>'
    | 'is null'
    | 'is not null'
    | 'between'
    | 'like'
    | 'in'
    | 'not in'
    | 'regexp'
  type Condition = [string, DbAny] | [string, Com, any] | [string, 'between', DbAny, DbAny]
  type WhereOp = Partial<{ [Key in Op]: Option }>
  type WhereObj = Record<string, [Com, DbAny] | any>
  export type Option = (WhereOp & WhereObj) | Condition | string
}
export type WhereOption = WhereOption.Option

/**模型选项 */
export namespace ModelOption {
  interface SubOption {
    field: string
    rename: string
  }
  type Sub = Record<string, string | SubOption>

  interface Ops {
    /**类型 */
    type?: string
    /**默认值 */
    default?: DbAny
    /**虚拟字段获取 */
    get?: (this: Flq, data: DbData) => DbAny | Promise<DbAny>
    /**虚拟字段设置 */
    set?: (this: Flq, data: DbData) => void | Promise<void>
    /**预处理 */
    pretreat?: (value: any, data: DbData) => DbAny
    /**后处理 */
    postreat?: (value: DbAny, data: DbData) => any
    /**重命名 */
    rename?: string
    /**多表字段连接 */
    union?: Sub
  }
  export type Option = Record<string, Record<string, Ops>>
}
export type ModelOption = ModelOption.Option

const Reg = /\[(.+?)\]/g

export class Flq extends EventEmitter {
  /**sql参数 */
  option: FlqOption = {}
  /**模型 */
  model?: ModelOption
  /**连接 */
  connection?: Connection
  /**连接池 */
  pool?: Pool
  constructor(option: ConnectOption, model?: ModelOption) {
    super()
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
          const k = Object.keys(v)
          const l = Object.values(v)
          return `(${k.join(', ')}) VALUES (${l.join(', ')})`
        case 'from':
          if (!v) throw new FlqError('Flq.format:from为必选参数')
          return v
        case 'field':
          if (!v) return '*'
        case 'where':
          if (!v) return ''
          return 'WHERE ' + v
        case 'order':
          if (!v) return ''
          return 'ORDER BY ' + v
        default:
          if (!v) return ''
          return v
      }
    })
    this.emit('format', sql)
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
    this.emit('format', { sql, method, option })
    const data: any[] | any = await this.query(sql, ctn)
    if (option.lastId) {
      //@ts-ignore
      data.lastId = await this.lastId(ctn)
    }
    if (this.pool) {
      //@ts-ignore
      ctn.release()
    }
    this.emit('send', { data, method, option, sql })
    return data
  }
  /**克隆实例 */
  clone() {
    // @ts-ignore
    const db = new Flq()
    db.option = deepClone(this.option)
    db.model = this.model
    return db
  }
  /**设置表格 */
  from(...option: FromOption[]) {
    const db = this.clone()
    const { option: sp } = db
    const sql = option.map((e) => Methods.from(e)).join(', ')
    if (sp.from === undefined) {
      sp.from = sql
    } else {
      sp.from += ', ' + sql
    }
    return db
  }
  /**设置字段 */
  field(...option: FieldOption[]) {
    const db = this.clone()
    const { option: sp } = db
    const sql = option.map((e) => Methods.field(e)).join(', ')
    if (sp.field === undefined) {
      sp.field = sql
    } else {
      sp.field += ', ' + sql
    }
    return db
  }
  /**设置条件 */
  where(...option: WhereOption[]) {
    const db = this.clone()
    const { option: sp } = db
    const sql = option.map((e) => Methods.where(e)).join(' AND ')
    if (sp.where === undefined) {
      sp.where = sql
    } else {
      sp.where += ' AND ' + sql
    }
    return db
  }
  /**设置值 */
  set(...option: SetOption[]) {
    const db = this.clone()
    const { option: sp } = db
    const sql = option.map((e) => Methods.set(e)).join(', ')
    if (sp.where === undefined) {
      sp.where = sql
    } else {
      sp.where += ' AND ' + sql
    }
    return db
  }
  /**排序 */
  order(option: OrderOption, defOp: OrderOption.Op) {
    const db = this.clone()
    const { option: sp } = db
    const sql = Methods.order(option, defOp)
    if (sp.where === undefined) {
      sp.order = sql
    } else {
      sp.where += ', ' + sql
    }
    return db
  }
  /**分组 */
  group(option: GroupOption) {
    const db = this.clone()
    const { option: sp } = db
    return db
  }
  /**分页 */
  limit(option: Limit) {
    const db = this.clone()
    const { option: sp } = db
    return db
  }
  /**获取最后一个插入的id */
  lastId() {
    const db = this.clone()
    const { option: sp } = db
    sp.lastId = true
    return db
  }
  /**查询 */
  async find() {}
  async count() {}
}
