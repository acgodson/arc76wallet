import { isEqual } from "lodash";
import algosdk from "algosdk";
import { Arc76AccountState } from "./provider.js";
import { LocalAccount } from "./types/index.js";
import { deriveKey } from "./utils/cryptoUtils.js";
import {
  isSavedInLocalStorage,
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "./utils/storage.js";
// import { Arc76AccountState, LocalAccount } from "../types/index.js";
// import { deriveKey } from "../utils/cryptoUtils.js";

// Initial state function
export const initialState = (): Arc76AccountState | null => {
  if (isSavedInLocalStorage()) {
    //prompt user
    return {
      app: "shindg",
      isOpen: false,
      time: 2000000000000,
      accounts: [],
      transaction: {},
      isSaved: true,
    }; // Indicate that a saved state exists but not loaded yet

    //check if there's a password will you
  }
  return {
    app: "shindg",
    isOpen: false,
    time: 2000000000000,
    accounts: [],
    transaction: {},
    isSaved: false,
  };
};

export const reducer = (
  state: Arc76AccountState | null,
  action: any
): Arc76AccountState | null => {
  if (!state) return null;

  const newState = (() => {
    switch (action.type) {
      case "SET_TRANSACTION":
        return { ...state, transaction: action.payload };
      case "ADD_EMAIL_PASSWORD_ACCOUNT":
        return {
          ...state,
          accounts: [...state.accounts, action.payload],
          isOpen: true,
          time: Date.now(),
          isSaved: action.payload.savePassword,
        };
      case "LOCK_WALLET":
        return { ...state, isOpen: false };
      case "CHECK_FOR_SAVED_WALLET":
        return { ...state, isSaved: action.payload };
      case "UNLOCK_WALLET":
        return { ...action.state, isOpen: true };
      default:
        return state;
    }
  })();

  if (!isEqual(newState, state)) {
    saveStateToLocalStorage(newState, action.password);
  }
  return newState;
};

// Actions
export const actions = (dispatch: React.Dispatch<any>) => ({
  setTransaction: (transaction: any) => {
    localStorage.setItem("transaction", JSON.stringify(transaction));
    dispatch({ type: "SET_TRANSACTION", payload: transaction });
  },
  addAccount: (account: LocalAccount, password: string) => {
    dispatch({
      type: "ADD_EMAIL_PASSWORD_ACCOUNT",
      payload: account,
      isOpen: true,
      time: Date.now(),
      isSaved: account.savePassword,
      password: password,
    });
  },
  lockWallet: () => {
    dispatch({ type: "LOCK_WALLET" });
  },
  checkForSavedWallet: () => {
    const hasSavedWallet = isSavedInLocalStorage();
    dispatch({
      type: "CHECK_FOR_SAVED_WALLET",
      payload: hasSavedWallet,
      isSaved: true,
    });
  },
  unlockWallet: (pass: string) => {
    const state = loadStateFromLocalStorage(pass);
    if (state) {
      state.accounts.forEach((account) => {
        if (account && Array.isArray(account.sk)) {
          account.sk = Uint8Array.from(account.sk);
        }
      });
      dispatch({ type: "UNLOCK_WALLET", state, isSaved: true });
    } else {
      console.error("Failed to unlock wallet");
    }
  },
  getAccount: (addr: string) => (state: Arc76AccountState) => {
    return state.accounts.find((a) => a.addr === addr);
  },
  getSK: (addr: string) => (state: Arc76AccountState) => {
    const account = state.accounts.find((a) => a.addr === addr);
    if (account && account.sk) {
      if (Array.isArray(account.sk)) {
        return Uint8Array.from(account.sk);
      }
      return account.sk;
    }
    return null;
  },
  generateNewAccount: async ({
    name,
    email,
    password,
    network,
    savePassword,
  }: {
    name: string;
    email: string;
    password: string;
    network?: string;
    savePassword?: boolean;
  }) => {
    try {
      const init = `ARC-0076-${email}-${password}-0-PBKDF2-999999`;
      const salt = `ARC-0076-${email}-0-PBKDF2-999999`;
      const iterations = 999999;
      if (!window || !window.crypto || !window.crypto.subtle) {
        throw new Error("Crypto API in browser is not available");
      }
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        Buffer.from(init, "utf-8"),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
      );

      const masterBits = await deriveKey(init, salt, iterations);
      const mnemonic = algosdk.mnemonicFromSeed(masterBits);
      const genAccount = algosdk.mnemonicToSecretKey(mnemonic);

      const account: LocalAccount = {
        addr: genAccount.addr,
        address: genAccount.addr,
        sk: genAccount.sk,
        savePassword,
        name,
        email,
        network: "testnet",
        type: "emailPwd",
      };

      dispatch({
        type: "ADD_EMAIL_PASSWORD_ACCOUNT",
        payload: account,
        password: password,
      });
    } catch (error) {
      console.error("Error generating account:", error);
    }
  },
});
