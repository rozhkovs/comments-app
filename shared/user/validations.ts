// https://www.regular-expressions.info/email.html
const emailReg = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/;
export const checkFormatEmail = (email: string) => {
  return emailReg.test(email.toLowerCase());
};

const nameRag = /^[a-zA-Z0-9]+$/;
export const checkFormatName = (name: string) => {
  return nameRag.test(name);
};
