import React, { FunctionComponent, HTMLAttributes } from "react";
import s from "./common.module.scss";

const Card: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div {...rest} className={`${s.shadow} ${s.rounded} ${s.p4} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
