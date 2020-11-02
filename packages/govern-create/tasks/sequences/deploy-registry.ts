import { task } from '@nomiclabs/buidler/config'
import { registerContractInJsonDb } from '../../helpers/artifactsDb'
import { deployGoverRegistry } from '../../helpers/delploys'
import { setBRE } from '../../helpers/helpers'
import { eContractid } from '../../helpers/types'

const { GovernRegistry } = eContractid

task('deploy-registry', 'Deploys an GoverRegistry instance')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(async ({ verify }, BRE) => {
    setBRE(BRE)

    const governRegistry = await deployGoverRegistry(verify)

    await registerContractInJsonDb(GovernRegistry, governRegistry)
  })
