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

export function logDeploy(
  contractId: string,
  currentNetwork: string,
  contractAddress: string
): void {
  console.log(_prependTag(`*** Deployed ${contractId} ***`, deployTag))
  console.log(_prependTag(`Network: ${currentNetwork}`, deployTag))
  console.log(_prependTag(`Address: ${contractAddress}`, deployTag))

  const url = `https://${
    currentNetwork === 'main' ? '' : currentNetwork + '.'
  }etherscan.io/address/${contractAddress}`

  console.log(_prependTag(`Url: ${url}`, deployTag))
}

export function logAction(data: string): void {
  console.log(_prependTag(data, actionTag))
}
