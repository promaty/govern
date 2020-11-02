import { task } from 'hardhat/config'
import { verifyContract } from '../../helpers/etherscan-verification'
import {
  buildName,
  getContract,
  getGovernBaseFactory,
  getGovernRegistry,
  setBRE,
} from '../../helpers/helpers'
import { logDeploy, logMain } from '../../helpers/logger'
import { eContractid } from '../../helpers/types'
import { GovernBaseFactory } from '../../typechain'

const { Govern, Queue } = eContractid

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

task('deploy-govern', 'Deploys a Govern instance')
  .addOptionalParam('factory', 'GovernBaseFactory address')
  .addOptionalParam('useProxies', 'Whether to deploy govern with proxies')
  .addOptionalParam('name', 'DAO name (must be unique at GovernRegistry level)')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(
    async (
      {
        factory,
        useProxies = true,
        name,
        verify,
        token = `0x${'00'.repeat(20)}`,
        tokenName = name,
        tokenSymbol = 'GOV',
      },
      BRE
    ) => {
      setBRE(BRE)

      const { keccak256, solidityPack } = BRE.ethers.utils

      name = buildName(name)

      const registry = await getGovernRegistry()
      const baseFactory = factory
        ? await getContract<GovernBaseFactory>(
            eContractid.GovernBaseFactory,
            factory
          )
        : await getGovernBaseFactory()

      const tx = await baseFactory.newGovernWithoutConfig(
        name,
        token,
        tokenName || name,
        tokenSymbol,
        useProxies,
        {
          gasLimit: useProxies ? 2e6 : 9e6,
          gasPrice: 2e9,
        }
      )
      tx.wait()

      const topics =
        registry.filters.Registered(null, null, null, baseFactory.address, null)
          .topics ?? []

      const queueAddress = topics[1] as string
      const governAddress = topics[0] as string

      logMain(`----\nA wild new Govern named *${name}* appeared 🦅`)
      logDeploy(eContractid.Queue, BRE.network.name, queueAddress)
      logDeploy(eContractid.Govern, BRE.network.name, governAddress)

      if (verify) {
        const salt = useProxies
          ? keccak256(solidityPack(['string'], [name]))
          : '0x0'

        const config = [
          '0',
          [ZERO_ADDR, '0'],
          [ZERO_ADDR, '0'],
          ZERO_ADDR,
          '0x',
        ]

        const queueArgs = [baseFactory.address, config, salt]
        const governArgs = [queueAddress, salt]

        await verifyContract(Queue, queueAddress, queueArgs)
        await verifyContract(Govern, governAddress, governArgs)
      }
    }
  )
