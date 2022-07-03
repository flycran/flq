const { AsyncEvent } = require('../lib/event')
const e = new AsyncEvent()
function awaitTime(time) {
  return new Promise((e) => {
    setTimeout(e, time)
  })
}
e.on('a', () => {
  console.log('s1')
})
e.on('a', () => {
  console.log('s2')
})
e.on('a', async () => {
  console.log('a0')
})
e.on('a', async () => {
  await awaitTime(100)
  console.log('a1')
})
e.on('a', async () => {
  await awaitTime(300)
  console.log('a2')
})
e.on('a', async () => {
  await awaitTime(200)
  console.log('a3')
})
e.on('a', () => {
  console.log('s3')
})
e.emit('a').then(() => {
  console.log('完成');
})
