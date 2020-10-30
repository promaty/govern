import { ethers } from '@nomiclabs/buidler'
import { expect } from 'chai'
import { Signer } from 'ethers'
import {
  GovernRegistry,
  GovernRegistryFactory,
  Erc3000Mock,
  Erc3000MockFactory,
  Erc3000ExecutorMock,
  Erc3000ExecutorMockFactory,
} from '../typechain'

const ERRORS = {
  NAME_USED: 'registry: name used',
}

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata',
}

describe('GovernRegistry', function () {
  let governRegistry: GovernRegistry,
    erc3k: Erc3000Mock,
    erc3kExec: Erc3000ExecutorMock,
    signers: Signer[],
    current: string

  before(async () => {
    signers = await ethers.getSigners()
    current = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const ERC3000Mock = (await ethers.getContractFactory(
      'ERC3000Mock'
    )) as Erc3000MockFactory

    const ERC3000ExecutorMock = (await ethers.getContractFactory(
      'ERC3000ExecutorMock'
    )) as Erc3000ExecutorMockFactory

    const GovernRegistry = (await ethers.getContractFactory(
      'GovernRegistry'
    )) as GovernRegistryFactory

    erc3kExec = await ERC3000ExecutorMock.deploy()

    erc3k = await ERC3000Mock.deploy()

    governRegistry = await GovernRegistry.deploy()
    governRegistry = governRegistry.connect(signers[0])
  })

  it('calls register and is able to register the executor and queue', async () => {
    await expect(
      governRegistry.register(
        erc3kExec.address,
        erc3k.address,
        `0x${'00'.repeat(20)}`,
        'MyName',
        '0x00'
      )
    )
      .to.emit(governRegistry, EVENTS.REGISTERED)
      .withArgs(erc3kExec.address, erc3k.address, current, 'MyName')
      .to.emit(governRegistry, EVENTS.SET_METADATA)
      .withArgs(erc3kExec.address, '0x00')

    expect(await governRegistry.nameUsed('MyName')).to.equal(true)
  })

  it('calls register and reverts cause the name is already used', async () => {
    governRegistry.register(erc3kExec.address, erc3k.address, `0x${'00'.repeat(20)}`, 'MyName', '0x00')

    await expect(
      governRegistry.register(
        erc3kExec.address,
        erc3k.address,
        `0x${'00'.repeat(20)}`,
        'MyName',
        '0x00'
      )
    ).to.be.revertedWith(ERRORS.NAME_USED)

    expect(await governRegistry.nameUsed('MyName')).to.equal(true)
  })
})
