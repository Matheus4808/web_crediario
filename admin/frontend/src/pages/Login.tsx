import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

// Credenciais mock para demonstração
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao autenticar');
      }

      // Salva token e dados do usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('filial', data.filial.toString());
      localStorage.setItem('email', data.email);
      localStorage.setItem('isAuthenticated', 'true');

      toast({
        title: 'Login realizado com sucesso!',
        description: `Filial ${data.filial} autenticada`
      });

      navigate('/painel');

    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="A Ideal Modas"
              className="h-10 md:h-12 w-auto drop-shadow-sm"
              loading="eager"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Ideal Modas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acesso ao painel administrativo
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-background/80">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              Entrar no painel
            </CardTitle>
            <CardDescription className="text-center">
              Informe seus dados para continuar
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            {/* Credenciais de demonstração */}
            <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Esqueceu a senha? ligue para o suporte!
              </p>

              {/* <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">E-mail:</span>{" "}
                  <code className="bg-background px-2 py-0.5 rounded text-primary">
                    admin@idealmodas.com
                  </code>
                </p>
                <p>
                  <span className="text-muted-foreground">Senha:</span>{" "}
                  <code className="bg-background px-2 py-0.5 rounded text-primary">
                    123456
                  </code>
                </p>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2026 A Ideal Modas — Todos os direitos reservados
        </p>
      </div>
    </div>
  );

};

export default Login;
