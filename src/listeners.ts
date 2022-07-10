import { HooksEvent, PromiseSet } from './types'
import { Flq, hooks } from './index'
import { foundRows, insertId } from './templates'

/**预处理 */
export const pretreat = {
  async pretreat(option: HooksEvent.Petreat) {
    const { flq, row } = option
    if (!flq.model) return
    const ps: PromiseSet = new Set()
    const model = flq.model[flq.fieldMap.table[0]]
    for (const key in model) {
      const value = row[key]
      ps.add(
        hooks.emit('fieldPretreat', { flq, model: model[key], key, value, row })
      )
    }
    await Promise.all(ps)
  },
}
/**预处理数据字段 */
export const fieldPretreat = {
  async pretreat({ flq, model, key, value, row }: HooksEvent.FieldPetreat) {
    if (value === undefined) return
    if (!model.pretreat) return
    row[key] = await model.pretreat.call(flq, value, row)
  },
  async default({ flq, model, key, value, row }: HooksEvent.FieldPetreat) {
    if (value !== undefined) return
    if (model.default === undefined) return
    if (flq.type !== 'insert') return
    if (typeof model.default === 'function') {
      row[key] = await model.default.call(flq, value, row)
    } else {
      row[key] = model.default
    }
  },
  async update({ flq, model, key, value, row }: HooksEvent.FieldPetreat) {
    if (value !== undefined) return
    if (model.update === undefined) return
    if (typeof model.update === 'function') {
      row[key] = await model.update.call(flq, value, row)
    } else {
      row[key] = model.update
    }
  },
  async virtualSet({ flq, model, key, row }: HooksEvent.FieldPetreat) {
    const { virtualSet } = flq.option
    if (!virtualSet) return
    if (!model.set) return
    const value = virtualSet[key]
    if (!value) return
    await model.set.call(flq, value, row)
  },
  toArray({ model, key, value, row }: HooksEvent.FieldPostreat) {
    if (value === undefined) return
    if (!model.toArray) return
    row[key] = value.split(
      typeof model.toArray === 'string' ? model.toArray : ','
    )
  },
}
/**后处理 */
export const postreat = {
  async postreat(option: HooksEvent.Postreat) {
    const { flq, data } = option
    if (!Array.isArray(data)) return
    const { model, fieldMap } = flq
    if (!model) return
    /**获取样本数据 */
    const ond = data[0]
    if (!ond) return
    /**字段数组 */
    const models: Set<any> = new Set()
    const ps: PromiseSet = new Set()
    // 循环后处理
    // 根据表格、字段映射和模型提取所有需要进行后处理的model
    for (let i = 0; i < fieldMap.table.length; i++) {
      const table = fieldMap.table[i]
      const mod = model[table]
      for (const k in mod) {
        const model = mod[k]
        const key = fieldMap.field[table + '.' + k] || k
        models.add({ model, key })
      }
    }
    // 遍历数据，触发后处理
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      models.forEach((option) => {
        ps.add(
          hooks.emit('fieldPostreat', {
            ...option,
            flq,
            value: row[option.key],
            row,
          })
        )
      })
    }
    await Promise.all(ps)
  },
  async insertId({ flq, data, connect }: HooksEvent.Postreat) {
    if (!flq.option.insertId) return
    if (Array.isArray(data)) return
    const d = await flq.query(insertId, connect)
    data.insertId = Object.values(d[0])[0]
  },
  async foundRows({ flq, data, connect }: HooksEvent.Postreat) {
    if (!flq.option.foundRows) return
    if (!Array.isArray(data)) return
    const d = await flq.query(foundRows, connect)
    flq.total = Object.values(d[0])[0] as number
  },
}
/**后处理数据列 */
export const rowPostreat = {}
/**后处理数据字段 */
export const fieldPostreat = {
  toArray({ model, key, value, row }: HooksEvent.FieldPostreat) {
    if (value === undefined) return
    if (!model.toArray) return
    if (!value) return (row[key] = [])
    row[key] = value.split(
      typeof model.toArray === 'string' ? model.toArray : ','
    )
  },
  async virtualGet({ flq, model, key, row }: HooksEvent.FieldPostreat) {
    const { virtualGet } = flq.option
    if (!virtualGet) return
    if (!model.get) return
    if (!virtualGet.includes(key)) return
    row[key] = await model.get.call(flq, row)
  },
  // async subField({ row, flq }: HooksEvent.FieldPostreat) {
  //   if (!flq.option.subField) return
  //   const {
  //     option: { subField },
  //     model,
  //   } = flq
  // },
  async rename({ flq, model, key, value, row }: HooksEvent.FieldPostreat) {
    if (!model.rename) return
    if (value === undefined) return
    let k = model.rename
    if (typeof k === 'function') k = await k.call(flq, key, value, row)
    row[k] = value
    delete row[key]
  },
  async postreat({ flq, model, key, value, row }: HooksEvent.FieldPostreat) {
    if (!model.postreat) return
    if (value === undefined) return
    row[key] = await model.postreat.call(flq, value, row)
  },
}
