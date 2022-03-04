import React from "react";
import Footer from "../../../components/layout/Footer/Footer";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import ShopSidebar from "../../../components/layout/Sidebar/ShopSidebar";

const Dashboard = () => {
  return (
    <div>
      <LoggedNavbar></LoggedNavbar>
      <ShopSidebar></ShopSidebar>
      <Footer></Footer>
    </div>
  );
};

export default Dashboard;
