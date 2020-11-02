import { task } from 'hardhat/config'
import { getGovernRegistry, setBRE } from '../../helpers/helpers'
import {
  deployGoverBaseFactory,
  deployGoverFactory,
  deployGoverQueueFactory,
  deployGoverTokenFactory,
} from '../../helpers/delploys'
import { Address, eContractid } from '../../helpers/types'
import { registerContractInJsonDb } from '../../helpers/artifactsDb'

const { GovernBaseFactory } = eContractid

task('deploy-factory', 'Deploys an GovernBaseFactory instance')
  .addOptionalParam('registry', 'GovernRegistry address')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(
    async (
      { registry, verify }: { registry: Address; verify: boolean },
      BRE
    ) => {
      setBRE(BRE)

      const governFactory = await deployGoverFactory(verify)
      const queueFactory = await deployGoverQueueFactory(verify)
      const tokenFactory = await deployGoverTokenFactory(verify)

      const baseFactory = await deployGoverBaseFactory(
        [
          registry ?? (await getGovernRegistry()).address,
          governFactory.address,
          queueFactory.address,
          tokenFactory.address,
        ],
        verify
      )

      await registerContractInJsonDb(GovernBaseFactory, baseFactory)
    }
  )
