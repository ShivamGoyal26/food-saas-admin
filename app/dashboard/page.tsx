import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { UtensilsCrossed, Menu } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your restaurant's menu items and daily menus
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Menu Items Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow duration-300 border border-border/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Menu Items</h2>
                <p className="text-muted-foreground">
                  Create and manage individual menu items with images, sizes,
                  prices, and dietary information
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
            </div>
            <Link
              href="/menu-items"
              className={
                buttonVariants({ variant: "default" }) +
                " w-full justify-center"
              }
            >
              Browse Menu Items
            </Link>
          </Card>

          {/* Daily Menu Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow duration-300 border border-border/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Daily Menus</h2>
                <p className="text-muted-foreground">
                  Create, organize, and publish daily menus by meal type
                  (breakfast, lunch, dinner)
                </p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Menu className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <Link
              href="/menu"
              className={
                buttonVariants({ variant: "default" }) +
                " w-full justify-center"
              }
            >
              Manage Menus
            </Link>
          </Card>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/50">
            <p className="text-sm text-muted-foreground mb-1">Quick Access</p>
            <p className="text-lg font-semibold">Menu Items Management</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/50">
            <p className="text-sm text-muted-foreground mb-1">Quick Access</p>
            <p className="text-lg font-semibold">Daily Menu Planning</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border-green-200/50 dark:border-green-800/50">
            <p className="text-sm text-muted-foreground mb-1">Quick Access</p>
            <p className="text-lg font-semibold">Publish & Track</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
