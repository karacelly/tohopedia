import React from "react";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import ShopSidebar from "../../../components/layout/Sidebar/ShopSidebar";

const Dashboard = () => {
  return (
    <div>
      <LoggedNavbar></LoggedNavbar>
      <ShopSidebar></ShopSidebar>
    </div>
  );
};

export default Dashboard;
