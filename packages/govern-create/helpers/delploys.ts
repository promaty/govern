import type {
  GovernFactory,
  GovernBaseFactory,
  GovernRegistry,
  GovernQueueFactory,
  GovernTokenFactory,
} from '../typechain'
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

export const deployGoverQueueFactory = async (verify?: boolean) => {
  const id = eContractid.GovernQueueFactory

  const instance = await deployContract<GovernQueueFactory>(id, [])
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(id, instance.address, [])
  }

  return instance
}

export const deployGoverTokenFactory = async (verify?: boolean) => {
  const id = eContractid.GovernTokenFactory

  const instance = await deployContract<GovernTokenFactory>(id, [])
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(id, instance.address, [])
  }

  return instance
}

export const deployGoverBaseFactory = async (
  [registry, governFactory, queueFactory, tokenFactory]: [
    string,
    string,
    string,
    string
  ],
  verify?: boolean
) => {
  const id = eContractid.GovernBaseFactory
  const args = [registry, governFactory, queueFactory, tokenFactory]

  const instance = await deployContract<GovernBaseFactory>(id, args)
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(id, instance.address, args)
  }

  return instance
}
