import { task } from 'hardhat/config'
import { getEthersSignersAddresses } from '../../helpers/helpers'
import { logMain } from '../../helpers/logger'

task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await getEthersSignersAddresses()

  for (const account of accounts) {
    logMain(`Account: ${account}}`)
  }
})
