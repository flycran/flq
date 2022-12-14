# student

## 结构

```sql
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `gender` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '性别',
  `chinese` int NULL DEFAULT NULL COMMENT '语文',
  `math` int NULL DEFAULT NULL COMMENT '数学',
  `english` int NULL DEFAULT NULL COMMENT '英语',
  `class` int NULL DEFAULT NULL COMMENT '班级',
  `age` int NULL DEFAULT NULL COMMENT '年龄',
  `association` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '社团',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
```

## 数据

```sql
INSERT INTO `student` VALUES (1, '张三', '男', 86, 78, 65, 2, 11, '1,5,6');
INSERT INTO `student` VALUES (2, '李四', '女', 56, 56, 23, 1, 12, '2,4');
INSERT INTO `student` VALUES (3, '王五', '女', 89, 41, 91, 2, 10, '3,6');
INSERT INTO `student` VALUES (4, '赵六', '男', 86, 97, 78, 3, 11, NULL);
INSERT INTO `student` VALUES (5, '钱七', '男', 91, 100, 86, 4, 11, '2,3,4');
INSERT INTO `student` VALUES (6, '郑八', '女', 86, 63, 75, 3, 13, '1,3,5,6');
INSERT INTO `student` VALUES (7, '周九', '女', 65, 57, 36, 1, 12, '3,5');
INSERT INTO `student` VALUES (8, '孙十', '男', 58, 63, 75, 4, 13, '1,2');
```

## 预览


| id  | name | gender | chinese | math | english | class | age | association |
|-----|------|--------|---------|------|---------|-------|-----|-------------|
| 1   | 张三   | 男      | 86      | 78   | 65      | 2     | 11  | 1,5,6       |
| 2   | 李四   | 女      | 56      | 56   | 23      | 1     | 12  | 2,4         |
| 3   | 王五   | 女      | 89      | 41   | 91      | 2     | 10  | 3,6         |
| 4   | 赵六   | 男      | 86      | 97   | 78      | 3     | 11  |             |
| 5   | 钱七   | 男      | 91      | 100  | 86      | 4     | 11  | 2,3,4       |
| 6   | 郑八   | 女      | 86      | 63   | 75      | 3     | 13  | 1,3,5,6     |
| 7   | 周九   | 女      | 65      | 57   | 36      | 1     | 12  | 3,5         |
| 8   | 孙十   | 男      | 58      | 63   | 75      | 4     | 13  | 1,2         |
