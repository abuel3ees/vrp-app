import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SectionCards({ data }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* DRIVERS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Drivers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.drivers ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium flex gap-2">
            Driver count stable <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Includes all registered delivery drivers
          </div>
        </CardFooter>
      </Card>

      {/* VEHICLES */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Vehicles</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.vehicles ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Operational
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium flex gap-2">
            Fleet operational <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Vehicles available for delivery routes
          </div>
        </CardFooter>
      </Card>

      {/* DELIVERIES */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Deliveries</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.deliveries ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Updated
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium flex gap-2">
            Delivery volume stable <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total deliveries recorded in the system
          </div>
        </CardFooter>
      </Card>

      {/* TOTAL ROADS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Roads in Dataset</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.totalRoads ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Synced
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium flex gap-2">
            Updated road dataset <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Combined total of all road categories
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}