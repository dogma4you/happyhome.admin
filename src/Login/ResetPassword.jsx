import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../Components/Input";

export default function ResetPassword() {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    console.log("Resetting password with token:", token);
    console.log("New password:", passwords.newPassword);
    navigate("/login");
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
      <p className="text-gray-600 mb-6">Enter your new password</p>
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center gap-4 flex-col max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handleChange}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-3/5 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-2"
        >
          Reset Password
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-cyan-400 hover:underline"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
