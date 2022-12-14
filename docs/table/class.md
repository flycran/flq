# class

## 结构

```sql
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '名字',
  `teachers` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '老师',
  `createAt` datetime NULL DEFAULT NULL,
  `updateAt` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
```

## 数据

```sql
INSERT INTO `class` VALUES (1, '201', '1,2,4', '2022-07-10 16:15:06', '2022-07-10 16:15:09');
INSERT INTO `class` VALUES (2, '202', '2,3,5', '2022-07-10 16:15:12', '2022-07-10 16:15:14');
INSERT INTO `class` VALUES (3, '203', '1,4,6', '2022-07-10 16:15:17', '2022-07-10 16:15:19');
INSERT INTO `class` VALUES (4, '204', '3,5,6', '2022-07-10 16:15:22', '2022-07-10 16:15:24');
```

## 预览

| id  | name | teachers | createAt           | updateAt           |
|-----|------|----------|--------------------|--------------------|
| 1   | 201  | 1,2,4    | 2022/7/10 16:15:06 | 2022/7/10 16:15:09 |
| 2   | 202  | 2,3,5    | 2022/7/10 16:15:12 | 2022/7/10 16:15:14 |
| 3   | 203  | 1,4,6    | 2022/7/10 16:15:17 | 2022/7/10 16:15:19 |
| 4   | 204  | 3,5,6    | 2022/7/10 16:15:22 | 2022/7/10 16:15:24 |
