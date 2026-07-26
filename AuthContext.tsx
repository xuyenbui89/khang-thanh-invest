import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (username: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateAccountDetails: (newUsername: string, newPassword?: string, newFullName?: string, avatarUrl?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('crm_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('crm_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // fallback
      }
    }
    return INITIAL_USERS[0]; // Default Super Admin administrator
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('crm_theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('crm_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('crm_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('crm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = (usernameInput: string, passInput: string) => {
    const cleanUsername = usernameInput.trim();
    // Default admin login credentials: administrator / 123123Aa@
    if (cleanUsername === 'administrator' && passInput === '123123Aa@') {
      const adminUser = users.find(u => u.username === 'administrator') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      return { success: true, message: 'Đăng nhập thành công với quyền Super Admin!' };
    }

    const found = users.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase() || u.email.toLowerCase() === cleanUsername.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return { success: true, message: `Đăng nhập thành công với tài khoản ${found.fullName}!` };
    }

    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác! (Mặc định admin: administrator / 123123Aa@)' };
  };

  const logout = () => {
    setCurrentUser(INITIAL_USERS[0]);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || {
      id: `usr_${role}_temp`,
      username: `user_${role}`,
      fullName: `Tài khoản mẫu ${role.toUpperCase()}`,
      email: `${role}@crmtro.vn`,
      phone: '0900000000',
      role: role,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };
    setCurrentUser(targetUser);
  };

  const updateAccountDetails = (newUsername: string, newPassword?: string, newFullName?: string, avatarUrl?: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          username: newUsername || u.username,
          fullName: newFullName || u.fullName,
          avatarUrl: avatarUrl || u.avatarUrl,
          isFirstLogin: false
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    const updatedCurrent = updatedUsers.find(u => u.id === currentUser.id);
    if (updatedCurrent) {
      setCurrentUser(updatedCurrent);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        theme,
        toggleTheme,
        login,
        logout,
        switchRole,
        updateAccountDetails
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
