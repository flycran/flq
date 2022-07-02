/// <reference types="node" />
import { escape as $escape } from 'mysql2';
import EventEmitter = require('events');
export declare const escape: typeof $escape;
import { Connection, Pool } from 'mysql2';
/**钩子 */
export declare const hooks: EventEmitter;
/**预处理字段名 */
export declare function field(field: string): string;
export declare function field(from: string, field: string): string;
export declare function field(param: [string, string]): string;
/**Flq抛出错误 */
export declare class FlqError extends Error {
    constructor(msg: string);
}
interface ConnectOption {
    /**数据库类型(目前仅支持mysql) */
    type?: 'mysql';
    /**要连接到的数据库的主机名 */
    host?: string;
    /**要作为身份验证身份的 MySQL 用户 */
    user?: string;
    /**要用于此连接的数据库的名称 */
    database?: string;
    /**使用连接池 */
    pool?: boolean;
    /**要连接到的端口号 */
    port?: number;
    /**用于 TCP 连接的源 IP 地址 */
    localAddress?: string;
    /**要连接到的 unix 域套接字的路径。使用时将忽略[host]、[port] */
    socketPath?: string;
    /**该MySQL用户的密码 */
    password?: string;
    /**连接的字符集。这在MySQL的SQL级中称为"排序规则"（如）。如果指定了 SQL 级字符集（如 ），则使用该字符集的默认排序规则 */
    charset?: string;
    /**在 MySQL 服务器上配置的时区。这用于将服务器日期/时间值键入 JavaScript 对象，反之亦然 */
    timezone?: string;
    /**在与MySQL服务器的初始连接期间发生超时之前的毫秒 */
    connectTimeout?: number;
    /**字符串化对象，而不是转换为值 */
    stringifyObjects?: boolean;
    /**许连接到要求使用旧（不安全）身份验证方法的MySQL实例 */
    insecureAuth?: boolean;
    /**确定列值是否应转换为本机 JavaScript 类型 */
    typeCast?: boolean;
    /**自定义查询格式函数 */
    queryFormat?: Function;
    /**在数据库中处理大数字（BIGINT 和 DECIMAL 列）时，应启用此选项 */
    supportBigNumbers?: boolean;
    /**启用并强制大数字（BIGINT 和 DECIMAL 列）始终作为 JavaScript 字符串对象返回 */
    bigNumberStrings?: boolean;
    /**强制日期类型（时间戳、日期时间、日期）作为字符串返回，而不是膨胀到 JavaScript 日期对象中 */
    dateStrings?: boolean;
    /**将协议详细信息打印到 stdout。可以是true/或应打印的数据包类型名称的数组 */
    debug?: boolean | any[];
    /**生成堆栈跟踪以包括库入口的调用站点（"长堆栈跟踪"） */
    trace?: boolean;
    /**允许使用修饰符 */
    localInfile?: boolean;
    /**允许每个查询使用多个 mysql 语句 */
    multipleStatements?: boolean;
    /**除默认标志外要使用的连接标志的列表 */
    flags?: any;
    /**具有 ssl 参数或包含 ssl 配置文件名称的字符串的对象 */
    ssl?: string | {
        ca: string;
        rejectUnauthorized: boolean;
    };
    /**连接获取过程中超时发生之前的毫秒 */
    acquireTimeout?: number;
    /**在没有可用连接且已达到限制时确定池的操作 */
    waitForConnections?: boolean | number;
    /**一次创建的最大连接数 */
    connectionLimit?: boolean;
    /**池将在返回错误之前排队的最大连接请求数 */
    queueLimit?: number;
}
/**Flq选项描述 */
export interface FlqOption {
    from?: string;
    field?: string;
    where?: string;
    set?: string;
    value?: Record<string, DbAny>;
    lastId?: boolean;
}
declare type DbAny = string | number | boolean | Date;
/**联合 */
/**分页 */
export declare type Limit = [number, number] | {
    /**页码(从1开始) */
    page: number;
    /**每页条数 */
    size: number;
};
declare type DbData = Record<string, DbAny>;
export declare type SetOption = DbData;
export declare type ValueOption = Record<string, DbAny>;
export declare type FromOption = string;
/**查询字段 */
export declare namespace FieldOption {
    interface Ops {
        as?: string;
        met?: string;
        from?: string;
    }
    type FieldObj = Record<string, string | Ops>;
    type FieldArr = [string, string] | [string, string, string];
    export type Option = string | FieldObj | FieldArr;
    export {};
}
export declare type FieldOption = FieldOption.Option;
/**排序 */
export declare type OrderOption = Record<string, 'ACS' | 'DESC' | 1 | -1>;
/**分组 */
export declare type GroupOption = string;
/**查询条件 */
export declare namespace WhereOption {
    export type Op = 'AND' | 'OR' | 'NOT';
    export type Com = '>' | '<' | '=' | '!=' | '<=' | '>=' | '<>' | 'is null' | 'is not null' | 'between';
    type Condition = [string, DbAny] | [string, Com, DbAny] | [string, 'between', DbAny, DbAny];
    type WhereOp = Partial<{
        [Key in Op]: Option;
    }>;
    type WhereObj = Record<string, [Com, DbAny] | DbAny>;
    export type Option = (WhereOp & WhereObj) | Condition | string;
    export {};
}
export declare type WhereOption = WhereOption.Option;
/**模型选项 */
export declare namespace ModelOption {
    interface SubOption {
        field: string;
        rename: string;
    }
    type Sub = Record<string, SubOption>;
    interface Ops {
        /**类型 */
        type?: string;
        /**默认值 */
        default?: DbAny;
        /**虚拟字段获取 */
        get?: (this: Flq, data: DbData) => DbAny | Promise<DbAny>;
        /**虚拟字段设置 */
        set?: (this: Flq, data: DbData) => void | Promise<void>;
        /**预处理 */
        pretreat?: (value: any, data: DbData) => DbAny;
        /**后处理 */
        postreat?: (value: DbAny, data: DbData) => any;
        /**重命名 */
        rename?: string;
        /**多表字段连接 */
        union?: Sub;
    }
    export type Option = {
        [x: string]: Ops;
    };
    export {};
}
export declare type ModelOption = ModelOption.Option;
export declare class Flq extends EventEmitter {
    /**sql参数 */
    option: FlqOption;
    /**模型 */
    model?: ModelOption;
    /**连接 */
    connection?: Connection;
    /**连接池 */
    pool?: Pool;
    constructor(option: ConnectOption, model?: ModelOption);
    /**获取连接 */
    getConnect(): Connection | Promise<Connection>;
    /**结束连接 */
    end(): Promise<unknown>;
    /**查询 */
    query(sql: string, connection?: Connection | Pool): Promise<Record<string, any>[]>;
    /**
     * 格式化为sql语句
     * @param method 格式方法
     * @returns sql语句
     */
    format(method: string): string;
    /**
     * 发送sql语句, 并根据模型处理数据
     * @param method 格式方法
     * @returns 数据
     */
    send(method: string): Promise<any[]>;
    /**克隆实例 */
    clone(): Flq;
    /**设置表格 */
    from(...option: FromOption[]): Flq;
    /**设置字段 */
    field(...option: FieldOption[]): Flq;
    /**设置条件 */
    where(...option: WhereOption[]): Flq;
    /**设置值 */
    set(...option: SetOption[]): Flq;
    /**排序 */
    order(option: OrderOption): Flq;
    /**分组 */
    group(option: GroupOption): Flq;
    /**分页 */
    limit(option: Limit): Flq;
    /**查询 */
    find(): Promise<void>;
    count(): Promise<void>;
}
export {};
