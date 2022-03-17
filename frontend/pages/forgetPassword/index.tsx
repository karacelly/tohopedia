import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import s from "./forget.module.scss";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { gql, useLazyQuery } from "@apollo/client";

const ForgetPassword = () => {
  const [id, setId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is invalid"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const getUserQuery = gql`
    query userByEmail($email: String!) {
      userByEmail(email: $email) {
        id
      }
    }
  `;

  const [getUserByEmail] = useLazyQuery(getUserQuery);

  function onSubmit(val: any) {
    console.log("Checking ...");
    try {
      getUserByEmail({
        variables: {
          email: val.email,
        },
      }).then((res) => {
        if (res) {
          console.log("Sending ...");

          let email = val.email;
          let subject = "Your Reset Password Link";
          let message = `<div>Click this link to reset your password</div>
          <div>http://localhost:3000/resetPassword/${res.data.userByEmail.id}</div>`;
          let data = {
            email,
            subject,
            message,
          };

          fetch("/api/contact", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then((res) => {
            console.log("Response received");
            if (res.status === 200) {
              console.log("Response succeeded!");
            }
          });
        }
      });
    } catch (error) {
      setErrorMsg("We can't find your email");
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
        <form
          className={`${s.loginCont} ${s.shadow}`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={s.flex}>
            <div className={s.title}>
              <span>Forget Password</span>
            </div>
          </div>
          <div className={s.pt2}>
            <span>
              Enter your registered e-mail. We will send you a verification code
              to reset password.
            </span>
          </div>
          <div className={s.pt2}>
            <input
              type="text"
              placeholder="Email"
              id="email"
              {...register("email")}
            />
          </div>
          <div className={s.pt2}>
            <span>{errorMsg}</span>
          </div>
          <div className={s.errorMsg}>{errors.email?.message}</div>
          <div className={s.pt2}>
            <button type="submit">Next</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgetPassword;
