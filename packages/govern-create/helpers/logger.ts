import chalk, { ForegroundColor } from 'chalk'

const mainTag = chalk.gray('main     | ')
const deployTag = chalk.yellow('deploy | ')
const actionTag = chalk.blue('action  | ')

export function _prependTag(
  lines: string,
  tag: string,
  color?: typeof ForegroundColor
): string {
  if (color) tag = chalk[color](tag)
  return lines
    .split('\n')
    .map((line) => tag + line)
    .join('\n')
}

export function logMain(data: string): void {
  console.log(_prependTag(data, mainTag))
}

export function logDeploy(name: string, address: string): void {
  const data = `${name}: https://rinkeby.etherscan.io/address/${address}`
  console.log(_prependTag(data, deployTag))
}

export function logAction(data: string): void {
  console.log(_prependTag(data, actionTag))
}
