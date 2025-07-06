import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  path: string;
  label: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Generate breadcrumb items based on the current path
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length === 0) return [];
    
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';
    
    // Home is always the first breadcrumb
    breadcrumbs.push({ path: '/', label: 'Home' });
    
    pathParts.forEach(part => {
      currentPath += `/${part}`;
      
      // Convert path segment to a readable label
      const label = part.charAt(0).toUpperCase() + part.slice(1);
      breadcrumbs.push({ path: currentPath, label });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on the home page
  }
  
  return (
    <nav className="text-sm mb-4">
      <ol className="flex space-x-2">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {isLast ? (
                <span className="text-gray-600 font-medium">{breadcrumb.label}</span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
