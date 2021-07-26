enum Time {
  OneMinute = 60,
  OneDay = 24 * 60 * 60,
}

export enum TokenExpiration {
  Access = 5 * Time.OneMinute,
  Refresh = 7 * Time.OneDay,
}
