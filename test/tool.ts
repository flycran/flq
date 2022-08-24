export const awaitTime = (time: number, text: any) => new Promise((resolve) => {
  setTimeout(() => {
    console.log(text)
    resolve(null)
  }, time)
})