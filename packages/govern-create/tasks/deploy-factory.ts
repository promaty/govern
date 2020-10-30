import { task } from '@nomiclabs/buidler/config'
import { writeFileSync } from 'fs'
import { logDeploy } from '../helpers/logger'

const FACTORY_CACHE_NAME = 'govern-factory-rinkeby'

task('deploy-factory', 'Deploys an GovernBaseFactory instance').setAction(
  async (_, { ethers }) => {
    const GovernFactory = await ethers.getContractFactory('GovernFactory')
    const GovernQueueFactory = await ethers.getContractFactory(
      'GovernQueueFactory'
    )
    const GovernBaseFactory = await ethers.getContractFactory(
      'GovernBaseFactory'
    )

    const governFactory = await GovernFactory.deploy()
    logDeploy('GovernFactory', governFactory.address)

    const queueFactory = await GovernQueueFactory.deploy()
    logDeploy('GovernQueueFactory', queueFactory.address)

    const governBaseFactory = await GovernBaseFactory.deploy(
      process.env.REGISTRY_RINKEBY,
      governFactory.address,
      queueFactory.address
    )
    logDeploy('GovernBaseFactory', governBaseFactory.address)

    if (process.env.CD) {
      writeFileSync(FACTORY_CACHE_NAME, governBaseFactory.address)
    }
  }
)
