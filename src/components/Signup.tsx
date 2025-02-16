import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/firebase";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Signup
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User Created:", userCredential.user);
      navigate("/main"); // Redirect to main page after successful signup
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="font-[sans-serif] bg-white max-w-4xl flex items-center mx-auto md:h-screen p-4">
      <div className="grid md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
        {/* ✅ Lumeo Information Section */}
        <div className="max-md:order-1 flex flex-col justify-center space-y-8 min-h-full bg-gradient-to-r from-gray-900 to-gray-700 lg:px-8 px-4 py-4">
          <div>
            <h4 className="text-white text-lg">Join Lumeo Today</h4>
            <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">
              Create an account and enjoy unlimited access to trending movies,
              TV shows, and exclusive content.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg">Secure & Easy Signup</h4>
            <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">
              Your data is safe with us. Sign up now and start streaming
              instantly!
            </p>
          </div>
        </div>

        {/* ✅ Signup Form */}
        <form
          onSubmit={handleSignup}
          className="md:col-span-2 w-full py-6 px-6 sm:px-16 max-md:max-w-xl mx-auto"
        >
          <div className="mb-6">
            <h3 className="text-gray-800 text-xl font-bold">
              Create an Account
            </h3>
          </div>

          {/* Error Message Display */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="text-gray-600 text-sm mb-2 block">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="text-gray-600 text-sm mb-2 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-gray-600 text-sm mb-2 block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-3 block text-sm text-gray-600"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          {/* Signup Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-2.5 px-4 tracking-wider text-sm rounded-md text-white bg-gray-700 hover:bg-gray-800 transition"
            >
              Create an Account
            </button>
          </div>

          {/* Already Have an Account? */}
          <p className="text-gray-600 text-sm mt-6 text-center">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 font-semibold hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
