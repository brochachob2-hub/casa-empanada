const Auth = {
  _key: 'casa_admin_session',

  login(username, password) {
    if (username === 'CasaEmpanada' && password === 'Empanada_adminPH') {
      sessionStorage.setItem(this._key, JSON.stringify({
        user: username,
        loggedIn: true,
        time: Date.now()
      }));
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem(this._key);
  },

  check() {
    try {
      const s = JSON.parse(sessionStorage.getItem(this._key));
      return s && s.loggedIn === true;
    } catch {
      return false;
    }
  },

  guard() {
    if (!this.check()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

window.Auth = Auth;
