import { PromiseSet, EventParam } from './types'
import { Flq } from './index'
import { insertId, foundRows } from './templates'

export const postreatHooks = {
  async insertId({ flq, data, connect }: EventParam.PostreatEvent) {
    if (!flq.option.insertId) return
    if (Array.isArray(data)) return
    const d = await flq.query(insertId, connect)
    data.insertId = Object.values(d[0])[0]
  },
  async foundRows({ flq, data, connect }: EventParam.PostreatEvent) {
    if (!flq.option.foundRows) return
    if (!Array.isArray(data)) return
    const d = await flq.query(foundRows, connect)
    flq.total = Object.values(d[0])[0]
  },
}

function getModel(flq: Flq, vf: string) {
  const {
    fieldMap: { table },
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

export const rowPostreatHooks = {
  async virtualGet({ row, flq }: EventParam.RowPostreatEvent) {
    if (!flq.option.virtualGet) return
    const {
      option: { virtualGet },
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
  async subField({ row, flq }: EventParam.RowPostreatEvent) {
    if (!flq.option.subField) return
    const {
      option: { subField },
      model,
    } = flq
  },
}

export const fieldPostreatHooks = {
  toArray({ model, field, value, row }: EventParam.ModelPostreatEvent) {
    if (!model.toArray) return
    if (!value) return (row[field] = [])
    row[field] = value.split(',')
  },
  async postreat({ flq, model, field, value, row }: EventParam.ModelPostreatEvent) {
    if (!model.postreat) return
    const nv = await model.postreat.call(flq, value, row)
    row[field] = nv
  },
}
