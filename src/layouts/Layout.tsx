import React from 'react';
import Header from '../components/Header';
import ReadingProgress from '../components/ReadingProgress';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-dynamic bg-bg-deep selection:bg-primary/30 font-sans overflow-x-hidden w-full">
      <ReadingProgress />
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <React.Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          {children}
        </React.Suspense>
      </main>
      
      <footer className="border-t border-border-subtle py-12 mt-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm italic">
            &copy; {new Date().getFullYear()} Nexus Blog. Built with React & FastAPI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
