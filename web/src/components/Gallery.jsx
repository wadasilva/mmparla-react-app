import React, { Component } from "react";
import Joi from "joi-browser";
import config from "../config/config.json";
import utils from "../utils/uploadUtils";
import logger from "../services/logService";
import ReactCrop from "react-image-crop";
import Modal from "react-modal";
import Form from "./common/form";
import InputUpload from "./common/InputUpload";
import Input from './common/input';
import "react-image-crop/dist/ReactCrop.css";
import * as photoService from '../services/photoService';

const fileTypes = ["GIF", "JPEG", "JPG", "TIFF", "PNG", "WEBP", "BMP"];
const styles = {
  imageAreaContainer: {
    width: "80%",
  },
  imagePlaceholder: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "70vh",
    border: "dashed 2px #0658c2",
    flexGrow: 1,
  },
  image: { borderRadius: "5px" },
  form: {
    margin: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    rowGap: "50px",
    columGap: "10px",
  },
  cropContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    marginTop: "300px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  actionButtons: {
    border: "1px solid #0658c2",
    borderRadius: "5px",
    display: "flex",
    flexDirection: 'column',
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "80%",
    gap: "10px",
    padding: "10px",
  },
};

class Gallery extends Form {
  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
  }

  state = {
    data: {
      image: "",
      description: "",
      format: "",
    },
    errors: {},
    crop: {
      unit: "%", // Can be 'px' or '%'
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      aspect: 16 / 9,
    },
    file: null,
    image: {
      base64: "",
      format: "",
    },
    croppedImage: null,
    isModalOpen: false,
  };

  schema = {
    image: Joi.binary()
      .encoding("base64")
      .min(1)
      .max(config.upload.maxSize)
      .label("Image"),
    description: Joi.string().required().min(6).max(255).label('Description'),
    format: Joi.string()
      .required()
      .regex(/^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i, "Only image extentions")
      .label('Format')
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

  validateFileUpload = () => {
    const obj = { ["image"]: this.state["image"]["base64"] };
    const schema = { ["image"]: this.schema["image"] };
    const { error } = Joi.validate(obj, schema);
    const errors = { ...this.state.errors };

    if (error) errors["image"] = error.details[0].message;
    else delete errors["image"];

    this.setState({ errors });
  };

  handleUploadChange = (file) => {
    const {data} = this.state;
    data.image = ""; 
    data.format = "";

    this.setState({
      file,
      isModalOpen: true,
      croppedImage: null,
      data,
    });
  };

  doSubmit = async () => {
    try {
      await photoService.uploadPhoto(this.state.data);
    } catch (error) {
      console.log('error');
    }
  };

  componentDidMount() {
    Modal.setAppElement("#root");
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.file !== this.state.file) {
      this.updateLogoProperty();
    }
  }

  updateLogoProperty = async () => {
    const { image, file } = { ...this.state };
    try {
      image.base64 = await utils.toBase64(file);
      image.format = utils.getFileExtention(file.name);
      this.setState({ image });
      this.validateFileUpload();
    } catch (error) {
      logger.log(error);
    }
  };

  cropImage = async (crop) => {
    const { image } = this.state;
    const { data } = this.state;

    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImage(
        this.imageRef.current,
        crop,
        `croppedImage.${image.format}` // destination filename
      );

      // calling the props function to expose
      // croppedImage to the parent component
      // onImageCropped(croppedImage);
      data.image = croppedImage;
      data.format = this.state.image.format;
      this.setState({ croppedImage, data });
    }
  };

  getCroppedImage = (sourceImage, cropConfig, fileName) => {
    // creating the cropped image from the source image
    const canvas = document.createElement("canvas");
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      sourceImage,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width,
      cropConfig.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        // returning an error
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        blob.name = fileName;

        //Convert blob to base64String
        const base64 = await utils.toBase64(blob);
        resolve(base64);

        // creating a Object URL representing the Blob object given
        // const croppedImageUrl = window.URL.createObjectURL(blob);
        // resolve(croppedImageUrl);
      }, `image/${this.state.image.format}`);
    });
  };

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
    const gallery = this.state.data;
    const { crop, image, croppedImage } = this.state;

    return (
      <form style={styles.form} onSubmit={this.handleSubmit}>
        <div style={styles.actionButtons}>
          <InputUpload
            name="image"
            label=""
            types={fileTypes}
            handleChange={this.handleUploadChange}
            error={this.state.errors.image}
          />
          {this.renderInput('description', 'Description')}
          <button type="submit" className="btn btn--info btn--small">
            Upload
            <svg className="icon icon--small">
              <use xlinkHref="images/sprite.svg#upload-solid"></use>
            </svg>
          </button>
        </div>
        {image.base64 && (
          <Modal
            isOpen={this.state.isModalOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={() => this.setState({ isModalOpen: false })}
            style={styles.modal}
            shouldCloseOnOverlayClick={false}
            contentLabel="Set a profile picture"
          >
            <div style={styles.cropContainer}>
              <ReactCrop
                style={styles.image}
                src={`data:image/${image.format};base64,${image.base64}`}
                crop={crop}
                ruleOfThirds
                onImageLoaded={(imageRef) => (this.imageRef = imageRef)}
                onComplete={(crop) => this.cropImage(crop)}
                onChange={(crop) => this.setState({ crop })}
                crossorigin="anonymous"
                aspect={16 / 9}
              >
                <img
                  ref={this.imageRef}
                  style={styles.image}
                  src={`data:image/${image.format};base64,${image.base64}`}
                />
              </ReactCrop>              
              <div>
                <button
                  className="btn btn--info btn--small"
                  onClick={() => {                    
                    if (!this.state.croppedImage) {
                      this.cropImage(this.state.crop);
                    }

                    this.setState({ isModalOpen: false });
                  }}
                >
                  CROP
                  <svg className="icon icon--small">
                    <use xlinkHref="images/sprite.svg#crop-simple-solid"></use>
                  </svg>
                </button>
              </div>
            </div>
          </Modal>
        )}
        <div style={styles.imageAreaContainer}>
          {!croppedImage && (
            <div className="preview" style={styles.imagePlaceholder}>
              <p
                style={{
                  fontSize: "1.6rem",
                  color: "#353132",
                  fontFamily: "Myriad-Regular",
                }}
              >
                Upload an image to preview it here
              </p>
            </div>
          )}
          {croppedImage && (
            <div style={styles.cropContainer}>
              <img
                style={styles.image}
                src={`data:image/${gallery.format};base64,${gallery.image}`}
              />
            </div>
          )}
        </div>
        {/* {this.renderButton("Guardar")} */}
      </form>
    );
  }
}

export default Gallery;
