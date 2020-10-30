import { task } from '@nomiclabs/buidler/config'
import { logDeploy } from '../helpers/logger'

task('deploy-registry', 'Deploys an GoverRegistry instance').setAction(
  async (_, { ethers, run }) => {
    const GovernRegistryFactory = await ethers.getContractFactory(
      'GovernRegistry'
    )

    const GovernRegistry = await GovernRegistryFactory.deploy()

    logDeploy('GovernRegistry', GovernRegistry.address)
  }
)
