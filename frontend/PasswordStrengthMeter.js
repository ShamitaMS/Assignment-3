const PasswordStrengthMeter = ({ strength }) => {
  return (
    <div className={`strength-meter ${strength.toLowerCase()}`}>
      {strength && <span>Password Strength: {strength}</span>}
    </div>
  );
};

export default PasswordStrengthMeter;
