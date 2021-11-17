# Timestamp Dependence

In our case, Geth and Parity will reject blocks with timestamps that are more than 15 seconds into the future. 15 second fluctuation is negligible for a yearly subscription. Hence, the code doesn't suffer from Timestamp Dependence.

# Re-entrancy (SWC-107)

`requestRefund()` can be potentially exploited, so I to prevent this I update state variable `subscriptions` before making an external call.

# Using Specific Compiler Pragma (SWC-103)

To avoid nightly builds and undiscovered bugs the smart contract's `pragma` is locked to `0.8.0`.