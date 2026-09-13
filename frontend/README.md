# Course Selling Frontend

React and TypeScript frontend built with Vite. During development, requests to `/api` are proxied to the Express backend at `http://localhost:3300`.

```sh
npm install
npm run dev
npm run build
npm run lint
```

Copy `.env.example` to `.env` only when the API base path needs to be overridden. The default `/api/v1` value works with the Vite development proxy.

The current frontend includes public course browsing, login and signup, persistent authentication, an authenticated navigation banner, a working wishlist, profile details, and a course-details modal with wishlist and cart actions. My Courses and Cart pages are prepared for their remaining API work.
