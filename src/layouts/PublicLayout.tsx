import { Navigate, Outlet, Link } from 'react-router-dom';

import { useGlobalProvider } from 'hooks';

export const PublicLayout = ({ children = <Outlet /> }: Props) => {
  const { session, isResetPasswordValid } = useGlobalProvider();

  if (session && !isResetPasswordValid) {
    return <Navigate to="/" />;
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
            <Link to="/sign-in" className="button button--small">
              Sign in
            </Link>
            <Link to="/sign-up" className="button button--small">
              Sign up
            </Link>
          </div>
        </div>
      </header>
      <div className="public-wrapper">{children}</div>
    </>
  );
};

type Props = {
  children?: JSX.Element;
};
