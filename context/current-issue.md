When the page is first loaded, this error occurs: 
## Error Type
Runtime Error

## Error Message

Clerk: The <SignIn/> component is not configured correctly. The most likely reasons for this error are:

1. The "/sign-in" route is not a catch-all route.
It is recommended to convert this route to a catch-all route, eg: "/sign-in/[[...rest]]/page.tsx". Alternatively, you can update the <SignIn/> component to use hash-based routing by setting the "routing" prop to "hash".

2. The <SignIn/> component is mounted in a catch-all route, but all routes under "/sign-in" are protected by the middleware.
To resolve this, ensure that the middleware does not protect the catch-all route or any of its children. If you are using the "createRouteMatcher" helper, consider adding "(.*)" to the end of the route pattern, eg: "/sign-in(.*)". For more information, see: https://clerk.com/docs/reference/nextjs/clerk-middleware#create-route-matcher


Next.js version: 16.2.7 (Turbopack)

after signed in with clerk, instead of routing to the user profile page, it goes to this page: 
http://localhost:3000/sign-in/sso-callback?sign_in_force_redirect_url=http%3A%2F%2Flocalhost%3A3000%2Feditor