import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SignUp } from "../../api/Api";

interface ModalProps {
  closeModal: () => void;
}

interface FormValues {
  Username: string;
  Password: string;
}

const SignupModal = ({ closeModal }: ModalProps) => {
  const [formData, setFormData] = useState<FormValues>({
    Username: "",
    Password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "");
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: sanitizedValue,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const jsonFormData = JSON.stringify(formData);
    var message = await SignUp(jsonFormData);
    console.log(message);
    closeModal();
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
        <h2>Sign up</h2>
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
          <input type="submit" value="Sign up"></input>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
