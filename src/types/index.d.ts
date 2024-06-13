export interface LocalAccount {
  addr: string;
  address: string;
  sk: any;
  savePassword: any;
  name: string;
  email: string;
  network: string;
  type: string;
}

// src/types/index.ts
export interface Arc76AccountState {
  app: string;
  isOpen: boolean;
  time: number;
  accounts: LocalAccount[];
  transaction: Record<string, any>;
  isSaved: boolean;
}

export interface Arc76WalletContextProps {
  state: Arc76AccountState | null; // Allow state to be null
  actions: {
    setTransaction: (transaction: any) => void;
    addAccount: (account: LocalAccount, password: string) => void;
    lockWallet: () => void;
    checkForSavedWallet: () => void;
    unlockWallet: (state: Arc76AccountState, password) => void;
    generateNewAccount: ({
      name,
      email,
      password,
      network,
      savePassword,
    }: {
      name: string;
      email: string;
      password: string;
      network: string;
      savePassword: boolean;
    }) => Promise<void>;
  };
  password: string;
}


// export interface LocalAccount {
//   addr: string;
//   address: string;
//   sk: Uint8Array;
//   savePassword: boolean;
//   name: string;
//   email: string;
//   network?: string;
//   type: string;
// }

// export interface Arc76AccountState {
//   app: string;
//   isOpen: boolean;
//   time: number;
//   accounts: Local
// }
