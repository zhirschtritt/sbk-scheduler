export interface Shift {
  id: number;
  date: Date;
  primary_staff: string;
  secondary_staff: string;
  fulfilled: number;
  updatedAt: Date;
  shop_open: number;
}
export interface ShiftEntity {
  id: string;
  date: string;
  primary_staff: string;
  secondary_staff: string;
  fulfilled: string;
  updatedAt: string;
  shop_open: string;
}
