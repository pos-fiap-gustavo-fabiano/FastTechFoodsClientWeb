
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuthApi } from '@/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  login: (emailOrCpf: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

// Mock users for demonstration (fallback quando API não está disponível)
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    cpf: '12345678901',
    phone: '(11) 99999-9999',
    password: '123456'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    cpf: '98765432109',
    phone: '(11) 88888-8888',
    password: '123456'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const authApi = useAuthApi();

  useEffect(() => {
    const savedUser = localStorage.getItem('fasttech_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (emailOrCpf: string, password: string): Promise<boolean> => {
    setError(null);
    
    try {
      console.log('Tentando login com:', emailOrCpf);
      
      // Tentar login na API real
      const response = await authApi.login(emailOrCpf, password);
      
      if (response.token && response.user) {
        const userData: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          cpf: response.user.cpf,
          phone: '' // A API não retorna phone, então definimos como string vazia
        };
        
        setUser(userData);
        localStorage.setItem('fasttech_user', JSON.stringify(userData));
        localStorage.setItem('fasttech_token', response.token);
        localStorage.setItem('fasttech_refresh_token', response.refreshToken);
        console.log('Login realizado com sucesso via API');
        return true;
      }
      
      return false;
    } catch (apiError) {
      console.warn('API de login indisponível, usando fallback:', apiError);
      
      // Fallback para mock users se API falhar
      const isEmail = emailOrCpf.includes('@');
      const foundUser = mockUsers.find(u => 
        isEmail 
          ? u.email === emailOrCpf && u.password === password
          : u.cpf === emailOrCpf && u.password === password
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('fasttech_user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('fasttech_token', 'mock_token_' + Date.now());
        console.log('Login realizado com sucesso via fallback');
        return true;
      }
      
      setError('Credenciais inválidas');
      console.log('Login falhou - credenciais inválidas');
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    setError(null);
    console.log('Registrando usuário:', userData.name);
    
    // TODO: Implementar chamada para API de registro quando disponível
    // Por enquanto, simular registro local
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      cpf: userData.cpf,
      phone: userData.phone
    };
    
    setUser(newUser);
    localStorage.setItem('fasttech_user', JSON.stringify(newUser));
    localStorage.setItem('fasttech_token', 'mock_token_' + Date.now());
    console.log('Usuário registrado com sucesso');
    return true;
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('fasttech_user');
    localStorage.removeItem('fasttech_token');
    localStorage.removeItem('fasttech_refresh_token');
    console.log('Logout realizado');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading: authApi.isLoading,
      error: error || authApi.error
    }}>
      {children}
    </AuthContext.Provider>
  );
};
