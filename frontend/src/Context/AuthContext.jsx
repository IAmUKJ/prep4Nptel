import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [username, setUsername] = useState(sessionStorage.getItem('username'));

  const login = (token, username) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('username', username);
    setToken(token);
    setUsername(username);
  };

  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
