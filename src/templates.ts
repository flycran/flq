/**sql方法模板 */
export const templates: Record<string, string> = {
  select: 'SELECT [field] FROM [from] [where] [order] [limit]',
  update: 'UPDATE [from] SET [set] [where]',
  insert: 'INSERT INTO [from] [value]',
  delete: 'DELETE FROM [from] [where]',
  remove: 'UPDATE [from] SET `deleteAt` = 0 [where]',
  first: 'SELECT [field] FROM [from] [where] LIMIT 0, 1',
  count: 'SELECT COUNT(*) FROM [from] [where]',
  field: 'select COLUMN_NAME from information_schema.COLUMNS where table_name = [table]',
}
