/* eslint-disable require-jsdoc */
/* eslint-disable no-prototype-builtins */

class Validate {
  constructor(data) {
    this.key = Object.keys(data);
    this.val = Object.values(data)[0].body[this.key];
    this.status = 200;
    this.data = Object.entries(data)[0][1].body;
  }

  str() {
    if (typeof this.val !== 'string') {
      this.status = 400;
      this.error = `${this.key} should be a string`;
      this.val = JSON.stringify(this.val);
      return this;
    }
    return this;
  }

  req() {
    if (!this.data.hasOwnProperty(this.key) || !this.val) {
      this.status = 400;
      this.error = `${this.key} is required`;
      return this;
    }
    return this;
  }

  min(len) {
    if (!this.val) {
      this.status = 400;
      this.error = `${this.key} is required`;
      return this;
    }
    if (this.val.length < len) {
      this.status = 400;
      this.error = `${this.key} length should be greater than ${len - 1}`;
      return this;
    }
    return this;
  }

  alpha() {
    if ((!this.error) && (!this.val.match(/[a-zA-Z]{2}/))) {
      this.status = 400;
      this.error = `${this.key} should be alphabetic and have 2 character minimum`;
      return this;
    }
    return this;
  }

  alphaNum() {
    if ((!this.error) && (!this.val.match(/[a-zA-Z]+/) || !this.val.match(/[0-9]+/) || !this.val.match(/[#*@!&]+/))) {
      this.status = 400;
      this.error = `${this.key} should be alphanumeric`;
      return this;
    }
    return this;
  }

  email() {
    if ((!this.error) && (!this.val.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
      this.status = 400;
      this.error = `Invalid ${this.key} address`;
      return this;
    }
    return this;
  }

  confirmPass() {
    if (this.val !== this.data.confirmPassword) {
      this.status = 400;
      this.error = `${this.key} provided do not match`;
      return this;
    }
    return this;
  }
}


export default Validate;
