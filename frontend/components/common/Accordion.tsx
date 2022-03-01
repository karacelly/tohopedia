import React, {
  FunctionComponent,
  HTMLAttributes,
  useContext,
  useEffect,
  useState,
} from "react";
import ThemeContext from "../contexts/ThemeContext";

const Accordion: FunctionComponent<
  HTMLAttributes<HTMLDivElement> & { title: string; defaultShow?: boolean }
> = ({ children, title, defaultShow, ...rest }) => {
  const [show, setShow] = useState(defaultShow);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    console.log(title, "accordion hadir");
    console.log(theme);

    return () => {
      console.log(title, "accordion hancur");
    };
  }, [title, theme]);

  useEffect(() => {
    console.log(show);
  }, [show]);

  return (
    <div {...rest}>
      <h4 onClick={() => setShow(!show)}>
        {show ? "" : "› "}
        {title}
      </h4>

      {show && children}
    </div>
  );
};

export default Accordion;
