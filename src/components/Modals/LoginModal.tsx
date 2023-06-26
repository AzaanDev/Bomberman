import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Login } from "../../api/Api";
import { setCredentials } from "../../store/reducers/AuthSlice";

interface ModalProps {
  closeModal: () => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
}
interface FormValues {
  Username: string;
  Password: string;
}

const LoginModal = ({ closeModal, setLoggedIn }: ModalProps) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormValues>({
    Username: "",
    Password: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const jsonFormData = JSON.stringify(formData);
    try {
      var r = await Login(jsonFormData);
      console.log(r);
      dispatch(
        setCredentials({
          id: r.UserID,
          token: r.token,
          name: r.name,
        })
      );
      setLoggedIn(true);
      closeModal();
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "");
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: sanitizedValue,
    }));
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <span className="close-icon"></span>
        <h2>Login</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            name="Username"
            className="form-input"
            value={formData.Username}
            onChange={handleChange}
          />
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            className="form-input"
            value={formData.Password}
            onChange={handleChange}
          />
          <input type="submit" value="Login"></input>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
