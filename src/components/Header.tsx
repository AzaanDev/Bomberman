import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectName } from "../store/reducers/AuthSlice";
const Header = () => {
  const name = useSelector(selectName);
  const [renderedName, setRenderedName] = useState("");

  useEffect(() => {
    if (name == null) {
      setRenderedName("Login");
    } else {
      setRenderedName(name);
    }
  }, [name]);
  return <header className="header">{renderedName}</header>;
};

export default Header;
