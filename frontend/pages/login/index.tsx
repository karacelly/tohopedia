import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import s from "./login.module.scss";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { setCookies } from "cookies-next";
import Router from "next/router";

const Login = () => {
  const loginQuery = gql`
    mutation auth($email: String!, $password: String!) {
      auth {
        login(email: $email, password: $password)
      }
    }
  `;

  const [getLogin, { loading, error, data }] = useMutation(loginQuery);

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

  async function onSubmit(data: any) {
    // display form data on success
    // alert("SUCCESS!! :-)\n\n" + JSON.stringify(data, null, 4));
    // return false;
    console.log("hello");
    try {
      await getLogin({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (data) {
    setCookies("user", data.auth.login.token);
    Router.push("/");
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
          <div className={`${s.flexCenter} ${s.pt2}`}>
            <span>
              Need help?
              <Link href="">
                <a> Contact Tokopedia Care</a>
              </Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
