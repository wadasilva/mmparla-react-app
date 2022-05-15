import React from 'react';

const select = ({name, label, items, error, ...rest}) => {    
    return (
        <div className="form-group">
          <label htmlFor="organizationId">{label}</label>
          <select
            {...rest}
            className="input input--block"
            name={name}
            id={name}
          >
            {items && items.map((item) => (
              <option key={item.id} value={item.id}>{item.value}</option>
            ))}
          </select>
          {error && <small className="invalid-feedback">{error}</small>}
        </div>
    );
};

export default select;