enum TimeSeconds {
  OneMinute = 60,
  OneDay = 24 * 60 * 60,
}

export enum TokenExpiration {
  // Access = 5 * TimeSeconds.OneMinute,
  Access = 5,
  Refresh = 7 * TimeSeconds.OneDay,
  RefreshIfLessThan = 4 * TimeSeconds.OneDay,
}
