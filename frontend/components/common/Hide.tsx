import React, {
  FunctionComponent,
  HTMLAttributes,
  useEffect,
  useState,
} from "react";

const Hide: FunctionComponent<
  HTMLAttributes<HTMLDivElement> & {
    text: string;
    cancel: string;
    defaultShow?: boolean;
  }
> = ({ children, cancel, text, defaultShow, ...rest }) => {
  const [show, setShow] = useState(defaultShow);

  useEffect(() => {
    console.log(text, "accordion hadir");

    return () => {
      console.log(text, "accordion hancur");
    };
  }, [text]);

  useEffect(() => {
    console.log(show);
  }, [show]);

  return (
    <div {...rest}>
      {!show && <p onClick={() => setShow(!show)}>{text}</p>}

      {show && children}
      {show && <p onClick={() => setShow(!show)}>{cancel}</p>}
    </div>
  );
};

export default Hide;
