import { getCookie } from "cookies-next";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Footer from "../components/layout/Footer/Footer";
import LoggedNavbar from "../components/layout/Navbar/LoggedNavbar";
import Navbar from "../components/layout/Navbar/Navbar";
import s from "../styles/Home.module.css";

const Home: NextPage = () => {
  console.log(getCookie("user"));

  return getCookie("user") === undefined ? (
    <>
      <Navbar></Navbar>
      <div className={s.container}>
        
      </div>
      <Footer></Footer>
    </>
  ) : (
    <>
      <LoggedNavbar></LoggedNavbar>
      <Footer></Footer>
    </>
  );
};

export default Home;
