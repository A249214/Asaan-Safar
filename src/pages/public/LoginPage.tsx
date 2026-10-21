import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Bus, ArrowLeft, KeyRound } from 'lucide-react';
import { DEMO_USERS } from '@/lib/mock-data';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      const user = useAuthStore.getState().user;
      if (user?.role === 'conductor') navigate('/conductor');
      else if (['admin', 'super_admin', 'manager'].includes(user?.role ?? '')) navigate('/admin');
      else navigate(from);
    } catch {
      // handled in store
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#171A1D]"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 20%, rgba(32, 53, 47, 0.4) 0%, rgba(23, 26, 29, 0.95) 70%), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Decorative ambient road line */}
      <div className="absolute inset-0 bg-[#171A1D]/80 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card Shell */}
        <div className="rounded-2xl bg-[#22272A]/95 border border-[#343A3C] p-8 shadow-card-dark backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-7">
            <Link to="/" className="inline-flex items-center justify-center mb-4 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#20352F] to-[#162521] border border-[#343A3C] flex items-center justify-center text-[#C79A45] shadow-brass transition-transform group-hover:scale-105">
                <Bus className="w-7 h-7" />
              </div>
            </Link>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="font-display font-bold text-2xl text-[#F5F1E8]">Asaan<span className="text-[#C79A45]">Safar</span></span>
              <span className="text-[11px] font-bold text-[#5F8F72] px-2 py-0.5 rounded bg-[#20352F] border border-[#343A3C]">آسان سفر</span>
            </div>
            <p className="text-xs text-[#A9A59B] uppercase font-mono tracking-wider">
              Staff & Terminal Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A9A59B]">
                Staff Email
              </label>
              <input
                type="email"
                placeholder="e.g. admin@asaansafar.pk"
                {...register('email')}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] text-sm focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45] transition-colors"
              />
              {errors.email?.message && (
                <p className="text-xs text-[#B85C4A] font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A9A59B]">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] text-sm focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45] transition-colors"
              />
              {errors.password?.message && (
                <p className="text-xs text-[#B85C4A] font-medium">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2 font-semibold shadow-brass"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#171A1D] border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In</span>
                </span>
              )}
            </Button>
          </form>

          {/* 1-Click Demo Accounts Quick Filler */}
          <div className="mt-6 pt-5 border-t border-[#343A3C]/70">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-[#A9A59B] flex items-center gap-1.5 font-mono">
                <KeyRound className="w-3.5 h-3.5 text-[#C79A45]" /> Demo Accounts:
              </span>
              <span className="text-[10px] text-[#5F8F72] font-mono">Click to fill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => handleQuickFill(u.email, u.password)}
                  className="px-2.5 py-2 rounded-lg bg-[#171A1D] hover:bg-[#20352F] border border-[#343A3C] hover:border-[#C79A45] transition-all text-center group"
                >
                  <p className="text-[11px] font-bold text-[#F5F1E8] group-hover:text-[#C79A45] capitalize">
                    {u.role.replace('_', ' ')}
                  </p>
                  <p className="text-[9px] text-[#A9A59B] font-mono truncate">
                    {u.email.split('@')[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#A9A59B] hover:text-[#C79A45] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
