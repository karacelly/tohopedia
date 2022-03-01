import React, { FunctionComponent, HTMLAttributes } from "react";
import s from "./common.module.scss";

const ErrorDiv: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div {...rest} className={`${s.message} ${s.rounded} ${s.p4} ${className}`}>
      {children}
    </div>
  );
};

export default ErrorDiv;
