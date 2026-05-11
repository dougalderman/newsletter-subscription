import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index('routes/home.tsx'),  // Loader redirects from home to signup.
  route('/signup', 'routes/signup.tsx'),
  route('/email-verification', 'routes/email-verification.tsx'),
  route('/admin', 'routes/admin.tsx'),
  route('/login', 'routes/login.tsx'),
  route( // Handle console error.
    '/.well-known/appspecific/com.chrome.devtools.json',
    'routes/debug-null.tsx',
  ),
] satisfies RouteConfig;
