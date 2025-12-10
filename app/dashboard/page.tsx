import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Dashboard Home</h1>
      <Link
        href="/menu-items"
        className={buttonVariants({ variant: "outline" })}
      >
        Go to Menu Items
      </Link>
    </div>
  );
}
