export interface ProjectListConfig {
length: any;
  statusCode: number
  data: ProjectListData[]
  message: string
}

export interface ProjectListData {
  project_id: number
  project_name: string
  project_type_id: number
  created_by: string
  created_on: string
  modified_by?: string
  modified_on?: string
  is_enabled: number
  status: string
  project_type_name: string
  pipeline_id?: number
  pipeline_name?: string
  source_ids: number[]
  is_deployed: boolean
  is_started: boolean
  is_stopped: boolean
  pro_letters: string
}

export interface ProjectTypeConfig {
  pipeline_type_id: number;
  response: any;
  message: string
  data: ProjectTypeData[]
}

export interface ProjectTypeData {
  processing_type_id: number;
  project_type_id: number
  description: string
  created_by: string
  modified_by: any
  status: string
  created_on: string
  project_type: string
  modified_on: any
  is_enabled: boolean
}

export interface ProjectCreateResp {
  message: string
  data: ProjectCreateData
}

export interface ProjectCreateData {
  data: any;
  pipeline_id: any;
  project_id: number
}

export interface AlertCategoryConfig {
  message: string
  data: AlertCategoryData[]
}

export interface AlertCategoryData {
  alarm_category_name: string
  status: string
  created_by: any
  modified_by: any
  created_on: any
  alarm_category_id: number
  modified_on: any
  is_enabled: boolean
}

export interface SourceUploadResp {
  statusCode: number
  data: SourceUploadRespData
  message: string
}

export interface SourceUploadRespData {
  file_id: number
}

export interface SourceFileListConfig {
  message: string
  data: SourceFileListData[]
}


export interface SourceFileListData {
  source_id: number
  source_name: string
  area_id: number
  area_name: any
  fps: number
  process_type: number
  processing_type_name: string
  status: string
  is_enabled: number
  created_on?: string
  created_by: string
  modified_by?: string
  modified_on?: string
  description: string
  source_stored_location_id: number
  source_stored_location_name: string
  files: any[]
}

export interface SourceDetailConfig {
  message: string
  data: SourceDetailData[]
}

export interface SourceDetailData {
  source_id: number
  source_name: string
  area_id: number
  area_name: any
  fps: number
  process_type: number
  processing_type_name: string
  status: string
  is_enabled: number
  created_on?: string
  created_by: string
  modified_by?: string
  modified_on?: string
  description: string
  source_stored_location_id: number
  source_stored_location_name: string
  files: any[]
}

export interface SourceLocationConfig {
  message: string
  data: SourceLocationData []
}

export interface SourceLocationData {
  created_on: any
  source_stored_location_id: number
  modified_on: any
  is_enabled: boolean
  created_by: any
  source_stored_location_name: string
  status: string
  modified_by: any
}

export interface ProStartRespConfig {
  data: ProStartResp
}

export interface ProStartResp {
  project_id: number
  status: boolean
  output: any
  reason: string
}

export interface ProStopRespConfig {
  data:  ProStopResp
}

export interface ProStopResp {
  project_id: number
  status: boolean
}

export interface ProStatusConfig {
  data: ProStatusData
}

export interface ProStatusData {
  project_id: number
  status: string
}

export interface ProExecConfig {
  data: ProExecData
}

export interface  ProExecData {
  project_id: number
  logs: string
}

export interface  ProjectDeployConfig{
  status: boolean
  timetaken: number
  image_name: string
  image_exposed_port: number
  container_name: string
  container_id: string
  container_port: number
}

export interface ModelRegisterConfig {
  message: string
  data: ModelRegisterData
}

export interface ModelRegisterData {
  model_register: ModelRegister
}

export interface ModelRegister {
  status: boolean
  reason: string[]
  model_id: number
  model_name: string
  docker_image_name: string
  docker_exposed_port: any
}






