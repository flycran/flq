// 公共类型声明
import { Connection } from 'mysql2'
import { Flq, Sql } from './index'

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
  from?: string[]
  /**字段 */
  field?: string
  /**条件 */
  where?: string
  /**设置 */
  set: Record<string, any>
  /**插入 */
  value: Record<string, any>
  /**排序 */
  order?: string
  /**分组 */
  group?: string
  /**分页 */
  limit?: (number | void)[]
  /**虚拟获取 */
  virtualGet?: VirtualGet
  /**虚拟插入 */
  virtualSet?: VirtualSet
  /**完整列数 */
  foundRows?: string
}


export interface CallOption {
  flq: Flq,
  parentField: string,
  childField: string,
  mainKey: string,
  gradeField?: string,
  stop?: (data: Data[]) => any,
}

export type VirtualGet = string[] | Record<string, any>

export type VirtualSet = Record<string, any>

export type Dbany = string | number | boolean | Date
/**运算符 */
export type Operator = '+' | '-' | '*' | '/' | '%'
/**基本索引对象 */
export type Data = Record<string, any>
/**表名 */
export type FromOption = string
/**查询条件 */
export namespace WhereOption {
  export type Connector = 'AND' | 'OR'
  export type NoVal = 'IS NULL' | 'IS NOT NULL'
  export type ArrVal = 'IN' | 'NOT IN'
  export type NeedVal =
    | '>'
    | '<'
    | '='
    | '!='
    | '<='
    | '>='
    | '<>'
    | 'LIKE'
    | 'REGEXP'
  export type Comparator = NeedVal | NoVal | ArrVal | 'BETWEEN'

  type Ops =
    | { com: NoVal }
    | { com: ArrVal; val: Dbany[] }
    | { com: 'BETWEEN'; val: [Sql | Dbany, Sql | Dbany] }
    | {
    com: NeedVal
    val: Sql | Dbany
  }

  type WhereObj =
    | {
    [K in Connector | Comparator]?: Option
  }
    | {
    [x: string]: Sql | Ops | Dbany
  }
  export type Option = WhereObj | Option[] | Sql | Sql[]
}
export type WhereOption = WhereOption.Option
/**查询字段 */
export namespace FieldOption {
  export type PolyMet = 'AVG' | 'COUNT' | 'MAX' | 'MIN' | 'SUM'
  type FieldObj =
    | {
    [K in PolyMet]?: Option
  }
    | { [x: string]: string | [string, string] }
  type FieldArr = (string | FieldObj)[]
  export type Option = Sql | string | FieldObj | FieldArr
}
export type FieldOption = FieldOption.Option
/**排序 */
export namespace OrderOption {
  export type Op = 'ASC' | 'DESC' | '1' | '-1' | 1 | -1
  type OrderObj = { [x: Exclude<Op, 1 | -1> | string]: Op | Option | string }
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
/**模型选项 */
export namespace ModelOption {
  export interface Model {
    /**是否为主键 */
    mainKey: boolean
    /**类型 */
    type: string
    /**默认值 */
    default: ((this: Flq, row: Data) => Promise<any> | any) | any
    /**更新值 */
    update: ((this: Flq, row: Data) => Promise<any> | any) | any
    /**虚拟字段获取 */
    get: (this: Flq, row: Data, data?: any) => Promise<any> | any
    /**虚拟字段设置 */
    set: (this: Flq, value: any, row: Data) => Promise<void> | void
    /**预处理 */
    pretreat: (this: Flq, value: any, data: Data) => Promise<any> | any
    /**后处理 */
    postreat: (this: Flq, value: any, data: Data) => Promise<any> | any
    /**重命名 */
    rename:
      | ((
      this: Flq,
      key: string,
      value: any,
      row: Data
    ) => Promise<string> | string)
      | string
    /**转数组 */
    toArray: boolean | string
    /**索引字段 */
    indexField: boolean
    /**等级字段名 */
    gradeField: boolean
    /**父级主键字段名 */
    parentField: boolean
    /**字元素字段名 */
    childField:boolean
  }
  export type Option = Record<string, Record<string, Partial<Model>>>
}

export interface RecursionOption {
  type?: 'up' | 'down'
  stop?: number | ((data: Data[]) => any)
  gradation?: boolean
  flq?: Flq
}

export namespace ModelData {
  export interface Data {
    indexField: string,
    gradeField: string,
    parentField: string
    mainKey: string
    childField: string
  }
  export type Option = Record<string, Partial<Data>>
}
export type ModelData = ModelData.Option

export type ModelOption = ModelOption.Option

export type PromiseSet<T = any> = Set<Promise<T>>

export interface HooksEvent {
  petreat: ({
    flq: Flq
    row: Record<string, any>
  })

  postreat: {
    flq: Flq
    data: Data[] | Data
    method: string
    connect: Connection
  }
}

export interface ModelUse<T extends keyof ModelOption.Model> {
  fieldPetreat: {
    flq: Flq
    model: ModelOption.Model[T]
    key: string
    value: any
    row: Record<string, any>
  }
  fieldPostreat: {
    flq: Flq
    model: ModelOption.Model[T]
    key: string
    value: any
    row: Record<string, any>
  }
}
