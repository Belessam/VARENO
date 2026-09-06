/**
 * NotFound (404) Page
 */

import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-gutter-mobile py-2xl text-center">
      <Icon name="search_off" size="xl" className="text-outline mb-4" />
      <h1 className="font-display text-display-xl-mobile lg:text-display-xl text-on-surface uppercase tracking-[0.02em] mb-2">
        404
      </h1>
      <p className="font-body text-body-lg text-on-surface-variant max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">RETURN TO ATELIER HOME</Button>
      </Link>
    </main>
  );
}
