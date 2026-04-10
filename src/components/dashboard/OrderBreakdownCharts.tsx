import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStats } from "@/services/dashboard/dashboardApi";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  packed: "#8b5cf6",
  shipped: "#06b6d4",
  delivered: "#22c55e",
  cancelled: "#ef4444",
  returned: "#f97316",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  paid: "#22c55e",
  failed: "#ef4444",
  refunded: "#8b5cf6",
};

const PAYMENT_TYPE_COLORS: Record<string, string> = {
  cod: "#06b6d4",
  online: "#3b82f6",
};

function buildPieData(obj: Record<string, number>, colorMap: Record<string, string>) {
  return Object.entries(obj)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: colorMap[key] || "#94a3b8",
    }));
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-2 text-sm">
        <p style={{ color: payload[0].payload.color }}>{payload[0].name}: <strong>{payload[0].value}</strong></p>
      </div>
    );
  }
  return null;
};

function MiniPieChart({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm">
        <p className="font-medium text-foreground mb-1">{title}</p>
        No data
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-medium text-center mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-1 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span style={{ color: entry.color }}>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface OrderBreakdownChartsProps {
  data: OrderStats | null;
  loading?: boolean;
}

export function OrderBreakdownCharts({ data, loading }: OrderBreakdownChartsProps) {
  const statusData = data ? buildPieData(data.byStatus, STATUS_COLORS) : [];
  const paymentStatusData = data ? buildPieData(data.byPaymentStatus, PAYMENT_COLORS) : [];
  const paymentTypeData = data ? buildPieData(data.byPaymentType, PAYMENT_TYPE_COLORS) : [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Order Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MiniPieChart title="Order Status" data={statusData} />
            <MiniPieChart title="Payment Status" data={paymentStatusData} />
            <MiniPieChart title="Payment Type" data={paymentTypeData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
