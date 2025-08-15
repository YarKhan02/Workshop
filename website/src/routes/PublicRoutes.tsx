
import { Route } from 'react-router-dom';
import { Home, Services, Contact } from '../pages';

export const PublicRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<Services />} />
    <Route path="/contact" element={<Contact />} />
  </>
);

export default PublicRoutes;
