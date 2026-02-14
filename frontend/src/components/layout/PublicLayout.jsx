/**
 * Public Layout
 * Layout wrapper for public pages
 */

import Header from './Header';
import Footer from './Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
