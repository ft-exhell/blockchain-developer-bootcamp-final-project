# SWC-103 (Floating pragma)

To avoid nightly builds and undiscovered bugs the smart contract's `pragma` is locked to `0.8.0`.

# SWC-107 (Re-entrancy)

`requestRefund()` can be potentially exploited, so I to prevent this the "Checks Effects Interactions" pattern is used.

# SWC-115 (Authorization via tx.origin)
`msg.sender` is used.

# SWC-116 (Timestamp Dependency)

In our case, Geth and Parity will reject blocks with timestamps that are more than 15 seconds into the future. 15 second fluctuation is negligible for a yearly subscription. Hence, the code doesn't suffer from Timestamp Dependency.