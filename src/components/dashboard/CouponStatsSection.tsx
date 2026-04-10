import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CouponAnalytics } from "@/services/dashboard/dashboardApi";
import { Ticket, Tag, CheckCircle, XCircle, DollarSign } from "lucide-react";

interface CouponStatsSectionProps {
  data: CouponAnalytics | null;
  loading?: boolean;
}

const SCOPE_COLORS: Record<string, string> = {
  common: "#3b82f6",
  category: "#8b5cf6",
  product: "#22c55e",
  variant: "#f59e0b",
  model: "#06b6d4",
};

function formatCurrency(value: number) {
  return `AED ${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function MiniStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="rounded-md p-2" style={{ backgroundColor: `${color}15` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-2 text-sm">
        <p style={{ color: payload[0].payload.color }}>
          {payload[0].name}: <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export function CouponStatsSection({ data, loading }: CouponStatsSectionProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            Coupon Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const scopeData = Object.entries(data.byScope)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: SCOPE_COLORS[key] || "#94a3b8",
    }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Ticket className="h-4 w-4 text-muted-foreground" />
          Coupon Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stat cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MiniStat icon={Tag} label="Total" value={data.totalCoupons} color="#3b82f6" />
          <MiniStat icon={CheckCircle} label="Active" value={data.activeCoupons} color="#22c55e" />
          <MiniStat icon={XCircle} label="Expired" value={data.expiredCoupons} color="#ef4444" />
          <MiniStat icon={DollarSign} label="Discount Given" value={formatCurrency(data.totalDiscountGiven)} color="#8b5cf6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top coupons table */}
          <div>
            <p className="text-sm font-medium mb-2">Top Coupons</p>
            {data.topCoupons.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No coupon usage data</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead className="text-right">Uses</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topCoupons.slice(0, 5).map((c) => (
                    <TableRow key={c.code}>
                      <TableCell className="font-mono text-xs">{c.code}</TableCell>
                      <TableCell className="text-right">{c.usageCount}</TableCell>
                      <TableCell className="text-right text-xs">{formatCurrency(c.totalDiscount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Scope pie chart */}
          <div>
            <p className="text-sm font-medium text-center mb-2">By Scope</p>
            {scopeData.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No scope data</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={scopeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                    {scopeData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend formatter={(value, entry: any) => <span style={{ color: entry.color, fontSize: 11 }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
