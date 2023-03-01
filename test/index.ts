import { Table, Field } from '../src/index'

const user = new Table({
  //* 用户id
  userId: {
    type: 'varchar',
  },
  //* 用户名
  // name: {
  //   type: 'varchar',
  //   get(value) {
  //
  //   }
  // },
  // pass: {
  //   type: 'varchar',
  // },
})

const f = new Field({
  type: 'int'
})

const video = new Table({
  userId: user.fieldOptionSet.userId,
  user: {
    async get() {
      return await user.findOne()
    },
  },
  /** 阅读量 */
  read: {
    type: 'int',
  },
  //* 封面
  cover: {
    type: 'varchar',
  },
})

user.test(async () => {
  const a = await user.findOne()
  const b = await user.update({})
})

video.test(async () => {
  const a = await video.findOne()
  // video.update()
})
