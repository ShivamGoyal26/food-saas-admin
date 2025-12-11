"use client";

import { Button } from "@/components/ui/button";
import MenuItem from "./components/menu-item";
import { useGetMenuItems } from "./hooks";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data, isLoading } = useGetMenuItems();
  const router = useRouter();

  return (
    <div>
      <h1 className="text-3xl text-teal-300 mb-10">Menu Items</h1>

      <Button
        onClick={() => {
          router.push("/menu-items/create");
        }}
        className="cursor-pointer mb-10"
        variant={"outline"}
      >
        Create New Menu Item
      </Button>

      {isLoading ? (
        <p>Loading...</p>
      ) : data?.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        <ul className="flex flex-col gap-8">
          {data?.map((menu) => (
            <div
              key={menu._id}
              onClick={() => router.push(`/menu-items/${menu._id}`)}
              className="cursor-pointer hover:bg-accent rounded-lg transition"
            >
              <MenuItem menu={menu} />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
