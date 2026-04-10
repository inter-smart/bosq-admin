import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodOrderBucket } from "@/services/dashboard/dashboardApi";
import { TrendingUp } from "lucide-react";

interface RevenueOrderChartProps {
  data: PeriodOrderBucket[];
  loading?: boolean;
}

function formatCurrency(value: number) {
  return `AED ${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name === "Revenue"
              ? `Revenue: ${formatCurrency(entry.value)}`
              : `Orders: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueOrderChart({ data, loading }: RevenueOrderChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-base">Revenue & Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            Loading chart...
          </div>
        ) : !data.length ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            No data for selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 12 }}
                label={{ value: "Orders", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 11 } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                label={{ value: "Revenue (AED)", angle: 90, position: "insideRight", offset: 15, style: { fontSize: 11 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" name="Orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
