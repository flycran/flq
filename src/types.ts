// 公共类型声明
import {Flq} from './index'
import {Connection} from 'mysql2'

/**连接配置 */
export interface ConnectOption {
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
  /**表名 */
  from?: string
  /**字段 */
  field?: string
  /**条件 */
  where?: string
  // ！改为对象形式
  /**设置 */
  set?: string
  /**插入 */
  value?: Record<string, any>
  /**排序 */
  order?: string
  /**分组 */
  group?: string
  /**分页 */
  limit?: (number | void)[]
  /**虚拟获取 */
  virtualGet?: string[]
  /**虚拟插入 */
  virtualSet?: Record<string, any>
  /**子查询 */
  subField?: SubFieldOption.Obj
  /**插入id */
  insertId?: boolean
  /**完整列数 */
  foundRows?: string
  /**强制遍历响应数据 */
  traversal?: boolean
}

/**基本索引对象 */
export type Data = Record<string, any>
/**表名 */
export type FromOption = string
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
  type Condition =
    | [string, any]
    | [string, Com, any]
    | [string, 'between', any, any]
  type WhereOp = Partial<{ [Key in Op]: Option }>
  type WhereObj = Record<string, [Com, any] | any>
  export type Option = (WhereOp & WhereObj) | Condition | string
}
export type WhereOption = WhereOption.Option
/**查询字段 */
export namespace FieldOption {
  export type PolyMet = 'AVG' | 'COUNT' | 'MAX' | 'MIN' | 'SUM'
  type FieldObj = { [x: PolyMet | string]: Option | string | [string, string] }
  type FieldArr = (string | FieldObj)[]
  export type Option = string | FieldObj | FieldArr
}
export type FieldOption = FieldOption.Option
/**排序 */
export namespace OrderOption {
  export type Op = 'ACS' | 'DESC' | '1' | '-1'
  type OrderObj = { [x: Op | string]: Option | string }
  type OrderArr = string[]
  export type Option = string | OrderObj | OrderArr
}
export type OrderOption = OrderOption.Option
/**分组 */
export type GroupOption = string
/**更新 */
export type SetOption = Data
/**插入 */
export type ValueOption = Record<string, any>
/**分页 */
export type LimitOption =
  | [number, number]
  | [
  {
    /**页码(从1开始) */
    page: number
    /**每页条数 */
    size: number
  }
]
/**子字段选项 */
export namespace SubFieldOption {
  interface Op {
  }

  export type Obj = Record<string, string | Op>
  export type Option = Obj | string
}
export type SubFieldOption = SubFieldOption.Option
/**模型选项 */
export namespace ModelOption {
  interface SubOption {
    field: string
    rename: string
  }

  type Sub = Record<string, string | SubOption>

  export interface Ops {
    /**类型 */
    type: string
    /**默认值 */
    default: ((this: Flq, value: Record<string, any>) => Promise<any>) | any
    /**更新值 */
    update: ((this: Flq, value: Record<string, any>) => Promise<any>) | any
    /**虚拟字段获取 */
    get: (this: Flq, row: Data) => Promise<any>
    /**虚拟字段设置 */
    set: (this: Flq, value: any, row: Data) => Promise<void>
    /**预处理 */
    pretreat: (this: Flq, value: any, data: Data) => Promise<any>
    /**后处理 */
    postreat: (this: Flq, value: any, data: Data) => Promise<any>
    /**重命名 */
    rename: string
    /**转数组 */
    toArray: boolean
    /**子表连接 */
    sub: Sub
  }

  export type Option = Record<string, Record<string, Partial<Ops>>>
}
export type ModelOption = ModelOption.Option

export type PromiseSet<T = any> = Set<Promise<T>>

export namespace EventParam {
  export interface PostreatEvent {
    flq: Flq
    data: Data[] | Data
    method: string
    connect: Connection
  }

  export interface RowPostreatEvent {
    flq: Flq
    row: Record<string, any>
  }

  export interface ModelPostreatEvent {
    flq: Flq
    fields: string[]
    model: Partial<ModelOption.Ops>
    field: string
    value: any
    row: Record<string, any>
  }
}
