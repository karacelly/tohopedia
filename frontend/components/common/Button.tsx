import React, { FunctionComponent, HTMLAttributes } from "react";

const Button: FunctionComponent<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button {...rest} className={`${className}`}>
      {children}
    </button>
  );
};

export default Button;
