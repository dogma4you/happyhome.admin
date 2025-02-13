import { NavLink } from "react-router-dom";

export default function Navigation() {
  const activeClassName = "border-b-2 border-blue-500 text-blue-500";

  return (
    <div className="flex p-2">
      <NavLink
        to="account-details"
        className={({ isActive }) => {
          return `px-3 py-2 ${isActive ? activeClassName : ""}`;
        }}
      >
        Account Details
      </NavLink>
      <NavLink
        to="update-password"
        className={({ isActive }) => {
          return `px-3 py-2 ${isActive ? activeClassName : ""}`;
        }}
      >
        Update Password
      </NavLink>
    </div>
  );
}
