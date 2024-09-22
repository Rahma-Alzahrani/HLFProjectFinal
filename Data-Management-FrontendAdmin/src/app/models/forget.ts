export interface forgetResponse {
  success?: boolean
  message?: string
  secret?: string
  errors?: {
    message?: string,
    path?: string
  }
}
