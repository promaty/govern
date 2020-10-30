import { BuidlerConfig, usePlugin } from '@nomiclabs/buidler/config'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

usePlugin('buidler-typechain')
usePlugin('solidity-coverage')
usePlugin('@nomiclabs/buidler-ethers')
usePlugin('@nomiclabs/buidler-etherscan')
usePlugin('@nomiclabs/buidler-waffle')

if (!process.env.SKIP_TASKS) {
  const tasksPath = path.join(__dirname, 'tasks')
  fs.readdirSync(tasksPath).forEach((task) => require(`${tasksPath}/${task}`))

  console.log('Loaded tasks')
}

dotenv.config({ path: '../../.env' })

const ETH_KEY = process.env.ETH_KEY
const accounts = ETH_KEY ? ETH_KEY.split(',') : ['']

const config: BuidlerConfig = {
  solc: {
    version: '0.6.8',
    optimizer: {
      enabled: true,
      runs: 20000, // TODO: target average DAO use
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  networks: {
    coverage: {
      url: 'http://localhost:8555',
      allowUnlimitedContractSize: true,
    },
    rinkeby: {
      url: 'https://rinkeby.eth.aragon.network',
      accounts,
    },
  },
}

export default config
