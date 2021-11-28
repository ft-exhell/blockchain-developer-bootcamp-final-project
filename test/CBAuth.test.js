const { catchRevert } = require("./exceptionsHelpers.js");
const CBAuth = artifacts.require("./CBAuth.sol");

contract("CBAuth", (accounts) => {
    // Get accounts to perform tests.
    const [contractOwner, subscriber] = accounts;
    const fee = web3.utils.toWei('0.5', 'ether')

    // Instantiate a smart contract before each test.
    beforeEach(async () => {
        instance = await CBAuth.new();
    })

    // Check that all the accounts were imported correctly.
    // it("...is ready to be tested", async () => {
    //     const eth100 = 100e18;
    //     const subscriberBalance = await web3.eth.getBalance(subscriber)
    //     assert.equal(subscriberBalance, eth100.toString());
    // });

    // Check whether OpenZeppelin access control is working.
    // it("...should be owned by the Owner", async () => {
    //     assert.equal(await instance.owner.call(), contractOwner, "Not owned by the Owner.")
    // });

    // Check if anyone else besides the owner can withdraw.
    // it("...shouldn't withdraw to anyone other than the Owner", async () => {
    //     await instance.subscribe({ from: subscriber, value: fee });

    //     await catchRevert(instance.withdraw({ from: subscriber }))
    // })

    // Verify that a person can subscribe.
    // it("...should make a subscription", async () => {
    //     await instance.subscribe({ from: subscriber, value: fee });
    //     const subscription = await instance.isSubscribed.call({ from: subscriber });
    //     assert.equal(subscription, true, "Couldn't subscribe");
    // });

    // // Check if the smart contract can send a refund.
    // it("...should give a refund", async () => {
    //     await instance.subscribe({ from: subscriber, value: fee });
    //     const balanceAfterSubscription = await web3.eth.getBalance(subscriber)

    //     await instance.requestRefund({ from: subscriber })
    //     const balanceAfterRefund = await web3.eth.getBalance(subscriber)

    //     assert(balanceAfterRefund > balanceAfterSubscription, "Refund failed.")
    // })

    it("...should get ETH/USD price.", async () => {
        const ethUsdc = await instance.getETHUSDPrice()

        console.log(`ETH/USDC is: ${ethUsdc}`)
    })
});
