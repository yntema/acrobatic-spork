import $ from 'jquery';
import utils from './utils'

var Auth = {
  confirmUser(username, password, cb, url) {
    url = url || '/api/users/signin'
    if (localStorage.getItem('com.spork')) {
      if (cb) cb(true)
      return
    }
    utils.sendAuthRequest(username, password, url, (res) => {
      if (res.authenticated) {
        localStorage.setItem('com.spork', res.token);
        if (cb) cb(true, res)
      } else {
        if (cb) cb(false, res)
      }
    })
  },

  getUserInfoFromJWT(cb) {
     $.ajax({
      url: '/api/users/signedin',
      beforeSend: function (request) {
        if(Auth.loggedIn()){
          request.setRequestHeader("x-access-token", Auth.getToken());
        }
      },
      success (data) {
        cb(data);
      },
      error (data) {
        console.error('error with jwt check:', data);
        cb(null) 
      }
    });
  },

  getToken() {
    return localStorage.getItem('com.spork');
  },

  logout(cb) {
    localStorage.removeItem('com.spork');
    if (cb) cb()
  },

  loggedIn() {
    return !!localStorage.getItem('com.spork')
  }
}



export default Auth;