"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="grid min-h-[100dvh] place-items-center place-content-center gap-3">
      <Image src="/error-dark.png" height="300" width="300" alt="Error" className="dark:hidden" />
      <Image src="/error.png" height="300" width="300" alt="Error" className="hidden dark:block" />

      <h2 className="text-xl font-medium">404</h2>
      <p className="text-center text-muted-foreground">Page not found</p>

      <Link href="/" className="flex items-center gap-2">
        <ArrowLeft className="mr-2 size-4" />
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
