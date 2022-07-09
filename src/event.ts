// 异步事件订阅
import { PromiseSet } from './types'
/**异步事件 */
export class AsyncEvent {
  listener: Map<string, Set<Function>> = new Map()
  on(type: string, listener: Function) {
    const { listener: ls } = this
    const l = ls.get(type)
    if (!l) ls.set(type, new Set([listener]))
    else l.add(listener)
    this.emit('addlistener', { type, listener })
  }
  off(type: string, listener: Function) {
    const { listener: ls } = this
    const l = ls.get(type)
    if (!l) return false
    this.emit('removelistener', { type, listener })
    return l.delete(listener)
  }
  async emit(type: string, ...events: any[]) {
    let date = new Date()
    const ls = this.listener.get(type)
    if (!ls) return
    const als: Set<Promise<any>> = new Set()
    await AsyncErgodic(ls, (e) => {
      const r = e(...events)
      if (r instanceof Promise) als.add(r)
    })
    console.log(
      `emit: ${type} It took ${new Date().valueOf() - date.valueOf()}ms`
    )
  }
}
// Array
export async function AsyncErgodic<T>(
  data: T[],
  callBack: (value: T, index: number, data: T[]) => void
): Promise<void>
// Map
export async function AsyncErgodic<V, K>(
  data: Map<K, V>,
  callBack: (value: V, key: K, data: Map<K, V>) => void
): Promise<void>
// Set
export async function AsyncErgodic<T>(
  data: Set<T>,
  callBack: (value: T, key: T, data: Set<T>) => void
): Promise<void>
// Object
export async function AsyncErgodic<T extends Object>(
  data: T,
  callBack: (value: keyof T, key: string, data: T) => void
): Promise<void>
// 实现
export async function AsyncErgodic(
  data: any,
  callBack: Function
): Promise<void> {
  const ps: PromiseSet = new Set()
  if ('forEach' in data) {
    data.forEach((a: any, b: any, c: any) => {
      ps.add(callBack(a, b, c))
    })
  } else {
    for (const k in data) {
      ps.add(callBack(data[k], k, data))
    }
  }
  await Promise.all(ps)
}
