const TermsCheckbox = ({ checked, onChange }) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label>
        I agree to the <a href="#">Terms and Conditions</a>
      </label>
    </div>
  );
};

export default TermsCheckbox;
