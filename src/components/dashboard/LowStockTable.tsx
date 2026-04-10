import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LowStockItem } from "@/services/dashboard/dashboardApi";
import { AlertTriangle } from "lucide-react";

interface LowStockTableProps {
  data: LowStockItem[];
  loading?: boolean;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 5) {
    return (
      <Badge className="bg-red-500/15 text-red-600 border-red-200 hover:bg-red-500/20">
        {stock}
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/15 text-amber-600 border-amber-200 hover:bg-amber-500/20">
      {stock}
    </Badge>
  );
}

export function LowStockTable({ data, loading }: LowStockTableProps) {
  const items = data.slice(0, 10);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <CardTitle className="text-base">Low Stock Alerts</CardTitle>
        {!loading && data.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">{data.length} items</span>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            Loading...
          </div>
        ) : !items.length ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            All products well stocked 🎉
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right w-[80px]">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.title}>
                    {item.title}
                  </TableCell>
                  <TableCell className="text-right">
                    <StockBadge stock={item.stock} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
