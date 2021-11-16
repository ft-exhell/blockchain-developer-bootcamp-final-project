const CBAuth = artifacts.require("./CBAuth.sol");

contract("CBAuth", accounts => {
    let CBAuthInstance;

    beforeEach(async () => {
        CBAuthInstance = await CBAuth.deployed();
    })

    it("...should make a subscription", async () => {
        // Try subscribing
        await CBAuthInstance.subscribe({ from: accounts[0] });

        // Check whether subscription was successful
        const subscription = await CBAuthInstance.isSubscribed.call();

        assert.equal(subscription, true, "Couldn't subscribe");
    });
});
