import React, { useState } from "react";
import Logo from "../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LoggingUser } from "../Redux/slices/AuthSlice";
import { AppDispatch, RootState } from "../Redux/store";
import Loader from "./constants/loader";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resultAction = await dispatch(LoggingUser(formData));

    if (LoggingUser.fulfilled.match(resultAction) && resultAction.payload.token) {
      localStorage.setItem("adminToken", resultAction.payload.token);
      localStorage.setItem(
        "admin",
        JSON.stringify({
          adminname: formData.username,
        })
      );

      navigate("/");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen mx-auto p-10 bg-gray-light w-screen">
      <div
        className="lg:w-2/6 h-5/6 w-full bg-white rounded-2xl p-10 shadow-2xl"
        style={{ margin: "auto" }}
      >
        <div className="flex items-center justify-center gap-3">
          <img src={Logo} alt="logo" className="h-24 object-cover" />
        </div>

        <p className="text-center">Eleli Admin</p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto p-4 border rounded-lg shadow-lg mt-4 price"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-orange h-12"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password:
            </label>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:border-primary-orange h-12"
              placeholder="Enter password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-primary-orange text-white py-2 px-4 rounded-xl hover:bg-secondary-orange transition duration-300 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;