export const debug = (message?: any, ...optionalParams: any[]): void => {
  const { log } = console

  log(message, ...optionalParams)
}

export const error = (e: Event): void => {
  const { error } = console

  error(e)
}

export const warn = (message?: any, ...optionalParams: any[]): void => {
  const { warn } = console

  warn(message, ...optionalParams)
}

export default { debug, error, warn }
