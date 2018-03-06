'use strict';

const debug = require('debug')('cfgram: server-toggle');
const mongoos = require('mongoose');

exports.serverOn = function(server, done){
  if(!server.isRunning){
    server.listen(process.env.PORT, () => {

    })
    return;
  }
  done();
}

exports.serverOff = function(server, done){
  if(server.isRunning){
    server.close(err =>{
      if(err) return done(err);
      server.isRunning = false;
      mongoose.connection.close();
      debug('server down!');
      done();
    });
    return;
  }
  done();
}