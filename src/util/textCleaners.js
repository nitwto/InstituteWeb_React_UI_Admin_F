export const text_cleaner = (text) => {
  var result = text.slice(1);
  result = result.replace("_", " ");
  result = result.replace(/\//g, " ");
  result = result.toLowerCase();
  var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
};
