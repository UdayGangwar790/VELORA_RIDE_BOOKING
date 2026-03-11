import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      fullName: {
        firstName: firstName,
        lastName: lastName
      },
      email: email,
      password: password
    };

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );

      if (response.status === 201 || response.status === 200) {

        const data = response.data;

        // Save token
        localStorage.setItem("token", data.token);

        // Save user in context
        setUser(data.user);

        // Redirect to home
        navigate("/home");

      }

    } catch (error) {

      console.error("Signup error:", error.response?.data || error.message);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Signup failed. Try again.");
      }

    }

    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white p-6">

      <div className="w-full mt-3 max-w-md mx-auto">

        <div className="flex justify-center mb-4">
          <img className="w-32" src="/velora_icon2.png" alt="Logo" />
        </div>

        <form className="w-full" onSubmit={submitHandler}>

          <h3 className="text-base font-semibold mb-2 mt-2">
            What's your Name
          </h3>

          <div className="flex gap-4 mb-4">

            <input
              id="firstName"
              name="firstName"
              className="bg-[#f5f5f5] rounded-xl px-4 py-2.5 border w-1/2"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="first name"
              required
            />

            <input
              id="lastName"
              name="lastName"
              className="bg-[#f5f5f5] rounded-xl px-4 py-2.5 border w-1/2"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="last name"
              required
            />

          </div>

          <h3 className="text-base font-semibold mb-2 mt-2">
            What's your Email
          </h3>

          <input
            id="email"
            name="email"
            className="bg-[#f5f5f5] mb-4 rounded-xl px-4 py-2.5 border w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />

          <h3 className="text-base font-semibold mb-2 mt-2">
            Enter Password
          </h3>

          <input
            id="password"
            name="password"
            className="bg-[#f5f5f5] mb-4 rounded-xl px-4 py-2.5 border w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />

          <button
            type="submit"
            className="bg-velora-light hover:bg-velora-dark 
            transition-colors duration-300 text-white 
            text-lg font-bold w-full py-3 rounded-2xl"
          >
            Create Account
          </button>

        </form>

        <div className="text-center mt-5">

          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/user-login"
              className="text-violet-700 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>

        </div>

      </div>

      <div>

        <p className="text-[10px]">
          This site is protected by reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-violet-700 font-semibold hover:underline"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            className="text-violet-700 font-semibold hover:underline"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>

      </div>

    </div>
  );
};

export default UserSignup;