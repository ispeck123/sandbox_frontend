export interface LoginReg {
  data: LoginRegisterConfig
  message: string
}

export interface LoginRegisterConfig {
  accessToken: string
  userid: number
}



export interface UserModelConfig {
  statusCode: number;
  data: UserModelData[];
  message: string;
}

export interface UserModelData {
  USER_ID: number
  USER_FULLNAME: string
  USER_EMAIL: string
  USER_NAME: string
  USER_PASSWORD: string
  USER_STATUS: number
  USER_ROLE_ID: number
  CREATION_DATE: string
  WRONG_ATTEMPT: number
  LOCK_ACCOUNT: number
  COUNT_TIME: number
  ROLE_ID: number
  ROLE_NAME: string
  ROLE_DESC: string
  ROLE_STATUS: number
}


export interface RoleModelConfig {
  statusCode: number;
  data: RoleModelData[];
  message: string;
}

export interface RoleModelData {
  ROLE_ID: number;
  ROLE_NAME: string;
  ROLE_DESC: string;
  ROLE_STATUS: number;
  CREATION_DATE: string;
}

export interface PermissionModelConfig {
  statusCode: number;
  data: PermissionData[];
  message: string;
}

export interface SubordinatePermissionConfig {
  statusCode: number, 
  data: SubordinatePermissionData[];
  message: string;
}

export interface SubordinatePermissionData {
  id: number, 
  parent_permission_id: number, 
  per_id: number, 
  creation_date: string
}

export interface PermissionData {
  PER_ID: number;
  PER_NAME: string;
  PER_DESC: string;
  PER_STATUS: number;
  CREATION_DATE: string;
}

export interface CreateRoleModelConfig {
  message: string;
}

export interface AssignRolePer {
  statusCode: number
  message: string
}

export interface UserDetailsConfig {
  statusCode: number
  data: UserDetailsData[]
  message: string
}

export interface UserDetailsData {
  USER_ID: number
  USER_FULLNAME: string
  USER_EMAIL: string
  USER_NAME: string
  USER_PASSWORD: string
  USER_STATUS: number
  USER_ROLE_ID: number
  CREATION_DATE: string
}

export interface UserPermByRoleConfig {
  message: string
  data: UserPermRoleData[]
}

export interface UserPermRoleData {
  ROLE_PER_ID: number
  ROLE_ID: number
  PER_ID: number
  ROLE_PER_STATUS: number
  CREATION_DATE: string
}

export interface AuditTrailConfig {
  message: string
  data: AuditTrailData [], 
  totalCount: {
    count: number
  }
}

export interface AuditTrailData {
  event_type: string
  event_result: string
  audit_status: string
  event_time: string
  name: string
  email: string
}

export interface AddAuditConfig {
  Id: number
  Type: string
  Effect: string
  Status: number
}

export interface ModuleConfig {
  message: string
  data: ModuleData[]
}

export interface ModuleData {
  MODULE_NAME: string
  MODULE_PER_STATUS: number
  CREATION_DATE: string
  PER_MODULE_HASH_ID: string
  MODULE_ID:number
  PERMISSION_DATA: number[]
}

export interface editModuleConfig {
  message: string
  data: editModuleData
}

export interface editModuleData {
  MODULE_ID: number
  MODULE_NAME: string
  MODULE_PER_STATUS: number
  CREATION_DATE: string
  PER_MODULE_HASH_ID: string
  PERMISSION_ID: number[]
}

export interface ModulePermConfig {
  message: string
  data: ModulePermData[]
}

export interface ModulePermData {
  PERMISSION_ID: number
  PERMISSION_NAME: string
}

export interface ModulePermConfig {
  message: string
  data: ModulePermData[]
}

export interface ModulePermData {
  PERMISSION_ID: number
  PERMISSION_NAME: string
}

export interface RolePermConfig {
  message: string
  data: RolePermData[]
}

export interface RolePermData {
  ROLE_NAME: string
  PERMISSION_NAME: string[]
}

export interface RolePermMapConfig {
  message: string
  data:RolePermmapData[]
}

export interface RolePermmapData {
  ROLE_NAME: string
  PERMISSION_NAME: string[]
}



