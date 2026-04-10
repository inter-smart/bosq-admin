import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopSeller } from "@/services/dashboard/dashboardApi";
import { Award } from "lucide-react";

interface TopProductsChartProps {
  data: TopSeller[];
  loading?: boolean;
}

const BAR_COLORS = [
  "#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4", "#14b8a6",
  "#22c55e", "#84cc16", "#eab308", "#f59e0b", "#f97316",
];

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function formatCurrency(value: number) {
  return `AED ${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-1">{d.title}</p>
        <p className="text-muted-foreground">SKU: {d.sku}</p>
        <p style={{ color: "#8b5cf6" }}>Revenue: {formatCurrency(d.revenue)}</p>
        <p style={{ color: "#3b82f6" }}>Qty Sold: {d.quantity}</p>
      </div>
    );
  }
  return null;
};

export function TopProductsChart({ data, loading }: TopProductsChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    shortTitle: truncate(d.title, 22),
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Award className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-base">Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            Loading chart...
          </div>
        ) : !chartData.length ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            No sales data for selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="shortTitle"
                width={150}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
