export interface Arc76AccountState {
  app: string;
  isOpen: boolean;
  time: number;
  pass: string;
  accounts: LocalAccount[];
  isSaved: boolean;
  transaction: {};
}

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

export interface Arc76WalletContextProps {
  state: Arc76AccountState;
  actions: any;
}
