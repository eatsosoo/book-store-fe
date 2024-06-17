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

export const minLength = (v: string, minLength: number) => {
  return v.length >= minLength || `Field must have at least ${minLength} characters`;
};

export const email = (v: any) => { 
  const pattern = /^[^\s@]+@[^\s@]+.[^\s@]+$/; return pattern.test(v) || "Invalid email"; 
};

export const telephone = (v: any) => {
  const pattern = /^\d{10}$/;
  return pattern.test(v) || "Invalid telephone number";
};
