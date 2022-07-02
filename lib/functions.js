"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const presetFunctionMap = {
    f: index_1.field,
    v: index_1.escape,
};
/**
 * 预处理方法
 * @param model 模型字符串 f代表字段,v代表值
 * @returns
 */
function presetFunction(name, model) {
    return (...ages) => {
        const ar = [];
        if (!model)
            return name + '()';
        for (let i = 0; i < ages.length; i++) {
            ar.push(presetFunctionMap[model[i]](ages[i]));
        }
        return `${name}(${ar.join(', ')})`;
    };
}
/**函数表 */
exports.default = module.exports = {
    /**
     * 平均值
     * @param {string} 字段
     */
    avg: presetFunction('AVG', 'f'),
    /**
     * 计次
     * @param {string} 字段
     */
    count: presetFunction('COUNT', 'f'),
    /**
     * 最大值
     * @param {string} 字段
     */
    max: presetFunction('MAX', 'f'),
    /**
     * 最小值
     * @param {string} 字段
     */
    min: presetFunction('MIN', 'f'),
    /**
     * 求和
     * @param {string} 字段
     */
    sum: presetFunction('SUM', 'f'),
    /**
     * 绝对值
     * @param {string} 字段
     */
    abs: presetFunction('ABS', 'f'),
    /**
     * 向下取整
     * @param {string} 字段
     */
    floor: presetFunction('FLOOR', 'f'),
    /**
     * 向上取整
     * @param {string} 字段
     */
    ceil: presetFunction('CEIL', 'f'),
    /**
     * 取模
     * @param {string} 字段
     * @param {any} 值
     */
    mod: presetFunction('MOD', 'fv'),
    /**
     * 随机数
     */
    rand: presetFunction('RAND'),
    /**
     * 四舍五入
     * @param {string} 字段
     * @param {any} 值
     */
    round: presetFunction('ROUND', 'fv'),
    /**
     * 截取数值
     * @param {string} 字段
     * @param {any} 值
     */
    truncate: presetFunction('TRUNCATE', 'fv'),
    /**
     * 当前时间
     */
    curdate: presetFunction('CURDATE'),
    /**
     * 当前时间
     */
    current_date: presetFunction('CURRENT_DATE'),
    /**
     * 当前日期
     */
    curtime: presetFunction('CURTIME'),
    /**
     * 当前日期
     */
    current_time: presetFunction('CURRENT_TIME'),
    /**
     * 当前日期时间
     */
    now: presetFunction('NOW'),
    /**
     * 获取年份
     * @param {string} 字段
     */
    year: presetFunction('YEAR', 'f'),
    /**
     * 获取月份
     * @param {string} 字段
     */
    month: presetFunction('MONTH', 'f'),
    /**
     * 获取月份
     * @param {string} 字段
     */
    monthname: presetFunction('MONTHNAME', 'f'),
    /**
     * 获取周数
     * @param {string} 字段
     */
    week: presetFunction('WEEK', 'f'),
    /**
     * 获取小时数
     * @param {string} 字段
     */
    hour: presetFunction('HOUR', 'f'),
    /**
     * 获取分钟数
     * @param {string} 字段
     */
    minute: presetFunction('MINUTE', 'f'),
    /**
     * 获取周几
     * @param {string} 字段
     */
    weekday: presetFunction('WEEKDAY', 'f'),
    /**
     * 获取周几
     * @param {string} 字段
     */
    dayname: presetFunction('DAYNAME', 'f'),
    /**
     * 转小写
     * @param {string} 字段
     */
    lcase: presetFunction('LCASE', 'f'),
    /**
     * 转大写
     * @param {string} 字段
     */
    ucase: presetFunction('UCASE', 'f'),
    /**
     * 计算长度
     * @param {string} 字段
     */
    length: presetFunction('LENGTH', 'f'),
    /**
     * 计算长度
     * @param {string} 字段
     */
    char_length: presetFunction('CHAR_LENGTH', 'f'),
    /**
     * 返回字符串p0的后p1个字符 */
    right: presetFunction('RIGHT', 'fv'),
    /**
     * 返回字符串p0的前p1个字符
     * @param {string} 字段
     * @param {any} 值
     */
    left: presetFunction('LEFT', 'fv'),
    /**截取字符串
     * @param {string} 字段
     * @param {any} 值
     * @param {any} 值
     */
    mid: presetFunction('MID', 'fvv'),
    /**
     * 返回字符串p0从第p1个字符截取到第p2个字符
     * @param {string} 字段
     * @param {any} 值
     * @param {any} 值
     */
    substring_index: presetFunction('SUBSTRING_INDEX', 'fvv'),
    /**
     * 替换
     * @param {string} 字段
     * @param {any} 值
     * @param {any} 值
     */
    replace: presetFunction('REPLACE', 'fvv'),
    /**
     * 从逗号分隔查询
     * @param {any} 值
     * @param {string} 字段
     */
    find_in_set: presetFunction('FIND_IN_SET', 'vf'),
};
//# sourceMappingURL=functions.js.map