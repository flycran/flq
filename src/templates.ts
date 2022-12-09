// sql方法模板
export const select = 'SELECT [foundRows] [field] FROM [from] [where] [group] [order] [limit]'
export const first = 'SELECT [field] FROM [from] [where] LIMIT 0 1'
export const update = 'UPDATE [from] SET [set] [where]'
export const insert = 'INSERT INTO [from] [value]'
export const remove = 'DELETE FROM [from] [where]'
export const count = 'SELECT COUNT(*) FROM [from] [where] [group]'
export const field = 'select COLUMN_NAME from information_schema.COLUMNS where table_name = [table]'
export const foundRows = 'SELECT FOUND_ROWS()'
