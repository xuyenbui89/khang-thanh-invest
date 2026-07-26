export type UserRole = 'super_admin' | 'staff' | 'landlord' | 'tenant';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  isFirstLogin?: boolean;
  kpiTarget?: number; // Target revenue in VND
  commissionRate?: number; // Base commission rate %
  companyName?: string;
}

export interface RoomTenant {
  id: string;
  fullName: string;
  phone: string;
  cccd: string;
  cccdDate?: string;
  checkInDate: string;
  depositAmount: number;
  isPrimary: boolean;
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor?: number;
  area: number; // m2
  rentPrice: number;
  status: 'occupied' | 'vacant';
  tenants: RoomTenant[];
  currentTenantCount: number;
  maxOccupants: number;
  extraPersonFee: number; // Extra fee per person if over limit
  electricityRate?: number;
  waterRate?: number;
  wifiFee?: number;
  serviceFee?: number;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  district: string;
  city: string;
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
  totalRooms: number;
  vacantRooms: number;
  totalArea: number; // m2
  structure: string; // e.g. "5 Tầng, Có Thang Máy"
  rentPrice: number; // Starting from
  electricityRate: number; // e.g. 3500 VND/kWh
  waterRate: number; // e.g. 100000 VND/người or m3
  wifiFee: number; // e.g. 100000 VND/phòng
  deposit: number; // Deposit amount
  commissionRate: number; // % (Only Admin & Staff see)
  amenities: string[]; // ['Nội thất', 'Khóa vân tay', 'Thang máy', 'Wifi', 'Bãi xe', 'Cho nuôi thú cưng']
  customAmenities?: string;
  maxOccupants: number;
  images: string[];
  status: 'available' | 'out_of_stock';
  createdById: string;
  createdByRole: UserRole;
  createdAt: string;
  description?: string;
}

export interface Contract {
  id: string;
  propertyId: string;
  propertyName: string;
  roomId: string;
  roomNumber: string;
  tenantName: string;
  tenantPhone: string;
  staffId: string;
  staffName: string;
  sourceOwnerId?: string; // Person who brought the property source
  sourceOwnerName?: string;
  rentPrice: number;
  commissionAmount: number; // Calculated commission in VND
  commissionStatus: 'pending' | 'landlord_paid' | 'admin_confirmed';
  contractDate: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  date: string; // YYYY-MM-DD
  timeIn?: string; // HH:mm:ss
  timeOut?: string;
  lat?: number;
  lng?: number;
  address?: string;
  isLate: boolean;
  lateReason?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected_penalty';
  penaltyAmount?: number;
}

export interface CommissionConfig {
  sourceOwnerPercent: number; // % Người đem nguồn hàng
  directCloserPercent: number; // % Người chốt trực tiếp
  companySourcePercent: number; // % Chốt trên nguồn công ty
  otherStaffSourcePercent: number; // % Chốt trên nguồn NV khác
  sourceNoClosePercent: number; // % NV đem nguồn về nếu không chốt được
  kpiBonusPercent: number; // % Thưởng khi vượt KPI
}

export interface IncidentReport {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  propertyId: string;
  propertyName: string;
  roomNumber: string;
  landlordId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface HonorBanner {
  id: string;
  year: number;
  period: 'month' | 'quarter' | 'year';
  periodValue: string; // e.g. "Tháng 07/2026" or "Quý 3/2026"
  top1UserId: string;
  top1Name: string;
  top1Avatar: string;
  top1Revenue: number;
  top2UserId?: string;
  top2Name?: string;
  top2Avatar?: string;
  top2Revenue?: number;
  top3UserId?: string;
  top3Name?: string;
  top3Avatar?: string;
  top3Revenue?: number;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // Target user or 'all'
  title: string;
  message: string;
  type: 'commission' | 'contract' | 'incident' | 'attendance' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface SystemCompanyInfo {
  companyName: string;
  taxCode: string; // Mã số thuế
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  workStartTime: string; // e.g. "08:00"
  workEndTime: string; // e.g. "17:30"
  lateGraceMinutes: number; // e.g. 15 mins
  latePenaltyDeductionRate: number; // % trừ hoa hồng khi trễ không lý do
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}
