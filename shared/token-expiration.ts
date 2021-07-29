const TimeSeconds = {
  OneMinute: 60,
  OneDay: 24 * 60 * 60,
}

export const TokenExpiration = {
  Access: 5 * TimeSeconds.OneMinute,
  Refresh: 7 * TimeSeconds.OneDay,
  RefreshIfLessThan: 4 * TimeSeconds.OneDay,
}