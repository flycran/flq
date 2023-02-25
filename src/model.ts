import { AsyncErgodic } from '@flycran/async-lib'
import { hooks } from './index'
import { HooksEvent, ModelOption, ModelUse } from './types'

export type Option<T extends keyof ModelOption.Model> = { [K in keyof ModelUse<T>]?: (context: ModelUse<T>[K]) => void }

const models: Map<keyof ModelOption.Model, Option<any>> = new Map

export const use = <T extends keyof ModelOption.Model>(name: T, option: Option<T>) => {
  models.set(name, option)
}
// 注册预处理事件
hooks.on('pretreat', async (option: HooksEvent['petreat']) => {
  const {flq, row} = option
  const {model} = flq
  if (!model) return
  if (!flq.option.from) return
  const ms = model[flq.option.from[0]]
  if(!ms) return
  await AsyncErgodic(ms, (model, key) =>
    AsyncErgodic(model, (model, mkey) => {
      const call = models.get(mkey)?.fieldPetreat
      if (call) return call({
        flq,
        model,
        key,
        value: row[key],
        row
      })
    })
  )
})
// 注册后处理事件
hooks.on('postreat', async (option: HooksEvent['postreat']) => {
  const {flq, data} = option
  if (!Array.isArray(data)) return
  const {model} = flq
  // 没有模型
  if (!model) return
  // 没有数据
  if (!data[0]) return
  const {from} = flq.option
  // 没有表名
  if (!from) return
  let ms: Record<string, Partial<ModelOption.Model>>
  if (from.length === 1) {
    ms = model[from[0]]
  } else {
    ms = {}
    for (let i = 0; i < from.length; i++) {
      const m = model[from[i]]
      Object.assign(ms, m)
    }
  }
  if (!ms) return
  // 遍历数据，触发后处理
  await AsyncErgodic(data, (row) =>
    AsyncErgodic(ms, (model, key) =>
      AsyncErgodic(model, (model, mkey) => {
        const call = models.get(mkey)?.fieldPostreat
        if (call) return call({flq, model, key, value: row[key], row})
      })
    )
  )
})

// 预处理
use('pretreat', {
  async fieldPetreat({flq, model, key, value, row}) {
    if (value === undefined) return
    row[key] = await model.call(flq, value, row)
  }
})
// 设置默认值
use('default', {
  async fieldPetreat({flq, model, key, value, row}) {
    if (value !== undefined) return
    if (flq.type !== 'insert') return
    if (typeof model.default === 'function') {
      row[key] = await model.default.call(flq, value, row)
    } else {
      row[key] = model.default
    }
  }
})
// 更新默认值
use('update', {
  async fieldPetreat({flq, model, key, value, row}) {
    if (value !== undefined) return
    if (typeof model.update === 'function') {
      row[key] = await model.update.call(flq, value, row)
    } else {
      row[key] = model.update
    }
  }
})
// 虚拟设置
use('set', {
  async fieldPetreat({flq, model, key, row}) {
    const {virtualSet} = flq.option
    if (!virtualSet) return
    const value = virtualSet[key]
    if (!value) return
    await model.call(flq, value, row)
  }
})
// 转数组
use('toArray', {
  fieldPostreat({model, key, value, row}) {
    if (value === undefined) return
    row[key] = value.split(
      typeof model === 'string' ? model : ','
    )
  }
})
// 转数组
use('toArray', {
  fieldPostreat({model, key, value, row}) {
    if (value === undefined) return
    if (!value) return (row[key] = [])
    row[key] = value.split(
      typeof model === 'string' ? model : ','
    )
  }
})
// 虚拟获取
use('get', {
  async fieldPostreat({flq, model, key, row}) {
    const {virtualGet} = flq.option
    if (!virtualGet) return
    if (!(key in virtualGet)) return
    const r = await model.call(flq, row, virtualGet[key])
    if (r === undefined) return
    row[key] = r
  }
})
// 重命名
use('rename', {
  async fieldPostreat({flq, model, key, value, row}) {
    if (value === undefined) return
    let k = model
    if (typeof k === 'function') k = await k.call(flq, key, value, row)
    row[k] = value
    delete row[key]
  }
})
// 后处理
use('postreat', {
  async fieldPostreat({flq, model, key, value, row}) {
    if (value === undefined) return
    row[key] = await model.call(flq, value, row)
  }
})
