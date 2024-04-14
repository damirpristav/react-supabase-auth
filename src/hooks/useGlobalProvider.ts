import { useContext } from 'react';

import { GlobalContext } from 'providers';

export const useGlobalProvider = () => {
  return useContext(GlobalContext);
};
