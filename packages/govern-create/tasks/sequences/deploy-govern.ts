import { task } from '@nomiclabs/buidler/config'
import { readFileSync } from 'fs'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'
import { logMain } from '../../helpers/logger'

const FACTORY_CACHE_NAME = 'govern-factory-rinkeby'
const REGISTER_EVENT_NAME = 'Registered'
const REGISTRY_EVENTS_ABI = [
  'event Registered(address indexed dao, address queue, address indexed registrant, string name)',
  'event SetMetadata(address indexed dao, bytes metadata)',
]

task('deploy-govern', 'Deploys an Govern from provided factory')
  .addOptionalParam('factory', 'Factory address')
  .addOptionalParam('useProxies', 'Whether to deploy govern with proxies')
  .addOptionalParam('name', 'DAO name (must be unique at Registry level)')
  .setAction(
    async (
      {
        factory: factoryAddr,
        useProxies = true,
        name,
        token = `0x${'00'.repeat(20)}`,
        tokenName = name,
        tokenSymbol = 'GOV',
      },
      { ethers }
    ) => {
      factoryAddr =
        factoryAddr ||
        process.env.FACTORY_RINKEBY ||
        readFileSync(FACTORY_CACHE_NAME).toString()
      name =
        name ||
        uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          length: 2,
          separator: '-',
        })
      name = process.env.CD ? `github-${name}` : name

      if (!factoryAddr) {
        return console.error(
          'Please provide factory address as --factory [addr] or add as FACTORY_[NETWORK] to your environment'
        )
      }

      let registryInterface = new ethers.utils.Interface(REGISTRY_EVENTS_ABI)

      const governBaseFactory = await ethers.getContractAt(
        'GovernBaseFactory',
        factoryAddr
      )
      const tx = await governBaseFactory.newGovernWithoutConfig(
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

      const { events } = await tx.wait()

      const {
        args: { dao, queue },
      } = events
        .filter(({ address }) => address === process.env.REGISTRY_RINKEBY)
        .map((log) => registryInterface.parseLog(log))
        .find(({ name }) => name === REGISTER_EVENT_NAME)

      console.log(`----\nA wild new Govern named *${name}* appeared 🦅`)
      print({ address: dao }, 'Govern')
      print({ address: queue }, 'Queue')
    }
  )
