export interface SystemUsageConfig {
  statusCode: number
  data: SystemUsageData
  message: string
}

export interface ProcessConfig {
  statusCode: number
  data: ProcessData[]
  message: string
}


export interface ProcessData {
  pid: string
  name: string
  cpu: number
  memoryused: string
 
}
export interface SystemUsageData {
  platform: string
  numofCPU: number
  CPUUsage: number
  GPUUsage: Gpuusage
  totalmemory: string
  freememory: string
  freememoryper: number
}

export interface Gpuusage {
  tier: number
  type: string
}

export interface LoginChartConfig {
  message: string
  data: LoginChartData[]
}

export interface LoginfailChartConfig {
  message: string
  data: LoginChartData[]
}

export interface LoginChartData {
  count: number
  the_date: string
}

export interface CheckingConfig {
  statusCode: number
  data: CheckingData[]
  message: string
}

export interface CheckingData {
  ROLE_NAME:string
}
export interface EventConfig {
  message: string
  data: EventData[]
}
export interface EventfailConfig {
  message: string
  data: EventData[]
}

export interface EventData{
  count: number
  the_date: string
  event_type: string
}

export interface GpuUsageConfig {
  message: string
  data: GpuUsageData
}
export interface GpuUsageData {
  gpu_device_id: number
  gpu_device_name: string
  gpu_temp: string
  gpu_util: string
}
