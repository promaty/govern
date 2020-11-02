import { task } from 'hardhat/config'
import { setBRE, BRE } from '../../helpers/helpers'

let deploymentsCounter = 0
const increaseDeploymentsCounter = () => {
  deploymentsCounter = deploymentsCounter + 1
}

task('dev-deploy', 'Full deployment flow on hardhat network').setAction(
  async (_, _BRE) => {
    setBRE(_BRE)
    const { run } = BRE

    if (deploymentsCounter === 0) {
      await run(`deploy-registry`)
      await run(`deploy-factory`)
    }
    increaseDeploymentsCounter()

    await run(`deploy-govern`)
  }
)
