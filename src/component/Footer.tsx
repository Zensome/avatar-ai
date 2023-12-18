import { PrimaryLink } from "./PrimaryLink";

export function Footer() {
  return (
    <footer className="dark:bg-slate-900">
      <div className="container mx-auto grid h-12 items-center bg-slate-900 text-center">
        <p className="text-gray-400">
          A demo project for me to learn fullstack Next.js and Google Auth API
          with Stripe integration.
        </p>
      </div>
    </footer>
  );
}
