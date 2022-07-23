import { Component } from "react";
import Joi from '../../services/validationService';

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    if (!this.schema) return null;
    
    const options = { abortEarly: false, errors: { language: "es" } };
    const { error } = this.schema.validate(this.state.data, options);
    if (!error) return null;

    const errors = {};
    error.details.map((item) => (errors[item.path[0]] = item.message));
    return errors;
  };

  validateProperty = ({ name, value }) => {
    if (!this.schema) return null;
    
    const obj = { [name]: value };
    const rule = this.schema.extract(name);
    const schema = Joi.object({ [name]: rule });
    const { error } = schema.validate(obj, {
      errors: { language: "es" }
    });

    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    //call the server
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {    
    const { errors } = { ...this.state };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ errors: errors });

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data: data });
  };
}

export default Form;
