import { Navigate, Outlet, Link } from 'react-router-dom';

import { supabase } from 'config';
import { useGlobalProvider } from 'hooks';

export const PrivateLayout = ({ children = <Outlet /> }: Props) => {
  const { session, setProfile } = useGlobalProvider();

  const onLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  if (!session) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <Link to="/" className="header__logo">
            <img src="/images/logo.png" alt="Logo" />
            <p>Supabase Auth</p>
          </Link>
          <div className="header__actions">
            <button
              type="button"
              className="button button--small"
              onClick={onLogout}
            >
              logout
            </button>
          </div>
        </div>
      </header>
      <div className="container">{children}</div>
    </>
  );
};

type Props = {
  children?: JSX.Element;
};
