# Arc76Wallet

Arc76Wallet is a simple React package for creating Algorand addresses from an email and password. This package manages the wallet state, account creation, and browser storage. Useful for blockchain identities in dapps and many more.

## Features

- Create Algorand addresses using an email and password.
- Manage wallet state within a React context.
- Save and load wallet state from local storage.

## Installation

To install Arc76Wallet, you can use npm or yarn:

```sh
npm install arc76wallet
```

or

```sh
yarn add arc76wallet
```

## Usage

### Setting up the Provider

Wrap your application with the `Arc76WalletProvider` to provide the wallet context to your components:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Arc76WalletProvider } from "arc76wallet";

ReactDOM.render(
  <Arc76WalletProvider>
    <App />
  </Arc76WalletProvider>,
  document.getElementById("root")
);
```

### Using the Wallet Hook

Use the `useArc76Wallet` hook to interact with the wallet context in your components:

```jsx
import React from "react";
import { useArc76Wallet } from "arc76wallet";

const WalletComponent = () => {
  const { state, actions } = useArc76Wallet();

  const createAccount = () => {
    actions.generateNewAccount({
      name: "My Account",
      email: "user@example.com",
      password: "securepassword",
      network: "testnet",
      savePassword: true,
    });
  };

  return (
    <div>
      <button onClick={createAccount}>Create Account</button>
      {state.accounts.map((account) => (
        <div key={account.addr}>
          <p>Address: {account.addr}</p>
          <p>Email: {account.email}</p>
        </div>
      ))}
    </div>
  );
};

export default WalletComponent;
```

### Context Provider

#### `Arc76WalletProvider`

Wrap your application with this provider to use the wallet context.

### Hook

#### `useArc76Wallet`

Returns the wallet state and actions to interact with the wallet.

```ts
const { state, actions } = useArc76Wallet();
```

### State

- `state.isOpen`: Boolean indicating if the wallet is open.
- `state.accounts`: List of accounts.
- `state.isSaved`: Boolean indicating if the wallet is saved in local storage.

### Actions

- `actions.generateNewAccount({ name, email, password, network, savePassword })`: Creates a new Algorand account.
- `actions.unlockWallet(password)`: Unlocks the wallet with the given password.
- `actions.lockWallet()`: Locks the wallet.
- `actions.checkForSavedWallet()`: Checks if there is a saved wallet in local storage.
- `actions.setTransaction(transaction)`: Sets the transaction in the state.
- `actions.addAccount(account)`: Adds an account to the state.
- `actions.getAccount(addr)`: Retrieves an account by address.
- `actions.getSK(addr)`: Retrieves the secret key for an account by address.

## Example

Here is an example of a complete usage in a React component:

```jsx
import React, { useEffect } from "react";
import { useArc76Wallet } from "arc76wallet";

const App = () => {
  const { state, actions } = useArc76Wallet();

  useEffect(() => {
    actions.checkForSavedWallet();
  }, [actions]);

  const handleCreateAccount = async () => {
    await actions.generateNewAccount({
      name: "Demo Account",
      email: "demo@example.com",
      password: "demopassword",
      network: "testnet",
      savePassword: true,
    });
  };

  const handleUnlockWallet = async () => {
    await actions.unlockWallet("demopassword");
  };

  return (
    <div>
      <h1>Arc76Wallet Demo</h1>
      <button onClick={handleCreateAccount}>Create Account</button>
      <button onClick={handleUnlockWallet}>Unlock Wallet</button>
      {state.accounts.length > 0 && (
        <div>
          <h2>Accounts:</h2>
          {state.accounts.map((account) => (
            <div key={account.addr}>
              <p>Address: {account.addr}</p>
              <p>Email: {account.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. Credits to [Ludo]() and [Team Shindg]()
