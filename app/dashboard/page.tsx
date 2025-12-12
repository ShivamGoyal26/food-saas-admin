import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <h1>Dashboard Home</h1>
      <Link
        href="/menu-items"
        className={buttonVariants({ variant: "outline" })}
      >
        Go to Menu Items
      </Link>

      <Link
        href="/menu/create"
        className={buttonVariants({ variant: "outline" })}
      >
        Create Menu
      </Link>
    </div>
  );
}
