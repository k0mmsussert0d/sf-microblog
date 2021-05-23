import {createContext, useContext} from 'react';
import {UserSummary} from '../models/API';

interface AppContextType {
  isAuthenticated: boolean,
  userHasAuthenticated: (a: boolean) => void,
  authenticatedUserDetails: UserSummary | undefined
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = (): AppContextType => {
  return useContext(AppContext);
};
