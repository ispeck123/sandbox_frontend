export interface PipelineListConfig {
  message: string
  data: PipelineListData[]
}

export interface PipelineListData {
  pipeline_id: number;
  processing_type_id: number;
  processing_type_name: string;
  pipeline_name: string;
  pipeline_model_type_name: string;
  pipeline_model_type_id: number;
  skip_frames: number;
  status: string;
  created_by: string;
  created_on: Date;
  modified_by: string;
  modified_on?: Date;
  is_enabled: number;
  pipeline_type_id: number;
  pipelne_type_name: string;
  do_tracking?: number;
}

export interface PipelineTypeConfig {
  message: string
  data: PipeLineTypeData[]
}

export interface PipeLineTypeData {
  pipeline_type_id: number
  pipeline_type: string
  description: string
  created_on: string
  created_by: string
  modified_on: any
  modified_by: any
  is_enabled: boolean
  status: string
}

export interface ProcessingTypeConfig {
  message: string
  data: ProcessingTypeData[]
}

export interface purposeTypeConfig {
  message: string
  data: ProcessingTypeData[]
}

export interface ProcessingTypeData {
  processing_type_id: number
  status: string
  created_on: any
  modified_on: any
  is_enabled: boolean
  created_by: any
  processing_type_name: string
  modified_by: any
}

export interface ClassRespConfig {
  message: string
  data: ClassRespData
}

export interface ClassRespData {
  class_id: number
}


export interface AttrRespConfig {
  message: string
  data: AttrRespData
}

export interface AttrRespData {
  class_id: number
}

export interface ClassListConfig {
  message: string
  data: ClassListData[]
}

export interface ClassListData {
  class_id: number
  class_name: string
  is_enabled: boolean
  created_on?: string
  created_by?: string
  modified_on?: string
  modified_by?: string
  class_attributes: ClassAttribute[]
}

export interface ModelClassDelConfig {
  message: string
  data: string
}

export interface ClassAttribute {
  class_attribute_id: number
  class_attribute_name: string
  class_id: number
  is_enabled: boolean
  created_on?: string
  created_by?: string
  modified_on: any
  modified_by: any
  attribute_values: AttributeValue[]
}

export interface AttributeValue {
  class_attribute_value_id: number
  class_attribute_value_name: string
  class_attribute_id: number
  is_enabled: boolean
  created_on?: string
  created_by: any
  modified_on: any
  modified_by: any
}


export interface PipelineCreateResp {
  message: string
  data: PipelineRespData
}

export interface PipelineRespData {
  pipeline_id: number
}

export interface AreaListConfig {
  message: string
  data: AreaListData[]
}

export interface AreaListData {
  area_id: number
  status: string
  area_name: string
  created_on: string
  modified_on: any
  is_enabled: boolean
  area_description: string
  created_by: string
  modified_by: any
}

export interface SourceRespConfig {
  message: string
  data: SourceRespData
}

export interface SourceRespData {
  source_id: number
}

export interface SourceListConfig {
  map(arg0: (item: any) => any): unknown;
  message: string
  data: SourceListData[]
}

export interface SourceListData {
  source_id: number
  source_name:string
  area_name: string
  area_id: number
  fps: number
  process_type: number
  processing_type_name: string
  status: string
  is_enabled: number
  created_on: string
  created_by: string
  modified_by: any
  modified_on: any
  description: string
  source_stored_location_id: string
  source_stored_location_name:string
}


export interface ZoneRespConfig {
  message: string
  data: ZoneRespData
}

export interface ZoneRespData {
  zone_id: number
}

export interface AttrValRespConfig {
  message: string
  data: AttrValRespData
}

export interface AttrValRespData {
  class_attribute_value_id: number
}

export interface PipeModelTypeConfig {
  message: string
  data: PipeModelTypeData[]
}

export interface PipeModelTypeData {
  pipeline_model_type_name: string
  status: string
  created_on: any
  modified_on: any
  created_by?: string
  pipeline_model_type_id: number
  modified_by: any
  is_enabled: boolean
}

export interface AttachModelRespConfig {
  message: string
  data: AttachModelResp
}

export interface AttachModelResp {
  pipeline_id: number
}

export interface UpdateSourceResp {
  message: string
  data: SourceData
}

export interface SourceData {
  source_id: number
  source_stored_location_id:string

}
