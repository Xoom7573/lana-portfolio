import type { Access } from "payload";

// Logged-in editors see drafts; everyone else only sees what's published.
export const publishedOrLoggedIn: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: "published" } };

export const loggedIn: Access = ({ req: { user } }) => Boolean(user);
