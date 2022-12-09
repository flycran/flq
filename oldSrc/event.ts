// 异步事件订阅
import {PromiseSet} from './types'

/**异步事件 */
export class AsyncEvent {
  listener: Map<string, Set<Function>> = new Map()

  on(type: string, listener: Function) {
    const {listener: ls} = this
    const l = ls.get(type)
    if (!l) ls.set(type, new Set([listener]))
    else l.add(listener)
    this.emit('addlistener', {type, listener})
  }

  off(type: string, listener: Function) {
    const {listener: ls} = this
    const l = ls.get(type)
    if (!l) return false
    this.emit('removelistener', {type, listener})
    return l.delete(listener)
  }

  async emit(type: string, ...events: any[]) {
    // let date = new Date()
    const ls = this.listener.get(type)
    if (!ls) return
    await AsyncErgodic(ls, (e) => e(...events))
  }
}

// Array
export function AsyncErgodic<T, R>(
  data: T[],
  callBack: (value: T, index: number, data: T[]) => R
): Promise<R[]>
// Map
export function AsyncErgodic<V, K, R>(
  data: Map<K, V>,
  callBack: (value: V, key: K, data: Map<K, V>) => R
): Promise<R[]>
// Set
export function AsyncErgodic<T, R>(
  data: Set<T>,
  callBack: (value: T, key: T, data: Set<T>) => R
): Promise<R[]>
// Object
export function AsyncErgodic<T, K extends keyof T, R>(
  data: T,
  callBack: (value: T[K], key: K, data: T) => R
): Promise<R[]>
// 实现
export async function AsyncErgodic<R>(
  data: any,
  callBack: Function
): Promise<any[]> {
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
  return await Promise.all(ps)
}
