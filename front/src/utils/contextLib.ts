import {createContext, useContext} from 'react';

interface AppContextType {
  isAuthenticated: boolean,
  userHasAuthenticated: (a: boolean) => void
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = (): AppContextType => {
  return useContext(AppContext);
};
