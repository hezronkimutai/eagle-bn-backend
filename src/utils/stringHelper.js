/* eslint-disable require-jsdoc */
function stringHelper() {
  this.signupSuccess = 'Account created successfully';
  this.signupEmailExist = 'This email already exists';
  // eslint-disable-next-line arrow-parens
  this.emailBody = (req, token) => `
  <h1> BareFoot Nomad <h1>
  <h6> number one travel company </h6>
  <h3> click on the link below to verify your email <h3>
  <a href ="${req.protocol}://${req.get('host')}/api/v1/users/verify/${token}"> verify email </a>`;
  // eslint-disable-next-line arrow-parens
  this.changeRoleEmail = (req) => `
  <h1> BareFoot Nomad <h1>
  <h6> Your role has been changed to ${req.body.new_role} </h6>
  `;
}
export default new stringHelper();
