import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import AccountDetails from "./AccountDetails";
import UpdatePassword from "./UpdatePassword";
import { useEffect } from "react";
import api from "../../api/api";

export default function MyAccount() {
  const location = useLocation();

  // useEffect(() => {
  //   // api.get('/auth/guest')
  //   api
  //     .get("/admin/employee")

  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });

  return (
    <div className="w-full">
      <Navigation />
      <div className="w-full flex flex-col items-center justify-center">
        {location.pathname === "/account/account-details" ? (
          <AccountDetails />
        ) : (
          <UpdatePassword />
        )}
      </div>
    </div>
  );
}
