import React from 'react';
import { Route } from 'react-router-dom';
import { Home, Services, Pricing, Contact } from '../pages';

export const PublicRoutes: React.FC = () => (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<Services />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/contact" element={<Contact />} />
  </>
);

export default PublicRoutes;
