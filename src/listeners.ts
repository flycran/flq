import {HooksEventParam, PromiseSet} from './types'
import {Flq, hooks} from './index'
import {foundRows, insertId} from './templates'

/**预处理 */
export const pretreat = {
  async pretreat(option: HooksEventParam.Petreat) {
    hooks.emit('pretreat', option)
    const {flq, row} = option
    for (const key in row) {
      const mod = getModel(flq, key)
      if (!mod) continue
      hooks.emit('fieldPretreat', {})
    }
  }
}

/**后处理 */
export const postreat = {
  async postreat(option: HooksEventParam.Postreat) {
    const {flq, data} = option
    const {traversal} = flq.option
    if (!Array.isArray(data)) return
    const {model: mod, fieldMap} = flq
    if (!mod) return
    // 模型映射关系
    const modMap: Map<string, string> = new Map()
    /**获取样本数据 */
    const ond = data[0]
    if (ond) {
      /**字段数组 */
      const fields = Object.keys(ond)
      fields.forEach((f) => {
        const map = fieldMap.field[f]
        if (!map) return
        const m1: any = mod[map[0]]
        if (!m1) return
        const m2 = m1[map[1]]
        if (m2) modMap.set(f, m2)
      })
    }
    // 映射表为空且没有强制遍历
    if (!modMap.size && !traversal) return
    const ps: PromiseSet = new Set()
    // 遍历数据
    data.forEach((row: any) => {
      ps.add(hooks.emit('rowPostreat', {flq, row}))
      // 遍历字段映射表
      modMap.forEach((model, key) => {
        const value = row[key]
        ps.add(hooks.emit('fieldPostreat', {flq, model, key, value, row}))
      })
    })
    await Promise.all(ps)
  },
  async insertId({flq, data, connect}: HooksEventParam.Postreat) {
    if (!flq.option.insertId) return
    if (Array.isArray(data)) return
    const d = await flq.query(insertId, connect)
    data.insertId = Object.values(d[0])[0]
  },
  async foundRows({flq, data, connect}: HooksEventParam.Postreat) {
    if (!flq.option.foundRows) return
    if (!Array.isArray(data)) return
    const d = await flq.query(foundRows, connect)
    flq.total = Object.values(d[0])[0] as number
  },
}

export const rowPostreat = {
  async virtualGet({row, flq}: HooksEventParam.RowPostreat) {
    if (!flq.option.virtualGet) return
    const {
      option: {virtualGet},
      model,
    } = flq
    const ps: PromiseSet = new Set()
    for (let vfi = 0; vfi < virtualGet.length; vfi++) {
      const vf = virtualGet[vfi]
      const mod = getModel(flq, vf)
      // 找不到模型
      if (!mod || !mod.get) {
        console.log(`Warning!rowPostreatHooks.virtualGet:找不到虚拟字段"${vf}"的定义`)
        continue
      }
      ps.add(
        new Promise((e, r) => {
          row[vf] = mod.get!.call(flq, row)
        })
      )
    }
    await Promise.all(ps)
  },
  async subField({row, flq}: HooksEventParam.RowPostreat) {
    if (!flq.option.subField) return
    const {
      option: {subField},
      model,
    } = flq
  },
}

export const fieldPostreat = {
  toArray({model, key, value, row}: HooksEventParam.FieldPostreat) {
    if (!model.toArray) return
    if (!value) return (row[key] = [])
    row[key] = value.split(',')
  },
  async postreat({flq, model, key, value, row}: HooksEventParam.FieldPostreat) {
    if (!model.postreat) return
    row[key] = await model.postreat.call(flq, value, row)
  },
}

function getModel(flq: Flq, vf: string) {
  const {
    fieldMap: {table},
    model,
  } = flq
  const ont = table[0]
  if (ont) {
    return model![ont][vf]
  }
  const fs = vf.split('.')
  if (fs.length > 1) {
    return model![fs[0]][fs[1]]
  }
  for (let ti = 0; ti < table.length; ti++) {
    const t = table[ti]
    const n = model![t]
    if (!n) continue
    const m = n[vf]
    if (m) return m
  }
}
