import { createContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export const UserContext = createContext(null);

const defaultUser = {
  name: 'Shriya Sharma',
  email: 'shriya@example.com',
  avatar: 'SS',
  loggedIn: true,
  remember: true
};

export function UserProvider({ children }) {
  const [user, setUser] = useLocalStorage('taskflow-user', defaultUser);

  function login(email, remember) {
    setUser({
      name: email.split('@')[0] || 'TaskFlow User',
      email,
      avatar: email.slice(0, 2).toUpperCase(),
      loggedIn: true,
      remember
    });
  }

  function signup(name, email) {
    setUser({
      name,
      email,
      avatar: name
        .split(' ')
        .map((item) => item[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      loggedIn: true,
      remember: true
    });
  }

  function logout() {
    setUser({ ...defaultUser, loggedIn: false });
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
}
