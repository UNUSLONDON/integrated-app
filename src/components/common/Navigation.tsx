import { NavLink } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

interface NavigationProps {
  items: NavItem[];
}

const Navigation = ({ items }: NavigationProps) => {
  return (
    <nav className="flex space-x-1">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          {item.icon && (
            <span className="mr-2">
              <i className={item.icon} />
            </span>
          )}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
