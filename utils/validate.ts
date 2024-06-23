export const required = (v: any) => {
  return !!v ? undefined : "Trường này là bắt buộc";
};

export const number = (v: any) => {
  return /^\d+$/.test(v) || "Trường này phải là số";
};

export const url = (v: any) => {
  const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
  return pattern.test(v) || "URL không hợp lệ";
};

export const minLength = (v: string, minLength: number) => {
  return v.length >= minLength || `Trường này phải có ít nhất ${minLength} ký tự`;
};

export const email = (v: any) => { 
  const pattern = /^[^\s@]+@[^\s@]+.[^\s@]+$/; 
  return pattern.test(v) || "Email không hợp lệ"; 
};

export const telephone = (v: any) => {
  const pattern = /^\d{10}$/;
  return pattern.test(v) || "Số điện thoại không hợp lệ";
};
