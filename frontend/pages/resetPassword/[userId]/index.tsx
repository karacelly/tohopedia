import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import s from "./reset.module.scss";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Router, { useRouter } from "next/router";

const ResetPassword = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { userId } = router.query;

  const validationSchema = yup.object().shape({
    newPassword: yup.string().required("New Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const resetPasswordQuery = gql`
    mutation resetPassword($userId: String!, $password: String!) {
      resetPassword(userId: $userId, newPassword: $password) {
        id
      }
    }
  `;

  const [resetPassword] = useMutation(resetPasswordQuery);

  function onSubmit(val: any) {
    try {
      resetPassword({
        variables: {
          userId: userId,
          password: val.newPassword,
        },
      }).then(() => {});
    } catch (error) {
      setErrorMsg("Something's wrong!");
    }
    Router.push("/login");
  }

  return (
    <>
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
              type="password"
              placeholder="New Password"
              {...register("newPassword")}
            />
          </div>
          <div className={s.pt2}>
            <span></span>
          </div>
          <div className={s.errorMsg}>{errors.newPassword?.message}</div>
          <div className={s.errorMsg}>{errorMsg}</div>
          <div className={s.pt2}>
            <button type="submit">Change password</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
