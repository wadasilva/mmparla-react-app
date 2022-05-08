import React from "react";
import { FileUploader } from 'react-drag-drop-files';

const InputUpload = ( {name, label, error, ...rest} ) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{ label }</label>
      <FileUploader
        {...rest}
        id={name}
        name={name}
        multiple={false}
      />
      {error && <small className="invalid-feedback">{error}</small>}
    </div>
  );
};

export default InputUpload;
