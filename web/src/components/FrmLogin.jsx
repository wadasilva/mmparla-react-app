import React, { Component } from "react";
import Form from "./common/form";
import Input from "./common/input";
import logger from '../services/logService';
import auth from '../services/authService';
import { withRouter } from "./hoc/withRouter";
import JoiValidate from 'joi';
import messages from '../translation/validation-translations';
const Joi = JoiValidate.defaults(schema => schema.options({ messages }));

class FrmLogin extends Form {
    state = {
        data: {
            email: '',
            password: ''
        },
        errors: {}
    };

    schema = Joi.object({
        email: Joi.string().required().email({ tlds: { allow: false } }).label('Email'),
        password: Joi.string().required().label('Contraseña')
    });

    doSubmit = async () => {
        const { email, password } = this.state.data;

        try {
          await auth.login(email, password);

          const { state } = this.props.router.location;
          window.location = state ? state.from.pathname : '/';
        } catch (ex) {
          if (ex.response && ex.response.status === 400) {
            const errors = {...this.state.errors};
            errors.email = ex.response.data;
            this.setState({ errors });
          }          
        }
      };
    
      renderButton(label) {
        return (
          <button
            type="submit"
            className="btn btn--primary btn--small"
            style={{ marginTop: "20px" }}
            disabled={this.validate()}
          >
            {label}
          </button>
        );
      }
    
      renderInput(name, label, type = "text") {
        const { data, errors } = this.state;
        return (
          <Input
            type={type}
            name={name}
            value={data[name]}
            label={label}
            onChange={this.handleChange}
            error={errors[name]}
          />
        );
      }

  render() {
    return (
      <form
        className="container"
        style={{ padding: "10%", display: "flex", flexDirection: "column" }}
        onSubmit={this.handleSubmit}
      >
        {this.renderInput("email", "Email")}
        {this.renderInput("password", "Contraseña", 'password')}        
        {this.renderButton("Entrar")}
      </form>
    );
  }
}

export default withRouter(FrmLogin);
