'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const Promise = require('bluebird');
const debug = require('debug')('cfgram:user');

const Schema = mongoose.Schema;
const userSchema = Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, requried: true, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true},
});

userSchema.methods.generatePasswordHash = function(password) {
  debug('generatePasswordHash');
  return new Promise((resolve, reject) => {
    brypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

userSchema.methods.comparePasswordHash = function(password){
  debug('comparePassowrdHash');

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'invalid passord'));
      reslove(this);
    });
  });
}

userSchema.methods.generateFindHash = function(){
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    let tries = 0;

    _generateFIndHash.call(this);

    function _generateFIndHash(){
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => resolve(this.findHash))
      .catch(err => {
        if (tries > 3) return reject(err);
        tries++;
        _generateFIndHash.call(this);
      })
    }
  })
}

userSchema.methods.generateToken = function(){
  debug('generateToken')

  return new Promise((resolve, reject) => {
    this.generateFindHash()
    .then(findHash => resolve(jwt.sign({token: findHash}, process.env.APP_SECERET)))
    .catch(err => reject(err));
  })
};

module.exports = mongoose.model('user', userSchema);

