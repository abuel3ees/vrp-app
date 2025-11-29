"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const chartConfig = {
  completed: { label: "Completed", color: "var(--primary)" },
  failed: { label: "Failed", color: "var(--destructive)" },
} satisfies ChartConfig;

export function ChartAreaInteractive({ data }) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("7d"); // small default

  // Data is already in the proper format
  const mergedData = data ?? [];

  // Filtering for last X days
  const filteredData = React.useMemo(() => {
    if (!mergedData.length) return [];

    const lastDate = new Date(mergedData[mergedData.length - 1].date);

    let subtract = timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 7;

    const start = new Date(lastDate);
    start.setDate(start.getDate() - subtract);

    return mergedData.filter((item) => new Date(item.date) >= start);
  }, [mergedData, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Delivery Performance</CardTitle>
        <CardDescription>Completed vs Failed Deliveries</CardDescription>

        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">90 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">

          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-completed)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-completed)" stopOpacity={0.1} />
              </linearGradient>

              <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-failed)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-failed)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />

            <Area
              dataKey="failed"
              type="natural"
              stroke="var(--color-failed)"
              fill="url(#fillFailed)"
            />

            <Area
              dataKey="completed"
              type="natural"
              stroke="var(--color-completed)"
              fill="url(#fillCompleted)"
            />
          </AreaChart>

        </ChartContainer>
      </CardContent>
    </Card>
  );
}