declare type VideogameSlug = 'cs-go'

declare interface ScheduleHTTPBody {
  type: 'schedule'
  data: string
}

declare type ListOfMatchIdsHTTPBody = number[]
