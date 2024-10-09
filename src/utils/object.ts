export const formDataToObject = (formData: FormData) => {
  const obj: { [key: string]: FormDataEntryValue } = {};

  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};
