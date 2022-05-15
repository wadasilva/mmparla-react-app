import React from "react";

const textarea = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea {...rest} className="input input--block" name={name} id={name}></textarea>
      {error && <small className="invalid-feedback">{error}</small>}
    </div>
  );
};

export default textarea;
