import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
}

const Card = ({ children, title, description, footer, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow dark:bg-gray-800 ${className}`}>
      {(title || description) && (
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="p-4 sm:p-6">{children}</div>
      
      {footer && (
        <div className="px-4 py-3 sm:px-6 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;