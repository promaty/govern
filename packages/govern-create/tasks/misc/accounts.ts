import { task } from '@nomiclabs/buidler/config'
import { getEthersSignersAddresses } from '../../helpers/helpers'
import { logMain } from '../../helpers/logger'

task('accounts', 'Prints the list of accounts', async (_, { ethers }) => {
  const accounts = await getEthersSignersAddresses()

  for (const account of accounts) {
    logMain(`Account: ${account}}`)
  }
})
