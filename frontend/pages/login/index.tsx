import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import s from "./login.module.scss";

const Login = () => {
  return (
    <>
      <div className={s.logo}>
        <Link href="/">
          <a>
            <Image src={logo} alt="logo"></Image>
          </a>
        </Link>
      </div>
      <div className={s.loginForm}>
        <form action="" className={s.loginCont}>
          <div className={s.flex}>
            <div className={s.title}>
              <span>Login</span>
            </div>
            <div className={s.signUp}>
              <Link href="/register">
                <a>Sign Up</a>
              </Link>
            </div>
          </div>
          <div className={s.flex}>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" />
          </div>
          <div className={s.flex}>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
          </div>
          <div className={s.flex}>
            <div className={s.rememberMe}>
              <input type="checkbox" name="remember-me" id="remember-me" />
              <label htmlFor="remember-me">Remember Me</label>
            </div>
            <Link href="/forgetPassword">
              <a>Forget Password</a>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
