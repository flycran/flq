// sql方法
import {escape, field as $field, FlqError, methods, Sql} from './index'
import {Dbany, Operator, WhereOption} from './types'

/**括号 */
export function brac(
  option: WhereOption,
  connector?: WhereOption.Connector,
  comparator?: WhereOption.Comparator
): Sql {
  if (option instanceof Sql) return new Sql(`(${option.sql})`)
  return new Sql(`(${methods.where(option, connector, comparator)})`)
}

const { arrVal, noVal } = methods

/**比较符 */
export function comp(
  field: string | Sql,
  comparator: 'BETWEEN',
  value0: Sql | Dbany,
  value1: Sql | Dbany
): Sql
export function comp(field: string | Sql, comparator: WhereOption.NoVal): Sql
export function comp(
  field: string | Sql,
  comparator: WhereOption.ArrVal,
  value: Dbany[]
): Sql
export function comp(
  field: string | Sql,
  comparator: WhereOption.Comparator,
  value: Sql | Dbany
): Sql
export function comp(
  fie: string | Sql,
  com: WhereOption.Comparator,
  v0?: Sql | Dbany | Dbany[],
  v1?: Sql | Dbany
): Sql {
  const pk = $field(fie)
  // 操作符不需要传入
  if (noVal.has(com)) {
    return new Sql(`${pk} ${com}`)
  }
  // 操作符要求传入数组
  if (arrVal.has(com)) {
    if (!Array.isArray(v0))
      throw new FlqError(
        `methods.where: 不受支持的参数类型:${JSON.stringify(v0)}`
      )
    return new Sql(`${pk} ${com} (${v0.map((e) => escape(e)).join(', ')})`)
  }
  // 操作符是BETWEEN
  if (com === 'BETWEEN') {
    return new Sql(`${pk} ${com} ${escape(v0)} AND ${escape(v1)}`)
  }
  // 操作符要求传入任意值
  return new Sql(`${pk} ${com} ${escape(v0)}`)
}

const opors = new Set(['+', '-', '*', '/', '%'])

/**运算符 */
export function oper(...param: (Operator | Sql | string | number)[]): Sql {
  const sql = param
    .map((e) => {
      if (e instanceof Sql) return `(${e.sql})`
      //@ts-ignore
      if (opors.has(e)) return e
      if (typeof e === 'string') return $field(e)
      return Number(e)
    })
    .join(' ')
  return new Sql(sql)
}
/**自定义方法 */
export function method(name: string, ...params: any[]) {
  return new Sql(`${name}(${params.map((e) => escape(e)).join(', ')})`)
}

/**判断 */
export function IF(field: Sql | string, yes: Sql | Dbany, no: Sql | Dbany) {
  return new Sql(`IF(${$field(field)}, ${escape(yes)}, ${escape(no)})`)
}

