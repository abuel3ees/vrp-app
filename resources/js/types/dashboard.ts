export interface DeliveryDailyPoint {
  day: string;        // YYYY-MM-DD
  total: number;      // aggregated count
}

export interface DeliveryStatusPoint {
  status: string;
  total: number;
}

export interface DashboardProps {
  deliveriesDaily: DeliveryDailyPoint[];
  deliveriesCompletedDaily: DeliveryDailyPoint[];
  deliveriesFailedDaily: DeliveryDailyPoint[];

  // you will add more later (drivers, vehicles, penalties, etc.)
}