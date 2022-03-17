import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import image from "../../public/images/register_new.png";
import s from "./register.module.scss";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { checkCookies } from "cookies-next";
import Router from "next/router";
import { gql, useMutation } from "@apollo/client";

const Register = () => {
  const [OTP, setOTP] = useState("");
  const [typeOTP, setTypeOTP] = useState("");
  const [auth, setAuth] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is invalid"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  useEffect(() => {
    if (checkCookies("user")) {
      Router.push("/");
    }
  });

  const registerQuery = gql`
    mutation register($name: String!, $email: String!, $password: String!) {
      auth {
        register(input: { name: $name, email: $email, password: $password })
      }
    }
  `;

  const [getRegister] = useMutation(registerQuery);

  const onSubmit = async (data: any) => {
    const { Auth } = require("two-step-auth");

    try {
      const res = await Auth(data.email, "Tohopedia by SY");

      console.log(res.OTP);
      setOTP(res.OTP);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={s.logo}>
        <Link href="/">
          <a>
            <Image src={logo} alt="logo"></Image>
          </a>
        </Link>
      </div>
      <div className={s.container}>
        <div className={s.containerLeft}>
          <Image src={image} alt="register_new"></Image>
          <h3>Discover Millions of Trusted Shops</h3>
          <p>Join and enjoy the best online shopping experience</p>
        </div>
        <div className={`${s.containerRight}`}>
          <div className={s.shadow}>
            <div className={s.title}>
              <h3>Sign Up Now</h3>
              <p>
                Already have a Tohopedia account?{" "}
                <Link href="/login">
                  <a> Log in</a>
                </Link>
              </p>
            </div>
            {OTP == "" && !auth && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={`${s.pt2} ${s.registerForm}`}
              >
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <div className={s.errorMsg}>{errors.email?.message}</div>
                <span>Example: email@tokopedia.com</span>

                <input type="submit" />
              </form>
            )}
            {OTP != "" && !auth && (
              <form className={`${s.pt2} ${s.registerForm}`}>
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setTypeOTP(e.target.value);
                  }}
                />
                <div className={s.errorMsg}>
                  {errorMsg == "" ? null : errorMsg}
                </div>

                <button
                  onClick={() => {
                    if (typeOTP == OTP) {
                      setAuth(true);
                      setErrorMsg("");
                    } else {
                      setErrorMsg("Wrong OTP!");
                    }
                  }}
                >
                  Submit OTP
                </button>
              </form>
            )}
            {auth && (
              <form className={`${s.pt2} ${s.registerForm}`}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  onChange={(e) => {
                    setPass(e.target.value);
                  }}
                />
                <div className={s.errorMsg}>
                  {errorMsg == "" ? null : errorMsg}
                </div>

                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    if (name == "" || pass == "" || email == "") {
                      setErrorMsg("All fields must be filled!");
                    } else {
                      try {
                        await getRegister({
                          variables: {
                            name: name,
                            email: email,
                            password: pass,
                          },
                        });
                      } catch (error) {
                        console.log(error);
                      }
                      Router.push("/");
                    }
                  }}
                >
                  Submit
                </button>
              </form>
            )}
            <div className={s.pt2}>
              <p>By signing up, I agree to</p>
              <p>
                <Link href="">
                  <a>Terms &#38; Condition </a>
                </Link>
                and
                <Link href="">
                  <a> Privacy Policy</a>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
