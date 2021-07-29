enum TimeSeconds {
  OneMinute = 60,
  OneDay = 24 * 60 * 60,
}

export enum TokenExpiration {
  Access = 5 * TimeSeconds.OneMinute,
  Refresh = 7 * TimeSeconds.OneDay,
  RefreshIfLessThan = TokenExpiration.Refresh - 3 * TimeSeconds.OneDay,
}
