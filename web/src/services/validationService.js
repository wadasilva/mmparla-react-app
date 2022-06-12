import JoiValidate from "joi";
import messages from "../translation/validation-translations";
const Joi = JoiValidate.defaults((schema) => schema.options({ messages }));

export default Joi;
