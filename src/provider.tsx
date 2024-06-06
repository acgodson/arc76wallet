import React, { ReactNode, useEffect, useReducer } from "react";
import { createContext } from "react";
import { Arc76WalletContextProps } from "./types";
import { reducer, initialState, actions } from "./state";

const Arc76WalletContext = createContext<Arc76WalletContextProps | undefined>(
  undefined
);

export default Arc76WalletContext;

const Arc76WalletProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const boundActions = actions(dispatch);

  useEffect(() => {
    const check = boundActions.checkForSavedWallet();
    console.log("checked", check);
  }, []);

  return (
    <Arc76WalletContext.Provider value={{ state, actions: boundActions }}>
      {children}
    </Arc76WalletContext.Provider>
  );
};

const useArc76Wallet = () => {
  const context = React.useContext(Arc76WalletContext);
  if (context === undefined) {
    throw new Error(
      "useArc76Wallet must be used within an Arc76WalletProvider"
    );
  }
  return context;
};

export { Arc76WalletProvider, useArc76Wallet };
