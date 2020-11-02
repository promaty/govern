import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-typechain'
import 'solidity-coverage'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

if (!process.env.SKIP_TASKS) {
  ;['misc', 'deployments', 'sequences'].forEach((folder) => {
    const tasksPath = path.join(__dirname, 'tasks', folder)
    fs.readdirSync(tasksPath).forEach((task) => require(`${tasksPath}/${task}`))
  })
  console.log('Loaded tasks')
}

dotenv.config({ path: '../../.env' })

const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || ''
const ETH_KEY = process.env.ETH_KEY
const accounts = ETH_KEY ? ETH_KEY.split(',') : ['']

const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.8',
    settings: {
      optimizer: {
        enabled: true,
        runs: 20000, // TODO: target average DAO use
      },
    },
  },
  typechain: {
    target: 'ethers-v5',
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
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
