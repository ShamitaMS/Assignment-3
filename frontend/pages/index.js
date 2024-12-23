import { useState } from 'react';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import TermsCheckbox from '../components/TermsCheckbox';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
    checkPasswordStrength(password);
  };

  const checkPasswordStrength = (password) => {
    const regexUpper = /[A-Z]/;
    const regexLower = /[a-z]/;
    const regexNumber = /\d/;
    const regexSpecial = /[!@#$%^&*(),.?":{}|<>]/;

    let strength = 'Weak';
    if (password.length >= 8 && regexUpper.test(password) && regexLower.test(password) && regexNumber.test(password) && regexSpecial.test(password)) {
      strength = 'Strong';
    } else if (password.length >= 6) {
      strength = 'Medium';
    }

    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, termsAgreed }),
    });

    if (res.ok) {
      alert('Registration successful!');
    } else {
      alert('Error during registration!');
    }
  };

  return (
    <div className="container">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <PasswordStrengthMeter strength={passwordStrength} />
        </div>
        <TermsCheckbox checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} />
        <button type="submit" disabled={!termsAgreed}>Register</button>
      </form>
    </div>
  );
};

export default Index;
