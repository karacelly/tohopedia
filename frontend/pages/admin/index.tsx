import React from "react";
import LoggedNavbar from "../../components/layout/Navbar/LoggedNavbar";
import s from "./dashboard.module.scss";

const Dashboard = () => {
  return (
    <>
      <div className={s.body}>
        <LoggedNavbar></LoggedNavbar>
        <div className={s.container}>
          
        </div>
      </div>
    </>
  );
};

export default Dashboard;
