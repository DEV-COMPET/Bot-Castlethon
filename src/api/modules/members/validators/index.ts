export function validateEmail(email: string): boolean {
  const regexp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email.toLocaleLowerCase());
}
export function validateLinkedin(linkedin: string): boolean {
  const regexp = /^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/;
  return regexp.test(linkedin);
}
export function validateImgUrl(url_imagem: string): boolean {
  const regexp = /^https:\/\/[a-z]\.ibb\.co\/.*\/.*\.jpg/;
  return regexp.test(url_imagem);
}
export default {
  validateEmail,
  validateLinkedin,
  validateImgUrl,
};
