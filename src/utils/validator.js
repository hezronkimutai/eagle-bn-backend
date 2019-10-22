/* eslint-disable require-jsdoc */
/* eslint-disable no-prototype-builtins */

class Validate {
  constructor(data) {
    this.key = Object.keys(data);
    this.val = Object.values(data)[0].body[this.key] || Object.values(data)[0].query[this.key];
    this.status = 200;
    this.data = Object.entries(data)[0][1].body;
  }

  str() {
    if (this.val && typeof JSON.stringify(this.val) !== 'string') {
      this.status = 400;
      throw new Error()`${this.key} should be a string`;
    }
    return this;
  }

  req() {
    if (!this.data.hasOwnProperty(this.key) || !this.val) {
      this.status = 400;
      throw new Error(`${this.key} is required`);
    }
    return this;
  }

  min(len) {
    if (this.val && this.val.length < len) {
      this.status = 400;
      throw new Error(`${this.key} length should be greater than ${len - 1}`);
    }
    return this;
  }

  alpha() {
    if (this.val && (!this.error) && (!this.val.match(/[a-zA-Z]{2}/))) {
      this.status = 400;
      throw new Error(`${this.key} should be alphabetic and have 2 character minimum`);
    }
    return this;
  }

  num() {
    if (this.val && (!this.error) && (!this.val.match(/[0-9]{1}/))) {
      this.status = 400;
      throw new Error(`${this.key} should be a number`);
    }
    return this;
  }

  alphaNum() {
    if (this.val && (!this.val.match(/^[a-zA-Z0-9]+$/))) {
      throw new Error(`${this.key} should be alphanumeric`);
    }
    return this;
  }

  email() {
    if (this.val && (!this.error) && (!this.val.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
      throw new Error(`Invalid ${this.key} address`);
    }
    return this;
  }

  confirm() {
    if (this.val && this.val !== this.data.confirmPassword) {
      throw new Error(`${this.key} provided do not match`);
    }
    return this;
  }

  gender() {
    if (this.val && !this.val.match(/^(Male|Female|MALE|FEMALE|male|female)$/)) {
      this.status = 400;
      throw new Error(`${this.key} is invalid`);
    }
    return this;
  }

  withSpec() {
    if (this.val && (!this.val.match(/[a-zA-Z0-9]+/) || !this.val.match(/[#*@!&]+/))) {
      throw new Error(`${this.key} should have 1 special character and alphanumeric`);
    }
    return this;
  }
}


export default Validate;
