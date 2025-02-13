import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login/Login";
import ForgotPassword from "./Login/ForgotPassword";
import ResetPassword from "./Login/ResetPassword";
import ProtectedMainLayout from "./Components/ProtectedMainLayout";
import useAuthStore from "./store/useAuthStore";
import Cms from "./Pages/Cms";
import Settings from "./Pages/Settings";
import TableComponents from "./Pages/TableComponents";
import OfferDetails from "./Pages/Offer/OfferDetails";
import Loading from "./Components/Loading";
import AccountDetails from "./Pages/Account/AccountDetails";
import CrudEmployee from "./Pages/Employee/CrudEmployee";
import Modal from "./Components/Modal";
import { Tooltip } from "react-tooltip";
import useModal from "./store/useModal";
import useUserSelf from "./store/useUserSelf";
import Subscription from "./Pages/Subscription/Subscription";
import CrudSubscription from "./Pages/Subscription/CrudSubscription";
import ContractDetails from "./Pages/Contract/ContractDetails";
import ContractPurchasedDetails from "./Pages/Contract/ContractPurchasedDetails";
import Notifications from "./Pages/Notifications";
import Payment from "./Pages/Payment";
import Subscriptions from "./Pages/Subscriptions";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const { modalDetails} = useModal()
  const { fetchUser } = useUserSelf();

  useEffect(() => {
    initializeAuth();
    if (isLoggedIn) fetchUser();
  }, [initializeAuth]);



  return (
    <>
      <Router>
        <Loading />
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedMainLayout />}>
            <Route path="/" element={<TableComponents />} />
            <Route path="/employees" element={<TableComponents />} />
            <Route path="/employee/add" element={<CrudEmployee />} />
            <Route path="/employee/:id/edit" element={<CrudEmployee />} />
            <Route path="/customers" element={<TableComponents />} />
            <Route path="/contracts/listed" element={<TableComponents />} />
            <Route path="/contracts/purchased" element={<TableComponents />} />
            <Route path="/contract/:id" element={<ContractDetails />} />
            <Route path="/contract-purchased/:id" element={<ContractPurchasedDetails />} />
            <Route path="/offers" element={<TableComponents />} />
            <Route path="/offer/:id" element={<OfferDetails />} />
            <Route path="/transactions" element={<TableComponents />} />
            <Route path="/cms" element={<Cms />}>
              <Route path="faq" element={<Cms page="faq" />} />
              <Route path="whats-new" element={<Cms page="whats-new" />} />
              <Route path="main-page" element={<Cms page="main-page" />} />
              <Route path="top-section" element={<Cms page="top-section" />} />
              <Route
                path="what-we-do-seller"
                element={<Cms page="what-we-do-seller" />}
              />
              <Route
                path="what-we-do-buyer"
                element={<Cms page="what-we-do-buyer" />}
              />
            </Route>
            <Route path="/settings" element={<Settings />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/account/account-details" element={<AccountDetails />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="subscription/create" element={<CrudSubscription />} />
            <Route path="subscription/:id/edit" element={<CrudSubscription />} />
            <Route path="/notifications" element ={<Notifications />} />
            <Route path="/subscriptions/book" element={<Subscriptions />} />
            <Route path="/subscriptions/info" element={<Subscriptions />} />
          </Route>
        </Routes>
      </Router>
      <Modal
        isVisible={modalDetails.isVisible}
        image={modalDetails.image}
        button1Text={modalDetails.button1Text}
        button2Text={modalDetails.button2Text}
        button1OnClick={modalDetails.button1OnClick}
        button2OnClick={modalDetails.button2OnClick}
        onClose={modalDetails.onClose}
        button1Color={modalDetails.button1Color}
        button2Color={modalDetails.button2Color}
      />
      <Tooltip
        id="tooltip"
        style={{
          backgroundColor: "#fff",
          color: "#222",
          boxShadow: "0 0 5px #ddd",
          fontSize: "1rem",
          fontWeight: "normal",
        }}
      />
    </>
  );
}

export default App;
