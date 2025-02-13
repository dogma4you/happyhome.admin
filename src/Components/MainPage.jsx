import Header from "./Header";
import Sidebar from "./Sidebar";
import PropTypes from "prop-types";

export default function MainPage({ children }) {
  return (
    <div className="flex w-100">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Header />
        <div className="w-full h-[calc(100vh-6rem)]">{children}</div>
      </div>
    </div>
  );
}

MainPage.propTypes = {
  children: PropTypes.node,
};
