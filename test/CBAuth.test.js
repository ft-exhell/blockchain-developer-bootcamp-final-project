const { catchRevert } = require("./exceptionsHelpers.js");
const CBAuth = artifacts.require("./CBAuth.sol");
const IERC20 = artifacts.require("./IERC20.sol")

contract("CBAuth", (accounts) => {
	// Get accounts to perform tests
	const [
		contractOwner, 
		subscriberETH, 
		subscriberDAI, 
		refunderETH,
		refunderDAI, 
		_
	] = accounts;

	// Addresses of the DAI and DAI whale accounts on the mainnet
	const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f'
	const DAI_WHALE = '0xC73f6738311E76D45dFED155F39773e68251D251'

	// Instantiate a smart contract before each test
	beforeEach(async () => {
		instance = await CBAuth.deployed();
	})

	// Check whether OpenZeppelin access control is working
	it("...should be owned by the Owner", async () => {
	    assert.equal(await instance.owner.call(), contractOwner, "Not owned by the Owner.")
	});

	// Check whether the contract gets ETH from subscriber and makes a subscription record
	it("...should enable subscription with ETH", async () => {
		const initContractBalance = await web3.eth.getBalance(instance.address)

		await instance.subscribeETH({
			from: subscriberETH,
			value: await instance.calculateETHPrice()
		})
		const subscription = await instance.subscriptions(subscriberETH)

		const ContractBalanceAfter = await web3.eth.getBalance(instance.address)

		assert(subscription.expiration != 0, "Record wasn't made.")
		assert(initContractBalance < ContractBalanceAfter, "Money weren't paid.")
	});

	// Check whether the contract gets DAI from subscriber and makes a subscription record.
	it("...should enable subscription with DAI", async () => {
		const dai = await IERC20.at(DAI)
		await dai.transfer(subscriberDAI, '1000000000000000000000', { from: DAI_WHALE })
		await dai.approve.sendTransaction(instance.address, '1000000000000000000000', {
			from: subscriberDAI
		})

		const initContractBalance = await dai.balanceOf(instance.address)

		await instance.subscribeDAI({ from: subscriberDAI	})
		const subscription = await instance.subscriptions(subscriberDAI)

		const ContractBalanceAfter = await dai.balanceOf(instance.address)

		assert(subscription.expiration != 0, "Record wasn't made.")
		assert(initContractBalance < ContractBalanceAfter, "Money weren't paid.")
	});

	// Check if the contract can return funds to accounts and update records.
	it("...should refund", async () => {
		await instance.subscribeETH({
			from: refunderETH,
			value: await instance.calculateETHPrice()
		})

		const ETHAfterSubscription = await web3.eth.getBalance(refunderETH)
		await instance.requestRefund({ from: refunderETH })
		const ETHAfterRefund = await web3.eth.getBalance(refunderETH)
		const ETHSubscription = await instance.subscriptions(refunderETH)

		assert(ETHSubscription.expiration == 0, "ETH record wasn't updated.")
		assert(ETHAfterSubscription < ETHAfterRefund, "ETH refund failed.")


		const dai = await IERC20.at(DAI)
		await dai.transfer(refunderDAI, '1000000000000000000000', { from: DAI_WHALE })
		await dai.approve.sendTransaction(instance.address, '1000000000000000000000', {
			from: refunderDAI
		})

		await instance.subscribeDAI({ from: refunderDAI	})
		const DAIAfterSubscription = await dai.balanceOf(refunderDAI)
		await instance.requestRefund({ from: refunderDAI })
		const DAIAfterRefund = await dai.balanceOf(refunderDAI)
		const DAISubscription = await instance.subscriptions(refunderDAI)
		
		assert(DAISubscription.expiration == 0, "DAI record wasn't updated.")
		assert(DAIAfterSubscription < DAIAfterRefund, "DAI refund failed.")
	})

	// Check if anyone else besides the owner can withdraw.
	it("...shouldn't withdraw to anyone other than the Owner", async () => {
	  await catchRevert(instance.withdraw({ from: subscriberETH }))
	})
});
