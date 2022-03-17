import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import s from "./login.module.scss";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { removeCookies, setCookies } from "cookies-next";
import Router from "next/router";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [userID, setUserID] = useState("");
  const [suspended, setSuspended] = useState(false);
  const [TFA, setTFA] = useState(false);
  const [OTP, setOTP] = useState("");
  const [inputOTP, setInputOTP] = useState("");

  const loginQuery = gql`
    mutation auth($email: String!, $password: String!) {
      auth {
        login(email: $email, password: $password)
      }
    }
  `;

  const [getLogin] = useMutation(loginQuery);

  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is invalid"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const userQuery = gql`
    query user($id: String!) {
      user(id: $id) {
        id
        name
        image
        role
        isSuspended
        enable2FA
      }
    }
  `;

  const [getUser] = useLazyQuery(userQuery);

  const requestUnsuspendQuery = gql`
    mutation requestUnsuspend($userId: String!) {
      requestUnsuspend(userId: $userId) {
        name
        image
        role
        isSuspended
      }
    }
  `;

  const [reqUnsuspend] = useMutation(requestUnsuspendQuery);

  function onSubmit(val: any) {
    try {
      getLogin({
        variables: {
          email: val.email,
          password: val.password,
        },
      }).then((data: any) => {
        try {
          let log = data.data.auth;
          console.log(log);

          if (log.login === false) {
            setErrorMsg("Account not found!");
          } else {
            setErrorMsg("");
            if (log?.login?.isSuspended) {
              setUserID(data.data.auth.login.userID);
              console.log(userID);
              setErrorMsg("You are suspended");
              setSuspended(true);
            } else {
              if (log?.login?.enable2FA) {
                const { Auth } = require("two-step-auth");
                try {
                  Auth(val.email, "Tohopedia by SY").then((res: any) => {
                    console.log(res.OTP);
                    setOTP(res.OTP);
                  });
                } catch (error) {
                  console.log(error);
                }
                setTFA(true);
              } else {
                if (log?.login?.role == "user") {
                  Router.push("/");
                } else {
                  Router.push("/admin");
                }
              }
              setCookies("user", data.data.auth.login.token);
            }
          }
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className={s.logo}>
        <Link href="/">
          <a>
            <Image src={logo} alt="logo"></Image>
          </a>
        </Link>
      </div>
      <div className={`${s.loginForm}`}>
        {!TFA && (
          <form
            className={`${s.loginCont} ${s.shadow}`}
            onSubmit={handleSubmit(onSubmit)}
          >
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
            <div className={s.pt2}>
              <label htmlFor="email">Email</label>
            </div>
            <input type="text" id="email" {...register("email")} />
            <div className={s.errorMsg}>{errors.email?.message}</div>
            <div className={s.pt2}>
              <label htmlFor="password">Password</label>
            </div>
            <input type="password" {...register("password")} id="password" />
            <div className={s.errorMsg}>{errors.password?.message}</div>
            <div className={s.errorMsg}>{errorMsg ? errorMsg : null}</div>
            <div className={`${s.flex} ${s.pt2}`}>
              <div className={s.rememberMe}>
                <input type="checkbox" name="remember-me" id="remember-me" />
                <label htmlFor="remember-me">Remember Me</label>
              </div>
              <Link href="/forgetPassword">
                <a>Forget Password</a>
              </Link>
            </div>

            <div className={s.pt2}>
              <input type="submit" />
            </div>
            {suspended && (
              <div className={`${s.flexCenter} ${s.pt2}`}>
                <span>{errorMsg} </span>
                <a
                  style={{ color: "#03ac0e" }}
                  onClick={() => {
                    console.log(userID);
                    try {
                      reqUnsuspend({
                        variables: {
                          userId: userID,
                        },
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  {" "}
                  Request unblock
                </a>
              </div>
            )}
            {!suspended && (
              <div className={`${s.flexCenter} ${s.pt2}`}>
                <span>
                  Need help?
                  <Link href="">
                    <a> Contact Tokopedia Care</a>
                  </Link>
                </span>
              </div>
            )}
          </form>
        )}
        {TFA && (
          <div className={`${s.loginCont} ${s.shadow}`}>
            <div className={s.flex}>
              <div className={s.title}>
                <span>Input OTP</span>
              </div>
            </div>
            <div className={s.pt2}></div>
            <input type="text" onChange={(e) => setInputOTP(e.target.value)} />
            <div className={s.pt2}>
              <span>We sent the OTP to the email</span>
            </div>
            <div className={s.pt2}>
              <input
                type="submit"
                onClick={() => {
                  if (inputOTP == OTP) {
                    Router.push("/");
                  } else {
                    removeCookies("user");
                    Router.reload();
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
