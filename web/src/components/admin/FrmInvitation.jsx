import React, { Component } from "react";
import Form from "../common/form";
import Input from "../common/input";
import Select from "../common/select";
import Joi from "joi-browser";
import * as organizationService from "../../services/organizationService";
import * as testimonialService from "../../services/testimonialService";
import logger from "../../services/logService";

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

  schema = {
    organization: Joi.string().required().label("Organization"),
    email: Joi.string().required().email().label("Email"),
  };

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
        {this.renderSelect('organization', 'Organization', this.state.organizations)}        
        {this.renderInput('email', 'Email')}
        {this.renderButton('Send')}
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

    const organizations = [{ id: "", value: "SELECT AN OPTION" }];
    data.map((organization) =>
      organizations.push({ id: organization._id, value: organization.name })
    );

    this.setState({ organizations });
  }

  doSubmit = async () => {
    try {
      await testimonialService.sendInvitation(this.state.data);
      const { data } = this.initialState;
      this.setState({data});
    } catch (error) {
      console.log(error);
    }
  };

}

export default FrmInvitation;