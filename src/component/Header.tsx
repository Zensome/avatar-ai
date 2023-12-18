import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { useBuyCredits } from "~/hooks/useBuyCredits";

import { PrimaryLink } from "./PrimaryLink";
import { Button } from "./Button";
import Image from "next/image";

const Header = () => {
  const session = useSession();
  const { buyCredits } = useBuyCredits();

  const isLoggedIn = !!session.data;

  return (
    <header className="dark:bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <PrimaryLink href="/" className="flex items-center gap-2">
          <Image src="/icon.png" alt="Logo" width="40" height="40" />
          Avatar Generator
        </PrimaryLink>
        <ul className="flex gap-4">
          <li>
            <PrimaryLink href="/generate">Generate</PrimaryLink>
          </li>
          <li>
            <PrimaryLink href="/community">Community</PrimaryLink>
          </li>
          {isLoggedIn && (
            <li>
              <PrimaryLink href="/collection">Collection</PrimaryLink>
            </li>
          )}
        </ul>
        <ul className="flex gap-4">
          {isLoggedIn && (
            <>
              <li>
                <Button
                  onClick={() => {
                    buyCredits().catch(console.error);
                  }}
                >
                  Buy Credits
                </Button>
              </li>
              <li>
                <Button
                  variant="secondary"
                  onClick={() => {
                    signOut().catch(console.error);
                  }}
                >
                  Logout
                </Button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li>
              <Button
                onClick={() => {
                  signIn().catch(console.error);
                }}
              >
                Login
              </Button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
