import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function PublicLayout() {
  useLenis();

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <Outlet />
        </main>
        <Footer />
        <OfflineBanner />
      </div>
    </ErrorBoundary>
  );
}
