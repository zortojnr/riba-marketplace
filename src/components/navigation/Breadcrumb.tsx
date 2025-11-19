import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';

export const Breadcrumb: React.FC = () => {
  const { getBreadcrumbs } = useNavigation();
  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb__list">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="breadcrumb__item">
            {index > 0 && (
              <ChevronRight className="breadcrumb__separator" aria-hidden="true" />
            )}
            {crumb.isLast ? (
              <span className="breadcrumb__current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="breadcrumb__link">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};