import React from "react";
import Footer from "../../components/layout/Footer/Footer";
import LoggedNavbar from "../../components/layout/Navbar/LoggedNavbar";

const Chat = () => {
  return (
    <div>
      <LoggedNavbar></LoggedNavbar>
      <h3>Chat</h3>
      <Footer></Footer>
    </div>
  );
};

export default Chat;
