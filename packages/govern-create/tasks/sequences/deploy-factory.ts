import { task } from '@nomiclabs/buidler/config'
import { writeFileSync } from 'fs'
import { deployContract } from '../../helpers/helpers'
import { logDeploy } from '../../helpers/logger'
import { GovernFactory, Govern } from '../../typechain'

const FACTORY_CACHE_NAME = 'govern-factory-rinkeby'

task('deploy-factory', 'Deploys an GovernBaseFactory instance')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(async ({ verify }, BRE) => {
    setBRE(BRE)
    await deployContract<GovernFactory>('GovernFactory', [])
    deployContract('GovernQueueFactory')

    const GovernFactory = await ethers.getContractFactory('GovernFactory')
    const GovernQueueFactory = await ethers.getContractFactory(
      'GovernQueueFactory'
    )
    const GovernTokenFactory = await ethers.getContractFactory(
      'GovernTokenFactory'
    )
    const GovernBaseFactory = await ethers.getContractFactory(
      'GovernBaseFactory'
    )

    const governFactory = await GovernFactory.deploy()
    logDeploy('GovernFactory', governFactory.address)

    const queueFactory = await GovernQueueFactory.deploy()
    logDeploy('GovernQueueFactory', queueFactory.address)

    const tokenFactory = await GovernTokenFactory.deploy()
    logDeploy('GovernTokenFactory', tokenFactory.address)

    const governBaseFactory = await GovernBaseFactory.deploy(
      process.env.REGISTRY_RINKEBY,
      governFactory.address,
      queueFactory.address,
      tokenFactory.address
    )
    logDeploy('GovernBaseFactory', governBaseFactory.address)

    if (process.env.CD) {
      writeFileSync(FACTORY_CACHE_NAME, governBaseFactory.address)
    }
  })
