import React, { Component } from "react";
import Form from "../common/form";
import Input from "../common/input";
import Select from "../common/select";
import * as organizationService from "../../services/organizationService";
import * as testimonialService from "../../services/testimonialService";
import { toast } from "react-toastify";
import Joi from '../../services/validationService';

class FrmInvitation extends Form {
  initialState = {
    data: {
      email: "",
      organization: "",
    },
    errors: {},
    organizations: [],
  };

  state = this.initialState;

  schema = Joi.object({
    organization: Joi.string().required().label("Organización"),
    email: Joi.string().required().max(100).email({ tlds: { allow: false } }).label("Email"),
  });

  async componentDidMount() {
    this.populateOrganizations();
  }  

  render() {
    return (
      <form
        className="container"
        style={{ padding: "10%", display: "flex", flexDirection: "column" }}
        onSubmit={this.handleSubmit}
      >
        {this.renderSelect('organization', 'Organización', this.state.organizations)}        
        {this.renderInput('email', 'Email')}
        {this.renderButton('Enviar')}
      </form>
    );
  }

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

  renderSelect(name, label, items = []) {
    const { data, errors } = this.state;
    return (
      <Select
          name={name}
          value={data[name]}
          label={label}
          onChange={this.handleChange}
          error={errors[name]}
          items={items}
        />
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

  async populateOrganizations() {
    const { data } = await organizationService.getOrganizations();

    const organizations = [{ id: "", value: "ELIJA UNA OPCIÓN" }];
    data.map((organization) =>
      organizations.push({ id: organization._id, value: organization.name })
    );

    this.setState({ organizations });
  }

  doSubmit = async () => {
    try {
      const { status } = await testimonialService.sendInvitation(this.state.data);

      if (status === 200) {
        const { data } = this.initialState;
        this.setState({data});

        toast.success('Invitación enviada con exito!', { autoClose: 8000 });
      }
      
    } catch (error) {
      toast.error('Disculpe, algo ha salido mal, intente nuevamente por favor.', { autoClose: 8000 });
    }
  };

}

export default FrmInvitation;
