import type { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';

interface PageProps {
  title: string;
  children: ReactNode;
}

const Page = ({ title, children }: PageProps) => {
  return (
    <div className="space-y-4">
      <Breadcrumbs />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default Page;
