# 更新日志

本页可能不会记录所有的版本，详情请前往[npm ![npm type version](https://badgen.net/npm/v/flq)](https://www.npmjs.com/package/flq)

## v0.2.6

- * 移除`where`、`set`等方法的自动克隆，（`from`方法依然保留自动克隆），`find`、findRows`、`count`等查询方法允许传入与`where`同等参数，`add`允许传入`value`同等参数，`update`允许传入`set`同等参数
- * 添加自增方法
- * 添加模糊查询方法

- 修复缺少部分表模型导致的内部异常

## v0.2.0

- 重写模型处理的核心逻辑

- `Flq`新增实例方法`insert`、`getList`、`setlist`、`sliceList`、`insertList`、`recursion`

- 新增模型选项`indexField`、`gradeField`、`parentField`、`childField`

## v0.1.0

完成的完整的`where`配置方法，以及完善剩余的模型选项。
至此Flq已经可以投入使用，但还不是正式版本。

## v0.0.11

重构后处理的触发逻辑，移除`RowPostreat`事件，并完成虚拟get的基本测试

## v0.0.10

完成预处理的实现，至此已完成模型的基础功能

## v0.0.9

优化了`Model`的部分声明

## v0.0.8

修复引入文件指向错误
