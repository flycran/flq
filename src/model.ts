import { ModelOption } from './types'
import { Connection } from 'mysql2'
import { Flq, hooks } from './index'
import { Data } from './types'
import { insertId } from './templates'
/**预处理 */
export function pretreat(option: { flq: Flq; from: string; field: string; value: any }) {
  hooks.emit('pretreat', option)
  const { flq, from, field, value } = option
  const { model, fieldMap } = flq
}
/**后处理 */
export function postreat(option: PostreatEvent) {
  hooks.emit('postreat', option)
  const { flq, data, method, connect } = option
  console.log(data)
  if (!Array.isArray(data)) return
  const { model: mod, fieldMap } = flq
  if (!mod) return
  // 模型映射关系
  const modMap: Map<string, string> = new Map()
  /**获取样本数据 */
  const ond = data[0]
  // 没有样本数据
  if (!ond) return
  /**字段数组 */
  const fs = Object.keys(ond)
  fs.forEach((f) => {
    const map = fieldMap.field[f]
    if (!map) return
    const m1: any = mod[map[0]]
    if (!m1) return
    const m2 = m1[map[1]]
    if (m2) modMap.set(f, m2)
  })
  // 映射表为空
  if (!modMap.size) return
  // 遍历数据
  data.forEach((row: any, index: number) => {
    // 遍历字段映射表
    modMap.forEach((model, key) => {
      const value = row[key]
      hooks.emit('model-postreat', { model, key, value, row })
    })
  })
}

interface PostreatEvent {
  flq: Flq
  data: Data[] | Data
  method: string
  connect: Connection
}
interface ModelPostreatEvent {
  model: Partial<ModelOption.Ops>
  key: string
  value: any
  row: Record<string, any>
}

export const modelPostreatHooks = {
  toArray({ model, key, value, row }: ModelPostreatEvent) {
    if (!model.toArray) return
    if (!value) return (row[key] = [])
    row[key] = value.split(',')
  },
}
export const postreatHooks = {
  async insertId({ flq, data, connect }: PostreatEvent) {
    if (!flq.option.insertId) return
    if (Array.isArray(data)) return
    const d = await flq.query(insertId, connect)
    data.insertId = Object.values(d[0])[0]
  },
}

Object.values(modelPostreatHooks).forEach((e) => {
  hooks.on('model-postreat', e)
})
Object.values(postreatHooks).forEach((e) => {
  hooks.on('postreat', e)
})
