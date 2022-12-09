import { AsyncEvent } from '@flycran/async-lib'
import { Flq } from './index'

export interface HooksEvent {
  format: string
  pretreat: { flq: Flq, row: any }
  postreat: { flq: Flq, data: any, method: string, connect: any, }
  send: { data: any, method: string, option: any, sql: string }
}

/**钩子 */
export const hooks = new AsyncEvent<HooksEvent>()