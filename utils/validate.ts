export const required = (v: any) => {
  return !!v || "Field is required";
};

export const number = (v: any) => {
  return /^\d+$/.test(v) || "Field must be a number";
};

export const url = (v: any) => {
  const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
  return pattern.test(v) || "Invalid URL";
};
