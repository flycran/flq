interface A<T = any> {
  type: T
  get?: (p: T) => void
}

function af(p: { [x: string]: ReturnType<(<T>(p: A<T>) => A<T>)> }) {
}

function apf<T>(p: A<T> ) {
  return p
}

af({
  a: {
    type: 'a',
    get(v) {

    },
  },
  b: {
    type: 1,
    get(v) {

    },
  }
})

