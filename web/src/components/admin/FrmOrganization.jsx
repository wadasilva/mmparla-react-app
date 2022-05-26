import Joi from "joi-browser";
import config from "../../config/config.json";
import * as organizationService from "../../services/organizationService";
import Input from "../common/input";
import InputUpload from "../common/InputUpload";
import Form from "../common/form";
import logger from "../../services/logService";
import utils from "../../utils/uploadUtils";

const fileTypes = ["GIF", "JPEG", "JPG", "TIFF", "PNG", "WEBP", "BMP"];

class FrmOrganization extends Form {
  initialState = {
    data: { name: "", photo: {} },
    errors: {},
    file: null,
  };

  state = this.initialState;

  schema = {
    name: Joi.string().required().min(3).max(255).label("Name"),
    photo: Joi.object({
      image: Joi.binary()
      .encoding("base64")
      .min(1)
      .max(config.upload.maxSize)
      .label("Logo"),
      format: Joi.string()
      .required()
      .regex(/^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i, "Only image extentions")
    })
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.file !== this.state.file) {
      this.updateLogoProperty();
    }
  }

  updateLogoProperty = async () => {
    const { data, file } = { ...this.state };
    try {
      data.photo.image = await utils.toBase64(file);
      data.photo.format = utils.getFileExtention(file.name);
      this.setState({ data });
      this.validateFileUpload();
    } catch (error) {
      logger.log(error);
    }
  };

  render() {
    return (
      <form
        className="container"
        style={{ padding: "10%", display: "flex", flexDirection: "column" }}
        onSubmit={this.handleSubmit}
      >
        {this.renderInput("name", "Nombre")}
        <InputUpload
          name="photo"
          label="Logo"
          types={fileTypes}
          handleChange={this.handleUploadChange}
          error={this.state.errors.photo}
        />
        {this.renderButton("Guardar")}
      </form>
    );
  }

  handleUploadChange = (file) => {
    this.setState({ file });
  };

  validateFileUpload = () => {
    const obj = { ["photo"]: { ["image"]: this.state.data["photo"]["image"], ["format"]: this.state.data["photo"]["format"] } };
    const schema = { ["photo"]: this.schema["photo"] };
    const { error } = Joi.validate(obj, schema);
    const errors = { ...this.state.errors };
    
    if (error) errors["photo"] = error.details[0].message;
    else delete errors["photo"];

    this.setState({ errors });
  };  

  doSubmit = async () => {
    try {
      await organizationService.addOrganization(this.state.data);
      const { data } = this.initialState;
      this.setState({ data });
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

export default FrmOrganization;
