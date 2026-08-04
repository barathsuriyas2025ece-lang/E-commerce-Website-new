import React from 'react';
import { useLocation } from 'react-router-dom';

const PageTransitionWrapper = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition min-h-[calc(100vh-4rem)]">
      {children}
    </div>
  );
};

export default PageTransitionWrapper;
