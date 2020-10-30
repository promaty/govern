import { task } from '@nomiclabs/buidler/config'
import { Signer } from 'ethers'
import { logMain } from '../helpers/logger'

task('accounts', 'Prints the list of accounts', async (_, { ethers }) => {
  const accounts: Signer[] = await ethers.getSigners()

  for (const account of accounts) {
    logMain(`Account: ${await account.getAddress()}`)
  }
})
