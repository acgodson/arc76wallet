import { createContext } from "react";
import { Arc76WalletContextProps } from "./types";


const Arc76WalletContext = createContext<Arc76WalletContextProps | undefined | any>(undefined);

export default Arc76WalletContext;
