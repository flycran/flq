"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flq = exports.FlqError = exports.field = exports.hooks = exports.escape = void 0;
const mysql2_1 = require("mysql2");
const EventEmitter = require("events");
exports.escape = mysql2_1.escape;
const templates_1 = require("./templates");
/**钩子 */
exports.hooks = new EventEmitter();
const Reg0 = /^.+\(.*?\)$/;
function pf(n) {
    if (n.includes('`'))
        throw new FlqError(`非法的字段名"${n}"，字段名不允许包含反引号"\`"`);
    return '`' + n + '`';
}
function field(p1, p2) {
    if (Array.isArray(p1))
        return field(...p1);
    if (p2) {
        return pf(p1) + '.' + pf(p2);
    }
    if (Reg0.test(p1))
        return p1;
    return pf(p1);
}
exports.field = field;
/**Flq抛出错误 */
class FlqError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.FlqError = FlqError;
const Methods = require("./methods");
/**深拷贝 */
const deepClone = (target) => {
    const targetType = typeof target;
    let result;
    if (targetType === 'object') {
        result = {};
    }
    else if (Array.isArray(target)) {
        result = [];
    }
    else {
        return target;
    }
    for (let key in target) {
        const value = target[key];
        const valueType = typeof value;
        if (valueType === 'object') {
            // @ts-ignore
            result[key] = deepClone(value);
        }
        else {
            // @ts-ignore
            result[key] = value;
        }
    }
    return result;
};
const Reg = /\[(.+?)\]/g;
class Flq extends EventEmitter {
    constructor(option, model) {
        super();
        /**sql参数 */
        this.option = {};
        if (!option)
            return;
        if (option.pool) {
            //@ts-ignore
            this.pool = (0, mysql2_1.createPool)(option);
        }
        else {
            //@ts-ignore
            this.connection = (0, mysql2_1.createConnection)(option);
        }
        this.model = model;
    }
    /**获取连接 */
    getConnect() {
        const { pool } = this;
        if (pool) {
            return new Promise((e, r) => {
                pool.getConnection((err, ctn) => {
                    if (err)
                        return r(err);
                    e(ctn);
                });
            });
        }
        //@ts-ignore
        return this.connection;
    }
    /**结束连接 */
    end() {
        return new Promise((e, r) => {
            const callBack = (err) => {
                if (err)
                    return r(err);
            };
            this.pool ? this.pool.end(callBack) : this.connection?.end(callBack);
        });
    }
    /**查询 */
    query(sql, connection) {
        return new Promise(async (e, r) => {
            if (!connection)
                connection = await this.getConnect();
            connection.query(sql, (err, data) => {
                if (err)
                    return r(err);
                //@ts-ignore
                e(data);
            });
        });
    }
    /**
     * 格式化为sql语句
     * @param method 格式方法
     * @returns sql语句
     */
    format(method) {
        let rsql = templates_1.templates[method];
        const sql = rsql.replace(Reg, (a, e) => {
            //@ts-ignore
            const v = this.option[e];
            switch (e) {
                case 'value':
                    const k = Object.keys(v);
                    const l = Object.values(v);
                    return `(${k.join(', ')}) VALUES (${l.join(', ')})`;
                case 'from':
                    if (!v)
                        throw new FlqError('Flq.format:from为必选参数');
                    return v;
                case 'where':
                    if (!v)
                        return '';
                    return 'WHERE ' + v;
                case 'field':
                    if (!v)
                        return '*';
                default:
                    if (!v)
                        return '';
                    return v;
            }
        });
        this.emit('format', sql);
        exports.hooks.emit('format', sql);
        return sql;
    }
    /**
     * 发送sql语句, 并根据模型处理数据
     * @param method 格式方法
     * @returns 数据
     */
    async send(method) {
        const { option } = this;
        this.emit('beforeSend', { method, option });
        //@ts-ignore
        const ctn = await this.getConnect();
        const sql = this.format(method);
        this.emit('format', { sql, method, option });
        const data = await this.query(sql, ctn);
        if (option.lastId) {
            //@ts-ignore
            data.lastId = await this.lastId(ctn);
        }
        if (this.pool) {
            //@ts-ignore
            ctn.release();
        }
        this.emit('send', { data, method, option, sql });
        return data;
    }
    /**克隆实例 */
    clone() {
        // @ts-ignore
        const db = new Flq();
        db.option = deepClone(this.option);
        db.model = this.model;
        return db;
    }
    /**设置表格 */
    from(...option) {
        const db = this.clone();
        const { option: sp } = db;
        const sql = option.map((e) => Methods.from(e)).join(', ');
        if (sp.from === undefined) {
            sp.from = sql;
        }
        else {
            sp.from += ', ' + sql;
        }
        return db;
    }
    /**设置字段 */
    field(...option) {
        const db = this.clone();
        const { option: sp } = db;
        const sql = option.map((e) => Methods.field(e)).join(', ');
        if (sp.field === undefined) {
            sp.field = sql;
        }
        else {
            sp.field += ', ' + sql;
        }
        return db;
    }
    /**设置条件 */
    where(...option) {
        const db = this.clone();
        const { option: sp } = db;
        const sql = option.map((e) => Methods.where(e)).join(' AND ');
        if (sp.where === undefined) {
            sp.where = sql;
        }
        else {
            sp.where += ' AND ' + sql;
        }
        return db;
    }
    /**设置值 */
    set(...option) {
        const db = this.clone();
        const { option: sp } = db;
        const sql = option.map((e) => Methods.set(e)).join(', ');
        if (sp.where === undefined) {
            sp.where = sql;
        }
        else {
            sp.where += ' AND ' + sql;
        }
        return db;
    }
    /**排序 */
    order(option) {
        const db = this.clone();
        const { option: sp } = db;
        return db;
    }
    /**分组 */
    group(option) {
        const db = this.clone();
        const { option: sp } = db;
        return db;
    }
    /**分页 */
    limit(option) {
        const db = this.clone();
        const { option: sp } = db;
        return db;
    }
    /**查询 */
    async find() { }
    async count() { }
}
exports.Flq = Flq;
//# sourceMappingURL=index.js.map