// Route definitions and configurations
export const PUBLIC_ROUTES = [
  { path: '/', component: 'Home' },
  { path: '/services', component: 'Services' },
  { path: '/pricing', component: 'Pricing' },
  { path: '/contact', component: 'Contact' },
] as const;

export const AUTH_ROUTES = [
  { path: '/login', component: 'Login' },
  { path: '/register', component: 'Register' },
] as const;

export const PROTECTED_ROUTES = [
  { path: '/book', component: 'Book' },
  { path: '/checkout', component: 'Checkout' },
  { path: '/booking-confirmation', component: 'BookingConfirmation' },
  { path: '/my-bookings', component: 'MyBookings' },
  { path: '/profile', component: 'Profile' },
  { path: '/invoice/:id', component: 'Invoice' },
] as const;

export type RouteComponent = 
  | typeof PUBLIC_ROUTES[number]['component']
  | typeof AUTH_ROUTES[number]['component'] 
  | typeof PROTECTED_ROUTES[number]['component'];
