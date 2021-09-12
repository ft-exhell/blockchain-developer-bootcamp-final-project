# Crossroads

The future is multichain, but it's easy to get lost in the cross-chain woods. This leads to poor UX, especially for less sophisticated users. Meet Crossroads—the one-stop-shop for navigating EVM-compatible chains.
- **What the project does?**
  - Crossroads is a gateway to EVM-compatible chains and sequencers. It lists all the available options in a comprehensive UI, and abstracts migration complexity.
- **User workflow**
  - User arrives on the website.
  - A Metamask window pops up, asking for a connection.
  - User is prompted to select which network they want to migrate from. If the current Metamask network is different from the 'From' network, Metamask offers to change the Network in one click.
  - User selects a chain they want to go to. 
  - A migration window pops up. It has a dropdown selector for assets, and an execution button.
  - User selects the asset they want to migrate, clicks on the execution button.
  - A series of smart-contract interaction is triggered. Importantly, a user doesn't need to care about what happens under the hood. They just move money around the chains with few clicks and keystrokes.
  - Once migration is complete, the user is asked whether they want to switch Metamask to the network they just migrated to.
  - If the user agrees to change to a new network, a list of dApps living on that network is shown, so the user can continue their journey. Otherwise, they're returned to home screen (where 'From' chain is selected).
