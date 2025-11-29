import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = '' }: PageContainerProps) => {
  return (
    <div className={`min-h-screen pt-20 pb-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
