import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index('routes/home.tsx'),  // Loader redirects from home to signup.
  route('/signup', 'routes/signup.tsx'),
  route('/email-verification', 'routes/email-verification.tsx'),
] satisfies RouteConfig;
