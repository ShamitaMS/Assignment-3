// pages/index.js
import { useState } from "react";
import { useForm } from "react-hook-form";
import zxcvbn from "zxcvbn";
import styles from "../styles/Home.module.css"; // Import the CSS module

export default function Home() {
  const [passwordStrength, setPasswordStrength] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    const { email, password, terms } = data;

    // Check if terms and conditions are accepted
    if (!terms) {
      alert("You must accept the terms and conditions");
      return;
    }

    // Send data to API for registration
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, terms }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);  // Success message from API
    } else {
      alert(result.message);    // Error message from API
    }
  };

  // Handle password strength evaluation
  const handlePasswordChange = (event) => {
    const password = event.target.value;
    const result = zxcvbn(password);
    setPasswordStrength(result.score); // Rating from 0 to 4
  };

  return (
    <div className={styles.container}>
      <h1>Welcome Back!</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register("email", { required: "Email is required", pattern: /^\S+@\S+\.\S+$/ })}
            placeholder="Enter your email"
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Enter your password"
            onChange={handlePasswordChange}
          />
          {passwordStrength !== null && (
            <div>
              <span className="password-strength">
                Password Strength: {["Weak", "Fair", "Good", "Strong", "Very Strong"][passwordStrength]}
              </span>
            </div>
          )}
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <div>
          <label>
            <input type="checkbox" {...register("terms")} />
            I accept the terms and conditions
          </label>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
