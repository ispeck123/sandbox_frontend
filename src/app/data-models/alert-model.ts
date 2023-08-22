export interface AlertListConfig {
    message: string
    data:AlertListData[]
  }
  
  export interface AlertListData {
    alarm_category_name:string,
    duration?:string
  }
