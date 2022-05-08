import Joi from "joi-browser";
import config from "../config/config.json";
import * as organizationService from "../services/organizationService";
import Input from "./common/input";
import InputUpload from "./common/InputUpload";
import Form from "./common/form";
import logger from "../services/logService";

const fileTypes = ["GIF", "JPEG", "JPG", "TIFF", "PNG", "WEBP", "BMP"];

class OrganizationForm extends Form {
  state = {
    data: { name: "", logo: "", extention: "" },
    errors: {},
    file: null,
  };

  schema = {
    name: Joi.string().required().min(3).max(255).label("Name"),
    logo: Joi.binary()
      .encoding("base64")
      .min(1)
      .max(config.upload.maxSize)
      .label("Logo"),
    extention: Joi.string()
      .required()
      .regex(/^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i, "Only image extentions"),
  };

  async componentDidUpdate() {
    const { data, file } = { ...this.state };
    try {
      data.logo = await this.toBase64(file);
      data.extention = file.name.split(".").pop().toLowerCase();
      this.setState({ data });
      this.validateFileUpload();
    } catch (error) {
      logger.log(error);
    }
  }

  render() {
    return (
      <form
        className="container"
        style={{ padding: "10%", display: "flex", flexDirection: "column" }}
        onSubmit={this.handleSubmit}
      >
        {this.renderInput("name", "Name")}
        <InputUpload
          name="logo"
          label="Logo"
          types={fileTypes}
          handleChange={this.handleUploadChange}
          onSizeError={this.handleSizeError}
          error={this.state.errors.logo}
        />
        {this.renderButton("Guardar")}
      </form>
    );
  }

  handleUploadChange = (file) => {
    this.setState({ file });
  };

  handleSizeError = (file) => {
    
  };

  validateFileUpload = () => {
    const obj = { ["logo"]: this.state.data["logo"] };
    const schema = { ["logo"]: this.schema["logo"] };
    const { error } = Joi.validate(obj, schema);

    const errors = { ...this.state.errors };
    if (error) errors["logo"] = error.details[0].message;
    else delete errors["logo"];

    this.setState({ errors });
  };

  toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) throw new Error("File is null");

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () =>
        resolve(reader.result.toString().replace(/^data:(.*,)?/, ""));
      reader.onerror = (error) => reject(error);
    });
  };

  doSubmit = async () => {
    try {
      const result = await organizationService.addOrganization(this.state.data);
    } catch (error) {
      logger.log(error);
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
}

export default OrganizationForm;
