import CryptoJS from "crypto-js";
import { Arc76AccountState } from "../types/index.js";

export const loadStateFromLocalStorage = (
  pass: string
): Arc76AccountState | null => {
  try {
    const encryptedState = localStorage.getItem("arc76walletState");
    if (encryptedState === null) {
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedState, pass);
    const decryptedState = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedState;
  } catch (err) {
    console.error("Error loading state from local storage:", err);
    return null;
  }
};

export const saveStateToLocalStorage = (
  state: Arc76AccountState,
  pass: string
) => {
  try {
    const serializedState = JSON.stringify(state);
    const encryptedState = CryptoJS.AES.encrypt(
      serializedState,
      pass
    ).toString();
    localStorage.setItem("arc76walletState", encryptedState);
  } catch (err) {
    console.error("Error saving state to local storage:", err);
  }
};

export const isSavedInLocalStorage = (): boolean => {
  return localStorage.getItem("arc76walletState") !== null;
};
