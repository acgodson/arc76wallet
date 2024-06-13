import React, {
  ReactNode,
  useReducer,
  useContext,
  useState,
  useEffect,
} from "react";
import Arc76WalletContext from "./context";
import { reducer, actions, initialState } from "./state";
import { Arc76AccountState } from "./types";
import {
  isSavedInLocalStorage,
  loadStateFromLocalStorage,
} from "./utils/storage";
import SignUpModalFC from "./components/connect-modal";
import { ChakraBaseProvider } from "@chakra-ui/react";

const Arc76WalletProvider = ({ children }: { children: ReactNode }) => {
  const [password, setPassword] = useState<string>("");
  const [hasSavedState, setHasSavedState] = useState<boolean>(
    isSavedInLocalStorage()
  );
  const [state, dispatch] = useReducer(
    reducer,
    initialState() as Arc76AccountState | null
  );

  const boundActions = actions(dispatch);
  const [IsConnect, setIsConnect] = useState(false);
  const onOpen = () => setIsConnect(!IsConnect);
  const onClose = () => setIsConnect(false);

  const contextValue = {
    state,
    actions: boundActions,
    password,
    setPassword,
    connectArc76: () => {},
  };

  useEffect(() => {
    if (password && hasSavedState) {
      const savedState = loadStateFromLocalStorage(password);
      if (savedState) {
        dispatch({ type: "UNLOCK_WALLET", state: savedState, password });
        setHasSavedState(false);
      } else {
        console.error("Failed to unlock wallet");
      }
    }
  }, [password, hasSavedState]);

  return (
    <ChakraBaseProvider resetCSS={false}>
      <Arc76WalletContext.Provider value={contextValue}>
        <>
          <SignUpModalFC
            onClose={() => {}}
            modalState={"UNLOCK"}
            password={password}
            handleInputChange={(pwd: string) => setPassword(pwd)}
            onSubmit={() => {}}
            isOpen={IsConnect}
          />
        </>

        {children}
      </Arc76WalletContext.Provider>
    </ChakraBaseProvider>
  );
};

const useArc76Wallet = () => {
  const context = useContext(Arc76WalletContext);
  if (!context) {
    throw new Error(
      "useArc76Wallet must be used within an Arc76WalletProvider"
    );
  }
  return context;
};

export { Arc76WalletProvider, useArc76Wallet };
export type { Arc76AccountState } from "./types";
