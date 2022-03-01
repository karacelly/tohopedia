import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import image from "../../public/images/register_new.png";
import s from "./register.module.scss";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Register = () => {
  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is invalid"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = (data: any) => {
    // display form data on success
    alert("SUCCESS!! :-)\n\n" + JSON.stringify(data, null, 4));
    return false;
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`${s.pt2} ${s.registerForm}`}
            >
              <label htmlFor="email">Email</label>
              <input type="email" {...register("email")} />
              <div className={s.errorMsg}>{errors.email?.message}</div>
              <span>Example: email@tokopedia.com</span>

              <input type="submit" />
            </form>

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
