export const isCorrect = (schema, fieldDetails) => {
  for (const field in schema) {
    if (schema[field].required && fieldDetails[field] === "") return false;
    else if (schema[field].type === String) {
      if (schema[field].minlength > fieldDetails[field]) return false;
      if (schema[field].maxlength < fieldDetails[field]) return false;
    }
  }

  return true;
};
