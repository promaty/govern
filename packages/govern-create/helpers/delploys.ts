import { GovernFactory, GovernRegistry } from '../typechain'
import { verifyContract } from './etherscan-verification'
import { deployContract } from './helpers'
import { eContractid } from './types'

export const deployGoverRegistry = async (verify?: boolean) => {
  const id = eContractid.GovernRegistry

  const instance = await deployContract<GovernRegistry>(id, [])
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(id, instance.address, [])
  }

  return instance
}

export const deployGoverFactory = async (verify?: boolean) => {
  const id = eContractid.GovernFactory

  const instance = await deployContract<GovernFactory>(id, [])
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(id, instance.address, [])
  }

  return instance
}
