import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types'
import { Contract, Signer } from 'ethers'
import { promises } from 'fs'
import { Address } from './types'

export const writeObjectToFile = async (path: string, obj: object) =>
  await promises.writeFile(path, JSON.stringify(obj))

// Buidler Runtime Environment
export let BRE: BuidlerRuntimeEnvironment = {} as BuidlerRuntimeEnvironment
export const setBRE = (_BRE: BuidlerRuntimeEnvironment) => {
  BRE = _BRE
}

export const getEthersSigners = async (): Promise<Signer[]> =>
  await Promise.all(await BRE.ethers.getSigners())

export const getEthersSignersAddresses = async (): Promise<Address[]> =>
  await Promise.all(
    (await BRE.ethers.getSigners()).map((signer) => signer.getAddress())
  )

export const deployContract = async <ContractType extends Contract>(
  contractName: string,
  args: any[]
): Promise<ContractType> =>
  (await (await BRE.ethers.getContractFactory(contractName)).deploy(
    ...args
  )) as ContractType

export const getContract = async <ContractType extends Contract>(
  contractName: string,
  contractAddress: string,
  address: string
): Promise<ContractType> =>
  (await (await BRE.ethers.getContractAt(contractName, contractAddress)).attach(
    address
  )) as ContractType
