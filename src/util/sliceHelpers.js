export const getInitialState = (schema) => {
  const state = {};
  for (const field in schema) {
    if (schema[field].default) {
      state[field] = schema[field].default;
    }
    if (schema[field].type === String) {
      switch (schema[field].type) {
        case String:
          state[field] = "";
          break;
        case Boolean:
          state[field] = false;
          break;
        default:
          state[field] = "";
      }
    }
  }
  return state;
};
