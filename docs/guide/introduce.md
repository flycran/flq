# 简介

FLQ是一个基于mysql2的步进式数据库交互框架。

最初受到`MongoDB`的启发，为什么不能让查关系数据库像非关系数据库那样简单呢？于是便有了FLQ的前身：`flysql`。但后来我意识到`flysql`的语法过于简陋，于是我改进了它，并首次提出了“步进式配置”的思想，在此基础上提供了“模型配置”，并予以“应用层”的解决方案，最终诞生了`FLQ`

### FLQ的核心功能

- **字段映射**
- **预处理/后处理**
- **异步订阅**
- **虚拟字段**
- **子查询**
- **递归查询**

## 相关链接

[![Fork me on Gitee](https://gitee.com/cffh/flq/widgets/widget_3.svg?color=e6843a)](https://gitee.com/cffh/flq)

[Github](https://github.com/cffhidol/flq)