"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError('Credenciais inválidas');
      } else {
        router.replace('/admin');
      }
    } catch {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,5%)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image src="/logo-hibiscus.png" alt="Hibiscus" fill className="object-contain" />
          </div>
          <h1 className="font-serif text-[hsl(40,60%,55%)] text-2xl">Administração</h1>
          <p className="text-[hsl(40,10%,45%)] text-xs mt-1">Panamby Hotel &middot; Hibiscus</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(40,10%,40%)]" />
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e?.target?.value ?? '')}
              placeholder="Email"
              required
              className="w-full bg-[hsl(0,0%,10%)] border border-[hsl(0,0%,18%)] rounded-lg py-3 pl-10 pr-4 text-sm text-[hsl(40,20%,85%)] placeholder:text-[hsl(40,10%,35%)] focus:outline-none focus:border-[hsl(40,60%,40%)] transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(40,10%,40%)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e?.target?.value ?? '')}
              placeholder="Senha"
              required
              className="w-full bg-[hsl(0,0%,10%)] border border-[hsl(0,0%,18%)] rounded-lg py-3 pl-10 pr-10 text-sm text-[hsl(40,20%,85%)] placeholder:text-[hsl(40,10%,35%)] focus:outline-none focus:border-[hsl(40,60%,40%)] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(40,10%,40%)] hover:text-[hsl(40,20%,60%)]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error ? (
            <p className="text-red-400 text-xs text-center">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[hsl(40,60%,55%)] hover:bg-[hsl(40,60%,45%)] text-[hsl(0,0%,5%)] font-medium py-3 rounded-lg transition-colors disabled:opacity-50 text-sm tracking-wider"
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
