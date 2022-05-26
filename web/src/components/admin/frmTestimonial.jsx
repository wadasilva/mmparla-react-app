import React, { Component } from "react";
import Form from "../common/form";
import Input from "../common/input";
import Select from "../common/select";
import Textarea from "../common/textarea";
import { withRouter } from "../hoc/withRouter";
import Joi from "joi-browser";
import Modal from "react-modal";
import Avatar from "react-avatar-edit";
import { toast } from "react-toastify";
import * as testimonialsService from "../../services/testimonialService";
import config from "../../config/config.json";
import utils from "../../utils/uploadUtils";
import logger from "../../services/logService";

class FrmTestimonial extends Form {
  state = {
    data: {
      code: "",
      firstName: "",
      lastName: "",
      rol: "",
      message: "",
      email: ""
    },
    errors: {},
    isModalOpen: false,
    src: "/images/no-photo.png",
    preview: null,
  };

  schema = {
    code: Joi.string().required().label("Code"),
    firstName: Joi.string().required().min(3).max(100).label("First name"),
    lastName: Joi.string().required().min(3).max(100).label("Last name"),
    rol: Joi.string().required().min(3).max(50).label("Role"),
    message: Joi.string().required().min(10).max(500).label("Comment"),
    email: Joi.string().optional().max(100).label("Email"),
    photo: Joi.object({
      image: Joi.binary()
        .encoding("base64")
        .max(config.upload.maxSize)
        .label("Photo"),
      format: Joi.string()
        .required()
        .regex(/^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i, "Only image extentions"),
    }),
  };

  customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  async componentDidMount() {
    //Set modal config for screen readers
    Modal.setAppElement("#root");

    //capture testimonial id and fetch data from the server
    const id = this.props.router.params.code;
    const { data } = this.state;
    data.code = id;

    try {
      const result = await testimonialsService.getInvitation(id);
      data.email = result.data.email;
    } catch (error) {}

    this.setState({ data });
  }

  async doSubmit() {
    try {      
      const { status, data } = await testimonialsService.addTestimonial(this.state.data);
      
      if (status === 200) {
        toast.success('Listo! Muchas gracias por tu colaboración!', { autoClose: 8000 });
        return this.props.router.navigate('/#testimonial-block', { replace: true });
      }      
    } catch (error) {
      logger.log(`post data: ${JSON.stringify(this.state.data)}`);
      logger.log(JSON.stringify(error.response ?? error));
      toast.error('Disculpe, algo ha salido mal, intente nuevamente por favor.', { autoClose: 8000 });
    }
  }

  render() {
    return (
      <form
        className="container"
        style={{ padding: "10%", display: "flex", flexDirection: "column" }}
        onSubmit={this.handleSubmit}
      >
        <div
          className="thumnail"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Modal
            isOpen={this.state.isModalOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={() => this.setState({ isModalOpen: false })}
            style={this.customStyles}
            contentLabel="Set a profile picture"
          >
            <Avatar
              width={390}
              height={295}
              onCrop={this.onCrop}
              name="photo"
              id="photo"
              // onClose={() => this.setState({ isModalOpen: false })}
              onBeforeFileLoad={this.onBeforeFileLoad}
              src={this.state.src}
            />
          </Modal>
          <img
            src={this.state.preview || this.state.src}
            className="avatar"
            alt="Gravatar"
            onClick={() => this.setState({ isModalOpen: true })}
          />
          {this.state.errors && (
            <small
              style={{ display: "block", marginTop: "10px" }}
              className="invalid-feedback"
            >
              {this.state.errors.photo}
            </small>
          )}
        </div>
        {this.renderInput("firstName", "Nombre")}
        {this.renderInput("lastName", "Apellido")}
        {this.renderInput("email", "Email", { isReadonly: true })}
        {this.renderInput("rol", "Cargo")}
        {this.renderTextArea("message", "Comentario")}
        {this.renderButton("Send")}
      </form>
    );
  }

  validatePhotoProperty = (file, format) => {
    const obj = { photo: { ["image"]: file, ["format"]: format } };
    const schema = { ["photo"]: this.schema["photo"] };

    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  onBeforeFileLoad = async (event) => {
    const file = event.target.files[0];
    const { data, errors } = this.state;

    const base64file = await utils.toBase64(file);
    const format = utils.getFileExtention(file.name);
    const errorMessage = this.validatePhotoProperty(base64file, format);

    if (errorMessage) {
      errors["photo"] = errorMessage;
      data.photo.image = null;
      data.photo.format = null;
      event.target.value = "";
    } else {
      delete errors["photo"];
      console.log(`file.name: ${file.name}`);
      data.photo.format = format;
    }

    // if (file.size > config.upload.maxSize) {
    //   errors['photo'] = `Photo is greater than ${config.upload.maxSize} ${config.upload.unit}`;
    //   input.target.value = '';
    // } else {
    //   delete errors['photo'];
    //   data.extention = utils.getFileExtention(file.name);
    // }

    this.setState({ data, errors });
  };

  onCrop = (photo) => {
    const { data, errors } = this.state;
    let preview = this.state.preview;

    if (!Object.keys(errors).length <= 0) return;

    preview = photo;

    if (!data.photo) data.photo = { image: '', format: '' };

    data.photo.image = utils.stripImageMimeType(photo);

    delete errors["photo"];
    this.setState({ data, preview });
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

  renderInput(name, label, { type = "text", isReadonly = false } = {}) {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        readOnly={isReadonly ? "readonly" : null}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderTextArea(name, label, placeholder = label) {
    const { data, errors } = this.state;
    return (
      <Textarea
        name={name}
        value={data[name]}
        label={label}
        placeholder={placeholder}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default withRouter(FrmTestimonial);
