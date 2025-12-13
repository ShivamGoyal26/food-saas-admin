import { MenuItem } from "../api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateForDisplay } from "../utils/date";

type ShowMenuItemsProps = {
  type: "breakfast" | "lunch" | "dinner";
  isDraft: boolean;
  menuItems: MenuItem[];
  isPublished: boolean;
  selectedDate: string;
};

const ShowMenuItems = ({
  type,
  isDraft,
  menuItems,
  selectedDate,
}: ShowMenuItemsProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 mb-6">
        <h3 className="text-sm font-semibold capitalize">
          {type} Menu {isDraft && "(Draft)"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {formatDateForDisplay(selectedDate)}
        </p>
      </div>

      <section className="mt-10 w-full overflow-x-auto">
        {menuItems.length === 0 ? (
          <div className="flex text-xs items-center justify-center py-8 text-muted-foreground">
            <p>No menu items available</p>
          </div>
        ) : (
          <Table className="w-full">
            <TableCaption>A list of menu items for {type}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Available Sizes & Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Badge variant={item.isVeg ? "default" : "secondary"}>
                      {item.isVeg ? "Veg" : "Non-Veg"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {item.sizes.map((size) => (
                        <div key={size._id} className="text-sm">
                          <span className="font-medium">{size.label}</span>
                          {" - "}
                          <span className="text-muted-foreground">
                            ₹{size.priceInPaise}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
};

export default ShowMenuItems;
