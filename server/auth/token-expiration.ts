enum TimeSeconds {
  OneMinute = 60,
  OneDay = 24 * 60 * 60,
}

export enum TokenExpiration {
  // TODO revert back to 5 minutes
  // Access = 5 * TimeSeconds.OneMinute,
  Access = 5,
  Refresh = 7 * TimeSeconds.OneDay,
  // Refresh the refresh token after 3 days of usage
  RefreshIfLessThan = TokenExpiration.Refresh - 3 * TimeSeconds.OneDay,
}
