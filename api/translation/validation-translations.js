module.exports = {
  es: {
    "any.unknown": "no esta permitido",
    "any.only": "{{#label}} debe ser uno de los valores {{#valids}}",
    "any.invalid": "contiene un valor invalido",
    "any.empty": "no está permitido que sea vacío",
    "any.required": "{{#label}} es de cumplimento obligatorio",
    "any.default": "emitió un error cuando se ejecutó el metodo default",
    "alternatives.base":
      "no coincide con ninguna de las alternativas permitidas",
    "array.base": "debe ser un array",
    "array.includes":
      "en la posición {{pos}} no coincide con ninguno de los tipos permitidos",
    "array.includesSingle":
      'el valor de "{{!key}}" no coincide con ninguno de los tipos permitidos',
    "array.includesOne": "en la posición {{pos}} falló porque {{reason}}",
    "array.includesOneSingle": 'el valor "{{!key}}" falló porque {{reason}}',
    "array.includesRequiredUnknowns":
      "no contiene valor/es requerido/s: {{unknownMisses}} ",
    "array.includesRequiredKnowns": "no contiene: {{knownMisses}}",
    "array.includesRequiredBoth":
      "no contiene {{knownMisses}} y {{unknownMisses}} otros valores requeridos",
    "array.excludes": "en la posición {{pos}} contiene un valor excluído",
    "array.excludesSingle": 'el valor "{{!key}}" contiene un valor excluído',
    "array.min": "debe contener al menos {{limit}} items",
    "array.max": "debe contener máximo {{limit}} items",
    "array.length": "debe contener exactamente {{limit}} items",
    "array.ordered": "en la posición {{pos}} falló porque {{reason}}",
    "array.orderedLength":
      "en la posición {{pos}} falló porque el array debre contener como máximo {{limit}} items",
    "array.sparse": "no debe ser un array esparcido",
    "array.unique": "posición {{pos}} contiene un valor duplicado",
    "boolean.base": "{{#label}} debe ser un valor verdadero/falso o si/no",
    "binary.base": "debe ser un buffer o un string",
    "binary.min": "debe ser como mínimo de {{limit}} bytes",
    "binary.max": "debe ser como máximo de {{limit}} bytes",
    "binary.length": "debe tener exactamente {{limit}} bytes",
    "date.base":
      "debe ser una cantidad de milisegundos o una fecha en cadena de texto válida",
    "date.min": 'debe ser mayor o igual a "{{limit}}"',
    "date.max": 'debe ser menor o igual que "{{limit}}"',
    "date.isoDate": "debe ser una fecha en formato ISO 8601",
    "date.ref": 'referencia a "{{ref}}", que no es una fecha válida',
    "function.base": "debe ser una función",
    "object.base": "debe ser un objeto",
    "object.child": 'hijo "{{!key}}" falló porque {{reason}}',
    "object.min": "debe tener como mínimo {{limit}} hijo",
    "object.max": "debe tener menos o a lo sumo {{limit}} hijo",
    "object.length": "debe tener máximo {{limit}} hijo/s",
    "object.allowUnknown": "no está permitido",
    "object.with": 'peer faltante: "{{peer}}"',
    "object.unknown": "El campo {{#label}} no esta permitido",
    "object.without": 'conflicto con peer prohibido: "{{peer}}"',
    "object.missing": "debe contener al menos uno de: {{peers}}",
    "object.xor": "contiene un conflicto con alguno de: {{peers}}",
    "object.or": "debe contener al menos uno de: {{peers}}",
    "object.and": "contiene {{present}} sin el requerido: {{missing}}",
    "object.nand": '!!"{{main}}" no debe existir simultáneamente con {{peers}}',
    "object.assert":
      '!!"{{ref}}" falló validacion porque "{{ref}}" falló a {{message}}',
    "object.rename.multiple":
      'no se puede renombrar el hijo "{{from}}" porque múltiples re-nombramientos estan deshabilitados y otra clave fue renombrada a "{{to}}"',
    "object.rename.override":
      'no se puede renombrar el hijo "{{from}}" porque la sobre escritura esta deshabilitada y el target "{{to}}" existe',
    "object.type": 'debe ser una instancia de "{{type}}"',
    "number.base": "debe ser un número",
    "number.min": "debe ser mayor o igual que {{#limit}}",
    "number.max": "debe ser menor o igual que {{#limit}}",
    "number.less": "debe ser menor a {{#limit}}",
    "number.greater": "debe ser mayor a {{limit}}",
    "number.float": "debe ser un numero flotante",
    "number.integer": "debe ser un número entero",
    "number.negative": "debe ser un número negativo",
    "number.positive": "{{#label}} debe ser un número positivo",
    "number.precision": "{{#label}} no debe tener mas de {{#limit}} decimales",
    "number.ref": 'referencia a "{{ref}}" que no es un número',
    "number.multiple": "debe ser un múltiplo de {{multiple}}",
    "string.base": "{{#label}} debe ser una cadena de texto",
    "string.base64": "{{#label}} debe ser una string en formato base64",
    "string.empty": "{{#label}} es de cumplimento obligatorio",
    "string.min":
      "{{#label}} debe ser mínimo de {{#limit}} caracteres de largo",
    "string.max":
      "{{#label}} debe ser de máximo {{#limit}} caracteres de largo",
    "string.length": "debe ser exactamente de {{limit}} caracteres de largo",
    "string.alphanum": "debe contener solo letras y números",
    "string.token": "debe contener solo letras, números y guines bajos",
    "string.regex.base":
      'el valor "{{!value}}" no coincide con el pattern requerido: {{pattern}}',
    "string.regex.name":
      'el valor "{{!value}}" no coincide con el nombre de pattern {{name}}',
    "string.email": "{{#label}} debe ser un email válido",
    "string.uri": "debe sre una uri válida",
    "string.uriCustomScheme":
      "debe ser una uri válida con el esquema concidiente con el patrón {{scheme}}",
    "string.isoDate": "debe ser una fecha en formato ISO 8601 válida",
    "string.guid": "debe ser un GUID valido",
    "string.hex": "debe contener solo caracteres hexadecimales",
    "string.hostname": "deber ser un hostname válido",
    "string.lowercase": "solo debe contener minúsculas",
    "string.pattern.name":
      "{{#label}} no coincide con el formato especificado {{#regex}}",
    "string.uppercase": "solo debe contener mayúsculas",
    "string.trim": "no debe tener espacios en blanco delante o atrás",
    "string.creditCard": "debe ser una tarjeta de crédito",
    "string.ref": 'referencia "{{ref}}" que no es un númerp',
    "string.ip": "debe ser una dirección ip válida con un CDIR {{cidr}}",
    "string.ipVersion":
      "debe ser una dirección ip válida de una de las siguientes versiones {{version}} con un CDIR {{cidr}}",
  },
};