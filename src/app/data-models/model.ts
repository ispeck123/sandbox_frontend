export interface ModelListConfig {
  message: string
  data:ModelListData[]
}

export interface ModelListData {
  is_verified: any
  description: string
  model_id: number
  model_type: string
  created_by: string
  modified_on?: string
  algo_id?: number
  modified_by?: string
  is_enabled: boolean
  model_version: string
  model_name: string
  is_registered: boolean
  created_on: string
  status: string
  framework_id: number
}

export interface FrameworkListConfig {
  message: string
  data: FrameworkData[]
}

export interface FrameworkData {
  version: number
  framework_id: number
  description: string
  modified_on: string
  modified_by: string
  framework_name: string
  created_on: string
  created_by: string
  is_enabled: boolean
}

export interface AlgoListConfig {
  message: string
  data: AlgoData[]
}

export interface AlgoData {
  algo_name: string
  version: string
  modified_on: string
  created_by: string
  description: string
  algo_id: number
  created_on: string
  is_enabled: boolean
  modified_by: string
}

export interface AddModelRespConfig {
  message: string
  data: AddModelRespData
}

export interface AddModelRespData {
  model_id: number
}

export interface AttrDataTypeConfig {
  message: string
  data: AttrDataTypeList[]
}

export interface AttrDataTypeList {
  min_value?: string
  class_attribute_datatype_id: number
  is_enabled: boolean
  max_value?: string
  class_attribute_datatype_name: string
}

export interface artifactStoreRespConfig {
  statusCode: number
  data: artifactStoreRespData
  message: string
}

export interface artifactStoreRespData {
  file_id: string
}

export interface artifactfileRespConfig {
  statusCode: number
  data: artifactStoreRespData
  message: string
}

export interface ModelConfigType {
  message: string
  data: ModelConfigTypeData[]
}

export interface ModelConfigTypeData {
  created_on: any
  artifacts_type_id: number
  modified_on: any
  is_enabled: boolean
  status: string
  created_by: string
  artifacts_type_name: string
  modified_by: any
}

export interface ModelCategoryconfig {
  message: string
  data: ModelCategoryData[]
}

export interface ModelCategoryData {
  model_category_name: string
  status: string
  created_by: string
  modified_by: any
  created_on: any
  model_category_id: number
  modified_on: any
  is_enabled: boolean
}
export interface ModelVerifyConfig {
  message: string
  data:ModelVerifyData
}

export interface ModelVerifyData {
  model_id: number
  model_verify: boolean
}

export interface ArtifactConfig {
  message: string
  data: ArtifactData[]
}

export interface ArtifactData {
  created_on: any
  artifacts_type_id: number
  modified_on: any
  is_enabled: boolean
  status: string
  created_by: string
  artifacts_type_name: string
  modified_by: any
}

export interface ModalTypeConfig{
  message: string
  data: ModalTypeData[]
}

export interface ModalTypeData {
  is_enabled: boolean
  model_type_name: string
  created_on: any
  modified_by: any
  modified_on: any
  model_type_id: number
  created_by: any
  status: string
}