/**平均值 */
export function AVG(field: Sql | string): Sql {
  return new Sql(`AVG(${$field(field)})`)
}
/**计次 */
export function COUNT(field: Sql | string): Sql {
  return new Sql(`COUNT(${$field(field)})`)
}
/**最大值 */
export function MAX(field: Sql | string): Sql {
  return new Sql(`MAX(${$field(field)})`)
}
/**最小值 */
export function MIN(field: Sql | string): Sql {
  return new Sql(`MIN(${$field(field)})`)
}
/**求和 */
export function SUM(field: Sql | string): Sql {
  return new Sql(`SUM(${$field(field)})`)
}
/**绝对值 */
export function ABS(field: Sql | string): Sql {
  return new Sql(`ABS(${$field(field)})`)
}
/**向下取整 */
export function FLOOR(field: Sql | string): Sql {
  return new Sql(`FLOOR(${$field(field)})`)
}
/**向上取整 */
export function CEIL(field: Sql | string): Sql {
  return new Sql(`CEIL(${$field(field)})`)
}
/**取模 */
export function MOD(field: Sql | string, value: Sql | Dbany) {
  return new Sql(`MOD(${$field(field)}, ${escape(value)})`)
}
/**随机数 */
export function RAND(): Sql {
  return new Sql(`RAND()`)
}
/**四舍五入 */
export function ROUND(field: Sql | string, value: Sql | Dbany) {
  return new Sql(`ROUND(${$field(field)}, ${escape(value)})`)
}
/**截取数值 */
export function TRUNCATE(field: Sql | string, value: Sql | Dbany) {
  return new Sql(`TRUNCATE(${$field(field)}, ${escape(value)})`)
}
/**当前时间 */
export function CURDATE(): Sql {
  return new Sql(`CURDATE()`)
}
/**当前时间 */
export function CURRENT_DATE(): Sql {
  return new Sql(`CURRENT_DATE()`)
}
/**当前日期 */
export function CURTIME(): Sql {
  return new Sql(`CURTIME()`)
}
/**当前日期 */
export function CURRENT_TIME(): Sql {
  return new Sql(`CURRENT_TIME()`)
}
/**当前日期时间 */
export function NOW(): Sql {
  return new Sql(`NOW()`)
}
/**获取年份 */
export function YEAR(field: Sql | string): Sql {
  return new Sql(`YEAR(${$field(field)})`)
}
/**获取月份 */
export function MONTH(field: Sql | string): Sql {
  return new Sql(`MONTH(${$field(field)})`)
}
/**获取月份 */
export function MONTHNAME(field: Sql | string): Sql {
  return new Sql(`MONTHNAME(${$field(field)})`)
}
/**获取周数 */
export function WEEK(field: Sql | string): Sql {
  return new Sql(`WEEK(${$field(field)})`)
}
/**获取小时数 */
export function HOUR(field: Sql | string): Sql {
  return new Sql(`HOUR(${$field(field)})`)
}
/**获取分钟数 */
export function MINUTE(field: Sql | string): Sql {
  return new Sql(`MINUTE(${$field(field)})`)
}
/**获取周几 */
export function WEEKDAY(field: Sql | string): Sql {
  return new Sql(`WEEKDAY(${$field(field)})`)
}
/**获取周几 */
export function DAYNAME(field: Sql | string): Sql {
  return new Sql(`DAYNAME(${$field(field)})`)
}
/**转小写 */
export function LCASE(field: Sql | string): Sql {
  return new Sql(`LCASE(${$field(field)})`)
}
/**转大写 */
export function UCASE(field: Sql | string): Sql {
  return new Sql(`UCASE(${$field(field)})`)
}
/**计算长度 */
export function LENGTH(field: Sql | string): Sql {
  return new Sql(`LENGTH(${$field(field)})`)
}
/**计算长度*/
export function CHAR_LENGTH(field: Sql | string): Sql {
  return new Sql(`CHAR_LENGTH(${$field(field)})`)
}
/**返回字符串p0的后p1个字符 */
export function RIGHT(field: Sql | string, value: Sql | Dbany) {
  return new Sql(`RIGHT(${$field(field)}, ${escape(value)})`)
}
/**返回字符串p0的前p1个字符 */
export function LEFT(field: Sql | string, value: Sql | Dbany) {
  return new Sql(`LEFT(${$field(field)}, ${escape(value)})`)
}
/**截取字符串 */
export function MID(
  field: Sql | string,
  value0: Sql | Dbany,
  value1: Sql | Dbany
) {
  return new Sql(`MID(${$field(field)}, ${escape(value0)}, ${escape(value1)})`)
}
/**返回字符串p0从第p1个字符截取到第p2个字符 */
export function SUBSTRING_INDEX(
  field: Sql | string,
  value0: Sql | Dbany,
  value1: Sql | Dbany
) {
  return new Sql(
    `SUBSTRING_INDEX(${$field(field)}, ${escape(value0)}, ${escape(value1)})`
  )
}
/**替换 */
export function REPLACE(
  field: Sql | string,
  value0: Sql | Dbany,
  value1: Sql | Dbany
) {
  return new Sql(
    `REPLACE(${$field(field)}, ${escape(value0)}, ${escape(value1)})`
  )
}
/**从逗号分隔查询 */
export function FIND_IN_SET(value0: Sql | Dbany, field: Sql | string) {
  return new Sql(`FIND_IN_SET(${escape(value0)}, ${$field(field)})`)
}
