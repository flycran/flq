function defineTable() {
  return (0 as any)
}

interface Type {
  int: number
  float: number
  double: number
  real: number
  decimal: number
  numeric: number
  date: string
  time: string
  datetime: string
  year: string
  char: string
  varchar: string
  text: number
}

interface Model {
  type: keyof Type
  length: number
}