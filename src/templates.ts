// sql方法模板

export const select = 'SELECT [field] FROM [from] [where] [group] [order] [limit]'
export const update = 'UPDATE [from] SET [set] [where]'
export const insert = 'INSERT INTO [from] [value]'
export const remove = 'DELETE FROM [from] [where]'
export const recovery = 'UPDATE [from] SET `deleteAt` = 0 [where]'
export const first = 'SELECT [field] FROM [from] [where] LIMIT 0 1'
export const count = 'SELECT COUNT(*) FROM [from] [where]'
export const field = 'select COLUMN_NAME from information_schema.COLUMNS where table_name = [table]'
export const insertId = 'SELECT LAST_INSERT_ID()'
export const foundRows = 'SELECT ELECT FOUND_ROWS()'
