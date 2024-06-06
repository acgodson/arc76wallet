import algosdk from "algosdk";
import pkg from "lodash";
const { isEqual } = pkg;

import {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
  isSavedInLocalStorage,
} from "./utils/storage.js";
import { Arc76AccountState, LocalAccount } from "../src/types/index.js";
import { deriveKey } from "./utils/cryptoUtils.js";

export const initialState: Arc76AccountState = {
  app: "shindg",
  isOpen: false,
  time: 2000000000000,
  pass: "",
  accounts: [],
  transaction: {},
  isSaved: false,
};

export const reducer = (
  state: Arc76AccountState,
  action: any
): Arc76AccountState => {
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
      case "UNLOCK_WALLET":
        return { ...state, ...action.payload, isOpen: true, pass: action.pass };
      case "LOCK_WALLET":
        return { ...state, isOpen: false };
      case "CHECK_FOR_SAVED_WALLET":
        return { ...state, isSaved: action.payload };
      default:
        return state;
    }
  })();

  // Only save state to local storage if it has changed
  if (!isEqual(newState, state)) {
    saveStateToLocalStorage(newState, state.pass);
  }
  return newState;
};

export const actions = (dispatch: React.Dispatch<any>) => ({
  setTransaction: (transaction: any) => {
    localStorage.setItem("transaction", JSON.stringify(transaction));
    dispatch({ type: "SET_TRANSACTION", payload: transaction });
  },
  addAccount: (account: LocalAccount) => {
    dispatch({
      type: "ADD_EMAIL_PASSWORD_ACCOUNT",
      payload: account,

      isOpen: true,
      time: Date.now(),
      isSaved: account.savePassword,
    });
  },
  unlockWallet: (pass: string) => {
    const state = loadStateFromLocalStorage(pass);
    if (state) {
      dispatch({ type: "UNLOCK_WALLET", pass, isSaved: true });
    } else {
      console.error("Failed to unlock wallet");
    }
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
  getAccount: (addr: string) => (state: Arc76AccountState) => {
    return state.accounts.find((a) => a.addr === addr);
  },
  getSK: (addr: string) => (state: Arc76AccountState) => {
    const address = state.accounts.find((a) => a.addr === addr);
    if (address && address.sk) {
      return Uint8Array.from(Object.values(address.sk));
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
        sk: savePassword ? genAccount.sk : null,
        savePassword,
        name,
        email,
        network: network ? network : "testnet",
        type: "emailPwd",
      };

      dispatch({ type: "ADD_EMAIL_PASSWORD_ACCOUNT", payload: account });
    } catch (error) {
      console.error("Error generating account:", error);
    }
  },
});
