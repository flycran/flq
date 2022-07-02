"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.value = exports.limit = exports.order = exports.where = exports.field = exports.from = void 0;
const index_1 = require("./index");
const boolOpers = ['AND', 'NOT', 'OR'];
const compOpers = ['!=', '<', '<=', '<>', '=', '>', '>='];
function from(option) {
    //@ts-ignore
    if (typeof option === 'string')
        return (0, index_1.field)(option);
    throw new index_1.FlqError(`methods.from: 不受支持的参数类型:${JSON.stringify(option)}`);
}
exports.from = from;
function field(option) {
    if (typeof option === 'string')
        return (0, index_1.field)(option);
    let r = [];
    if (Array.isArray(option)) {
        if (option.length < 2)
            throw new index_1.FlqError(`methods.field: 不受支持的参数类型:${JSON.stringify(option)}`);
        if (option.length === 2) {
            return (0, index_1.field)(option[0]) + ' as ' + (0, index_1.field)(option[1]);
        }
        else {
            return (0, index_1.field)(option[0]) + '.' + (0, index_1.field)(option[1]) + ' as ' + (0, index_1.field)(option[2]);
        }
    }
    if (typeof option === 'object') {
        let r = [];
        for (const key in option) {
            const e = option[key];
            let f;
            if (typeof e === 'object') {
                //@ts-ignore
                f = e.from ? (0, index_1.field)(e.from, key) : (0, index_1.field)(key);
                if (e.met)
                    f = `${e.met.toUpperCase()}(${f})`;
                //@ts-ignore
                if (e.as)
                    f = f + ' as ' + (0, index_1.field)(e.as);
            }
            else {
                //@ts-ignore
                f = (0, index_1.field)(key) + ' as ' + e;
            }
            r.push(f);
        }
        return r.join(', ');
    }
    throw new index_1.FlqError(`methods.field: 不受支持的参数类型:${JSON.stringify(option)}`);
}
exports.field = field;
function where(option, op = 'AND') {
    if (typeof option === 'string')
        return option;
    if (Array.isArray(option)) {
        if (option.length < 2)
            throw new index_1.FlqError(`methods.field: 不受支持的参数类型:${JSON.stringify(option)}`);
        if (option.length === 2) {
            return (0, index_1.field)(option[0]) + ' = ' + (0, index_1.escape)(option[1]);
        }
        else {
            let op = option[1];
            if (!compOpers.includes(op))
                throw new index_1.FlqError(`methods.field: 不受支持的比较运算符:"${option[1]}"`);
            if (op === 'between')
                return `${(0, index_1.field)(option[0])} BETWEEN ${(0, index_1.escape)(option[2])} AND ${(0, index_1.escape)(option[3])}`;
            //@ts-ignore
            op = op.toUpperCase();
            return `${(0, index_1.field)(option[0])} ${op} ${(0, index_1.escape)(option[2])}`;
        }
    }
    if (typeof option === 'object') {
        const ws = [];
        for (const key in option) {
            //@ts-ignore
            const value = option[key];
            if (value === undefined)
                continue;
            let k = `\`${key}\``;
            if (value instanceof Array) {
                ws.push(`(${value.map((a) => `${k} = ${(0, index_1.escape)(a)}`).join(' OR ')})`);
                continue;
            }
            ws.push(`${k} = ${(0, index_1.escape)(value)}`);
        }
        return ws.join(' ' + op + ' ');
    }
    throw new index_1.FlqError(`methods.where: 不受支持的参数类型:${JSON.stringify(option)}`);
}
exports.where = where;
function order(param) {
    if (typeof param === 'string')
        return param;
    if (param === undefined)
        return '';
    const sql = 'ORDER BY ';
    const arr = [];
    if (typeof param !== 'object')
        throw new index_1.FlqError('order 参数必须为对象');
    for (const key in param) {
        const val = param[key];
        arr.push(`\`${key}\`${typeof val === 'string' ? ' ' + val : ''}`);
    }
    return sql + arr.join(',');
}
exports.order = order;
function limit(param) {
    if (typeof param === 'string')
        return param;
    if (param === undefined)
        return '';
    if (typeof param === 'number') {
        if (param % 1 === 0 && param > 0)
            return `LIMIT ${param}`;
        throw new index_1.FlqError('limit: 分页参数必须为正整数');
    }
    if (param instanceof Array) {
        const [lim, off] = param;
        if (lim % 1 === 0 && off % 1 === 0 && lim > 0 && off && off > 0)
            return `LIMIT ${param[0]}, ${param[1]}`;
        throw new index_1.FlqError('limit: 分页参数必须为正整数');
    }
    if (typeof param === 'object') {
        const { page = 1, size = 10 } = param;
        if (page % 1 === 0 && size % 1 === 0 && page > 0 && size > 0) {
            return `LIMIT ${(page - 1) * size}, ${size}`;
        }
        throw new index_1.FlqError('limit: 分页参数必须为正整数');
    }
    throw new index_1.FlqError('limit: 不受支持的参数类型');
}
exports.limit = limit;
function value(param) {
    if (typeof param === 'string')
        return param;
    if (param instanceof Array) {
        return `VALUES (${param.map((a) => (0, index_1.escape)(a)).join(', ')})`;
    }
    if (typeof param === 'object') {
        const key = [];
        const value = [];
        for (const k in param) {
            key.push('`' + k + '`');
            value.push((0, index_1.escape)(param[k]));
        }
        return `(${key.join(', ')}) VALUES (${value.join(', ')})`;
    }
    throw new index_1.FlqError('value: 不受支持的参数类型');
}
exports.value = value;
function set(param) {
    if (typeof param === 'string')
        return param;
    if (typeof param === 'object') {
        const r = [];
        for (const k in param) {
            const v = param[k];
            if (v === undefined)
                continue;
            r.push(`\`${k}\` = ${(0, index_1.escape)(param[k])}`);
        }
        return r.join(', ');
    }
    throw new index_1.FlqError('set: 不受支持的参数类型');
}
exports.set = set;
//# sourceMappingURL=methods.js.map