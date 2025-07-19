
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [cpfLoginData, setCpfLoginData] = useState({ cpf: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    cpf: '', 
    phone: '', 
    password: '',
    confirmPassword: ''
  });
  const { login, register, isLoading, error } = useAuth();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando login com email');
    
    const success = await login(loginData.email, loginData.password);
    
    if (success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao FastTech Foods!",
      });
      onClose();
      setLoginData({ email: '', password: '' });
    } else {
      toast({
        title: "Erro no login",
        description: error || "Email ou senha incorretos. Tente: joao@email.com / 123456",
        variant: "destructive",
      });
    }
  };

  const handleCPFLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando login com CPF');
    
    const success = await login(cpfLoginData.cpf, cpfLoginData.password);
    
    if (success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao FastTech Foods!",
      });
      onClose();
      setCpfLoginData({ cpf: '', password: '' });
    } else {
      toast({
        title: "Erro no login",
        description: error || "CPF ou senha incorretos. Tente: 12345678901 / 123456",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    console.log('Iniciando registro de usuário');
    
    const success = await register({
      name: registerData.name,
      email: registerData.email,
      cpf: registerData.cpf,
      phone: registerData.phone,
      password: registerData.password
    });
    
    if (success) {
      toast({
        title: "Conta criada!",
        description: "Bem-vindo ao FastTech Foods!",
      });
      onClose();
      setRegisterData({ 
        name: '', 
        email: '', 
        cpf: '', 
        phone: '', 
        password: '',
        confirmPassword: ''
      });
    } else {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            FastTech Foods
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="cpf">CPF</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full gradient-primary" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
              <p className="text-xs text-center text-gray-500">
                Use: joao@email.com / 123456 para teste
              </p>
            </form>
          </TabsContent>
          
          <TabsContent value="cpf" className="space-y-4">
            <form onSubmit={handleCPFLogin} className="space-y-4">
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpfLoginData.cpf}
                  onChange={(e) => setCpfLoginData({...cpfLoginData, cpf: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpf-password">Senha</Label>
                <Input
                  id="cpf-password"
                  type="password"
                  placeholder="Sua senha"
                  value={cpfLoginData.password}
                  onChange={(e) => setCpfLoginData({...cpfLoginData, password: e.target.value})}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full gradient-primary" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
              <p className="text-xs text-center text-gray-500">
                Use: 12345678901 / 123456 para teste
              </p>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-cpf">CPF</Label>
                <Input
                  id="register-cpf"
                  placeholder="000.000.000-00"
                  value={registerData.cpf}
                  onChange={(e) => setRegisterData({...registerData, cpf: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="register-password">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Sua senha"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full gradient-primary" 
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
