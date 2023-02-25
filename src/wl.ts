import { Flq } from './index'

type DbNumberType = 'int' | 'double'

type DbStringType = 'varchar'

type DbType = DbNumberType | DbStringType

interface ModelOption {

}

interface ModelFieldOption {

}

export function defineModel(fields: Record<string, ModelFieldOption> = {} as any, option: ModelOption = {}) {

}


