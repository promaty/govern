import { Contract } from 'ethers'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { BRE } from './helpers'
import { logDeploy } from './logger'
import { eContractid } from './types'

const adapter = new FileSync('./deployed-contracts.json')
export const getDb = () => low(adapter)

export const registerContractInJsonDb = async (
  contractId: eContractid,
  contractInstance: Contract
) => {
  const currentNetwork = BRE.network.name
  if (
    currentNetwork !== 'buidlerevm' &&
    currentNetwork !== 'soliditycoverage'
  ) {
    logDeploy(contractId, currentNetwork, contractInstance.address)
  }

  await getDb()
    .set(`${contractId}.${currentNetwork}`, {
      address: contractInstance.address,
      deployer: contractInstance.deployTransaction.from,
    })
    .write()
}
