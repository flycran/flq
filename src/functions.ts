// sql方法
import { escape, field, Sql, methods } from './index'
import { WhereOption, Dbany } from './types'

const presetFunctionMap: Record<string, Function> = {
  f: field,
  v: escape,
}
/**
 * 预处理方法
 * @param model 模型字符串 f代表字段,v代表值
 * @returns
 */
function presetFunction(name: string, model?: string): (...ages: any[]) => Sql {
  return (...ages: any[]) => {
    const ar = []
    if (!model) return new Sql(name + '()')
    for (let i = 0; i < ages.length; i++) {
      ar.push(presetFunctionMap[model[i]](ages[i]))
    }
    return new Sql(`${name}(${ar.join(', ')})`)
  }
}
/**括号 */
export function brackets(
  option: WhereOption,
  operator: WhereOption.Operator = 'AND'
): Sql {
  return new Sql(`(${methods.where(option, operator)})`)
}

/**操作符 */
export function compare(
  field: string | Sql,
  comparator: 'BETWEEN',
  value0: Sql | Dbany,
  value1: Sql | Dbany
): Sql
export function compare(
  field: string | Sql,
  comparator: WhereOption.Comparator,
  value: Sql | Dbany
): Sql
export function compare(
  fie: string | Sql,
  com: WhereOption.Comparator,
  v0: Sql | Dbany,
  v1?: Sql | Dbany
): Sql {
  if (com === '!=') com = '<>'
  return new Sql(
    `${field(fie)} ${com.toUpperCase()} ${escape(v0)}${
      com === 'BETWEEN' ? ` AND ${escape(v1)}` : ''
    }`
  )
}

// export function avg(fie: Sql | string) {
//   return `AVG(${field(fie)})`
// }

/**函数表 */
/**
 * 平均值
 * @param {string} 字段
 */
export const avg = presetFunction('AVG', 'f')
/**
 * 计次
 * @param {string} 字段
 */
export const count = presetFunction('COUNT', 'f')
/**
 * 最大值
 * @param {string} 字段
 */
export const max = presetFunction('MAX', 'f')
/**
 * 最小值
 * @param {string} 字段
 */
export const min = presetFunction('MIN', 'f')
/**
 * 求和
 * @param {string} 字段
 */
export const sum = presetFunction('SUM', 'f')
/**
 * 绝对值
 * @param {string} 字段
 */
export const abs = presetFunction('ABS', 'f')
/**
 * 向下取整
 * @param {string} 字段
 */
export const floor = presetFunction('FLOOR', 'f')
/**
 * 向上取整
 * @param {string} 字段
 */
export const ceil = presetFunction('CEIL', 'f')
/**
 * 取模
 * @param {string} 字段
 * @param {any} 值
 */
export const mod = presetFunction('MOD', 'fv')
/**
 * 随机数
 */
export const rand = presetFunction('RAND')
/**
 * 四舍五入
 * @param {string} 字段
 * @param {any} 值
 */
export const round = presetFunction('ROUND', 'fv')
/**
 * 截取数值
 * @param {string} 字段
 * @param {any} 值
 */
export const truncate = presetFunction('TRUNCATE', 'fv')
/**
 * 当前时间
 */
export const curdate = presetFunction('CURDATE')
/**
 * 当前时间
 */
export const current_date = presetFunction('CURRENT_DATE')
/**
 * 当前日期
 */
export const curtime = presetFunction('CURTIME')
/**
 * 当前日期
 */
export const current_time = presetFunction('CURRENT_TIME')
/**
 * 当前日期时间
 */
export const now = presetFunction('NOW')
/**
 * 获取年份
 * @param {string} 字段
 */
export const year = presetFunction('YEAR', 'f')
/**
 * 获取月份
 * @param {string} 字段
 */
export const month = presetFunction('MONTH', 'f')
/**
 * 获取月份
 * @param {string} 字段
 */
export const monthname = presetFunction('MONTHNAME', 'f')
/**
 * 获取周数
 * @param {string} 字段
 */
export const week = presetFunction('WEEK', 'f')
/**
 * 获取小时数
 * @param {string} 字段
 */
export const hour = presetFunction('HOUR', 'f')
/**
 * 获取分钟数
 * @param {string} 字段
 */
export const minute = presetFunction('MINUTE', 'f')
/**
 * 获取周几
 * @param {string} 字段
 */
export const weekday = presetFunction('WEEKDAY', 'f')
/**
 * 获取周几
 * @param {string} 字段
 */
export const dayname = presetFunction('DAYNAME', 'f')
/**
 * 转小写
 * @param {string} 字段
 */
export const lcase = presetFunction('LCASE', 'f')
/**
 * 转大写
 * @param {string} 字段
 */
export const ucase = presetFunction('UCASE', 'f')
/**
 * 计算长度
 * @param {string} 字段
 */
export const length = presetFunction('LENGTH', 'f')
/**
 * 计算长度
 * @param {string} 字段
 */
export const char_length = presetFunction('CHAR_LENGTH', 'f')
/**
 * 返回字符串p0的后p1个字符 */
export const right = presetFunction('RIGHT', 'fv')
/**
 * 返回字符串p0的前p1个字符
 * @param {string} 字段
 * @param {any} 值
 */
export const left = presetFunction('LEFT', 'fv')
/**截取字符串
 * @param {string} 字段
 * @param {any} 值
 * @param {any} 值
 */
export const mid = presetFunction('MID', 'fvv')
/**
 * 返回字符串p0从第p1个字符截取到第p2个字符
 * @param {string} 字段
 * @param {any} 值
 * @param {any} 值
 */
export const substring_index = presetFunction('SUBSTRING_INDEX', 'fvv')
/**
 * 替换
 * @param {string} 字段
 * @param {any} 值
 * @param {any} 值
 */
export const replace = presetFunction('REPLACE', 'fvv')
/**
 * 从逗号分隔查询
 * @param {any} 值
 * @param {string} 字段
 */
export const find_in_set = presetFunction('FIND_IN_SET', 'vf')
