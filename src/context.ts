import { createContext } from "react";
import { Arc76WalletContextProps } from "./types/index";

const Arc76WalletContext = createContext<Arc76WalletContextProps | undefined>(undefined);

export default Arc76WalletContext;
