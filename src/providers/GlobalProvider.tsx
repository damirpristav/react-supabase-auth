import {
  createContext,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { Outlet } from 'react-router-dom';
import { AuthSession } from '@supabase/supabase-js';

import { supabase } from 'config';
import { Profile } from 'types';
import toast from 'react-hot-toast';

type GlobalContextProps = {
  session: AuthSession | null;
  profile: Profile | null;
  isResetPasswordValid: boolean;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
  setIsResetPasswordValid: Dispatch<SetStateAction<boolean>>;
};

export const GlobalContext = createContext<GlobalContextProps>(undefined!);

export const GlobalProvider = ({ children = <Outlet /> }: Props) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isResetPasswordValid, setIsResetPasswordValid] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event, session);
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetPasswordValid(true);
      }
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    const { data, error } = await supabase.from('profiles').select();
    if (!error) {
      setProfile(data[0]);
    } else {
      toast.error('Profile was not fetched. Something went wrong.');
    }
  }, []);

  useEffect(() => {
    if (!profile && session?.user.id) {
      fetchProfile();
    }
  }, [profile, session?.user.id, fetchProfile]);

  return (
    <GlobalContext.Provider
      value={{
        session,
        profile,
        isResetPasswordValid,
        setProfile,
        setIsResetPasswordValid,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

type Props = {
  children?: JSX.Element;
};
