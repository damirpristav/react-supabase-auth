import { useGlobalProvider } from "hooks";

export const Dashboard = () => {
  const { session, profile} = useGlobalProvider();

  return (
    <div className="dashboard">
      <h2>Welcome, this is your dashboard</h2>
      <p>Email: {session?.user.email}</p>
      <p>First name: {profile?.firstName}</p>
      <p>Last name: {profile?.lastName}</p>
    </div>
  );
};
