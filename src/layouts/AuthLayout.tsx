export const AuthLayout = ({ title, children }: Props) => {
  return (
    <div className="auth-box">
      <h1>{title}</h1>
      {children}
    </div>
  );
};

type Props = {
  title: string;
  children: JSX.Element;
};
