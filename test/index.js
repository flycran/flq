"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const flq = new lib_1.Flq({
    pool: true,
    user: 'root',
    password: process.env.SQLPASSWORD,
    database: 'test', // 数据库名
}, {
    student: {
        name: {
            async postreat(value, data) {
                return '名字:' + value;
            },
        },
        association: {
            toArray: true,
        },
        age: {
            pretreat(value, data) {
                console.log(value);
                if (value < 12)
                    return 12;
                return value;
            },
        },
    },
});
flq.test(async () => {
    // const db = flq.from('student').field('name', 'association')
    // const result = await db.find()
    // console.log(db.sql)
    // console.log(result)
    const db = flq.from('student').where({ id: 8 }).set({ age: 10 });
    const result = await db.update();
    console.log(db.sql);
    console.log(result);
});
