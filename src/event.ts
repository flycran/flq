// 异步事件订阅
/**异步事件 */
export class AsyncEvent {
  listener: Map<string, Set<Function>> = new Map()
  on(type: string, listener: Function) {
    const { listener: ls } = this
    const l = ls.get(type)
    if (!l) ls.set(type, new Set([listener]))
    else l.add(listener)
  }
  off(type: string, listener: Function) {
    const { listener: ls } = this
    const l = ls.get(type)
    if (!l) return false
    return l.delete(listener)
  }
  emit(type: string, ...events: any[]) {
    return new Promise((e, r) => {
      const ls = this.listener.get(type)
      if (!ls) return
      const als: Set<Promise<any>> = new Set()
      ls.forEach((e) => {
        const r = e(...events)
        if (r instanceof Promise) als.add(r)
      })
      Promise.all(als)
        .then((d) => {
          e(d)
        })
        .catch((d) => {
          r(d)
        })
    })
  }
}
