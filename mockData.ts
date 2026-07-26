import {
  User,
  Property,
  Room,
  Contract,
  AttendanceRecord,
  CommissionConfig,
  IncidentReport,
  HonorBanner,
  NotificationItem,
  SystemCompanyInfo
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    username: 'administrator',
    fullName: 'Trần Văn Quản Trị (Super Admin)',
    email: 'admin@crmtro.vn',
    phone: '0909123456',
    role: 'super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isFirstLogin: false,
    companyName: 'BẤT ĐỘNG SẢN MINIHOUSE VIỆT NAM'
  },
  {
    id: 'usr_staff_1',
    username: 'sale_nam',
    fullName: 'Nguyen Van Nam (NV Sale)',
    email: 'nam.nv@crmtro.vn',
    phone: '0912345678',
    role: 'staff',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    kpiTarget: 50000000,
    commissionRate: 40
  },
  {
    id: 'usr_staff_2',
    username: 'sale_hoa',
    fullName: 'Lê Thị Hoa (NV Nguồn & Sale)',
    email: 'hoa.lt@crmtro.vn',
    phone: '0987654321',
    role: 'staff',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    kpiTarget: 60000000,
    commissionRate: 45
  },
  {
    id: 'usr_landlord_1',
    username: 'chutro_hung',
    fullName: 'Phạm Quốc Hùng (Chủ Trọ Bình Thạnh)',
    email: 'hung.chutro@gmail.com',
    phone: '0908889999',
    role: 'landlord',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_tenant_1',
    username: 'khach_minh',
    fullName: 'Hoàng Anh Minh (Khách Thuê P.201)',
    email: 'minh.hoang@gmail.com',
    phone: '0933112233',
    role: 'tenant',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop_1',
    title: 'Tòa Minihouse Cao Cấp Full Nội Thất - Nguyễn Xí, Bình Thạnh',
    address: '184/12 Nguyễn Xí, Phường 26',
    district: 'Quận Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    landlordId: 'usr_landlord_1',
    landlordName: 'Phạm Quốc Hùng',
    landlordPhone: '0908889999',
    totalRooms: 5,
    vacantRooms: 3,
    totalArea: 28,
    structure: '1 Trệt 4 Tầng, Thang Máy, Sân Thượng',
    rentPrice: 4800000,
    electricityRate: 3800,
    waterRate: 100000,
    wifiFee: 100000,
    deposit: 4800000,
    commissionRate: 50, // 50% tháng đầu
    amenities: ['Nội thất', 'Khóa vân tay', 'Thang máy', 'Wifi', 'Bãi xe', 'Cho nuôi thú cưng'],
    maxOccupants: 3,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    createdById: 'usr_landlord_1',
    createdByRole: 'landlord',
    createdAt: '2026-06-10T10:00:00Z',
    description: 'Phòng Studio cửa sổ rộng cực thoáng, máy lạnh inverter, tủ lạnh, bếp từ, máy giặt chung, an ninh 24/7.'
  },
  {
    id: 'prop_2',
    title: 'Căn Hộ Dịch Vụ Ban Cồng Thoáng - Lê Văn Sỹ, Quận 3',
    address: '351/8 Lê Văn Sỹ, Phường 13',
    district: 'Quận 3',
    city: 'TP. Hồ Chí Minh',
    landlordId: 'usr_landlord_1',
    landlordName: 'Phạm Quốc Hùng',
    landlordPhone: '0908889999',
    totalRooms: 4,
    vacantRooms: 1,
    totalArea: 35,
    structure: 'Tòa nhà 6 tầng, Thang máy thẻ từ',
    rentPrice: 6500000,
    electricityRate: 4000,
    waterRate: 120000,
    wifiFee: 100000,
    deposit: 6500000,
    commissionRate: 60,
    amenities: ['Nội thất', 'Khóa vân tay', 'Thang máy', 'Wifi', 'Bãi xe'],
    maxOccupants: 2,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    createdById: 'usr_staff_2',
    createdByRole: 'staff',
    createdAt: '2026-07-01T09:30:00Z',
    description: 'Ban công view Landmark thoáng mát, đầy đủ tiện nghi sofa, tivi, tủ lạnh, bếp riêng biệt.'
  },
  {
    id: 'prop_3',
    title: 'Phòng Trọ Minihouse Giá Rẻ Gần Đại Học - Điện Biên Phủ, Q10',
    address: '520 Điện Biên Phủ, Phường 11',
    district: 'Quận 10',
    city: 'TP. Hồ Chí Minh',
    landlordId: 'usr_landlord_1',
    landlordName: 'Phạm Quốc Hùng',
    landlordPhone: '0908889999',
    totalRooms: 1,
    vacantRooms: 0,
    totalArea: 22,
    structure: 'Nhà nguyên căn chia phòng',
    rentPrice: 3800000,
    electricityRate: 3500,
    waterRate: 80000,
    wifiFee: 80000,
    deposit: 3800000,
    commissionRate: 50,
    amenities: ['Wifi', 'Bãi xe', 'Khóa vân tay'],
    maxOccupants: 2,
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c21757107?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'out_of_stock',
    createdById: 'usr_staff_1',
    createdByRole: 'staff',
    createdAt: '2026-05-15T14:20:00Z',
    description: 'Đã cho thuê hết phòng. Giờ giấc tự do, khóa cổng vân tay.'
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room_101',
    propertyId: 'prop_1',
    roomNumber: 'P.101',
    floor: 1,
    area: 28,
    rentPrice: 4800000,
    status: 'vacant',
    tenants: [],
    currentTenantCount: 0,
    maxOccupants: 3,
    extraPersonFee: 300000,
    electricityRate: 3800,
    waterRate: 100000,
    wifiFee: 100000
  },
  {
    id: 'room_201',
    propertyId: 'prop_1',
    roomNumber: 'P.201',
    floor: 2,
    area: 28,
    rentPrice: 4800000,
    status: 'occupied',
    tenants: [
      {
        id: 'ten_1',
        fullName: 'Hoàng Anh Minh',
        phone: '0933112233',
        cccd: '079201008888',
        cccdDate: '2021-05-10',
        checkInDate: '2026-06-15',
        depositAmount: 4800000,
        isPrimary: true
      },
      {
        id: 'ten_2',
        fullName: 'Trần Thị Mai',
        phone: '0933112244',
        cccd: '079201009999',
        cccdDate: '2022-08-12',
        checkInDate: '2026-06-15',
        depositAmount: 0,
        isPrimary: false
      }
    ],
    currentTenantCount: 2,
    maxOccupants: 3,
    extraPersonFee: 300000,
    electricityRate: 3800,
    waterRate: 100000,
    wifiFee: 100000
  },
  {
    id: 'room_202',
    propertyId: 'prop_1',
    roomNumber: 'P.202',
    floor: 2,
    area: 30,
    rentPrice: 5000000,
    status: 'vacant',
    tenants: [],
    currentTenantCount: 0,
    maxOccupants: 3,
    extraPersonFee: 300000
  },
  {
    id: 'room_301',
    propertyId: 'prop_1',
    roomNumber: 'P.301',
    floor: 3,
    area: 28,
    rentPrice: 4800000,
    status: 'occupied',
    tenants: [
      {
        id: 'ten_3',
        fullName: 'Vũ Đức Thành',
        phone: '0944556677',
        cccd: '038200112233',
        checkInDate: '2026-07-01',
        depositAmount: 4800000,
        isPrimary: true
      }
    ],
    currentTenantCount: 1,
    maxOccupants: 3,
    extraPersonFee: 300000
  },
  {
    id: 'room_302',
    propertyId: 'prop_1',
    roomNumber: 'P.302',
    floor: 3,
    area: 28,
    rentPrice: 4800000,
    status: 'vacant',
    tenants: [],
    currentTenantCount: 0,
    maxOccupants: 3,
    extraPersonFee: 300000
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'ctr_1001',
    propertyId: 'prop_1',
    propertyName: 'Tòa Minihouse Cao Cấp Full Nội Thất - Nguyễn Xí',
    roomId: 'room_201',
    roomNumber: 'P.201',
    tenantName: 'Hoàng Anh Minh',
    tenantPhone: '0933112233',
    staffId: 'usr_staff_1',
    staffName: 'Nguyen Van Nam',
    sourceOwnerId: 'usr_staff_2',
    sourceOwnerName: 'Lê Thị Hoa',
    rentPrice: 4800000,
    commissionAmount: 2400000, // 50%
    commissionStatus: 'admin_confirmed',
    contractDate: '2026-06-15',
    startDate: '2026-06-15',
    endDate: '2027-06-15',
    notes: 'Khách cọc 1 tháng, thanh toán tiền trọ ngày 05 hàng tháng.'
  },
  {
    id: 'ctr_1002',
    propertyId: 'prop_1',
    propertyName: 'Tòa Minihouse Cao Cấp Full Nội Thất - Nguyễn Xí',
    roomId: 'room_301',
    roomNumber: 'P.301',
    tenantName: 'Vũ Đức Thành',
    tenantPhone: '0944556677',
    staffId: 'usr_staff_2',
    staffName: 'Lê Thị Hoa',
    sourceOwnerId: 'usr_staff_2',
    sourceOwnerName: 'Lê Thị Hoa',
    rentPrice: 4800000,
    commissionAmount: 2400000,
    commissionStatus: 'landlord_paid',
    contractDate: '2026-07-01',
    startDate: '2026-07-01',
    endDate: '2027-07-01'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_01',
    userId: 'usr_staff_1',
    userName: 'Nguyen Van Nam',
    userRole: 'staff',
    date: '2026-07-25',
    timeIn: '08:05:12',
    timeOut: '17:35:00',
    lat: 10.8142,
    lng: 106.7023,
    address: '184 Nguyễn Xí, P.26, Bình Thạnh',
    isLate: false,
    approvalStatus: 'approved'
  },
  {
    id: 'att_02',
    userId: 'usr_staff_2',
    userName: 'Lê Thị Hoa',
    userRole: 'staff',
    date: '2026-07-25',
    timeIn: '08:35:00',
    timeOut: '17:30:00',
    lat: 10.7845,
    lng: 106.6841,
    address: '351 Lê Văn Sỹ, P.13, Q.3',
    isLate: true,
    lateReason: 'Kẹt xe nghiêm trọng trên đường Điện Biên Phủ do ngập nước.',
    approvalStatus: 'pending'
  }
];

export const DEFAULT_COMMISSION_CONFIG: CommissionConfig = {
  sourceOwnerPercent: 30, // 30% cho người tìm nguồn
  directCloserPercent: 50, // 50% cho người chốt trực tiếp
  companySourcePercent: 40, // 40% cho nguồn công ty
  otherStaffSourcePercent: 10, // 10% thưởng khác
  sourceNoClosePercent: 20, // 20% cho nguồn chưa tự chốt
  kpiBonusPercent: 10 // Thưởng 10% nếu vượt kpi
};

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc_1',
    tenantId: 'usr_tenant_1',
    tenantName: 'Hoàng Anh Minh',
    tenantPhone: '0933112233',
    propertyId: 'prop_1',
    propertyName: 'Tòa Minihouse Cao Cấp - Nguyễn Xí',
    roomNumber: 'P.201',
    landlordId: 'usr_landlord_1',
    title: 'Máy lạnh không chảy nước mát, chảy nước nhỏ giọt',
    description: 'Máy lạnh phòng 201 bật 20 độ vẫn nóng và có tiếng kêu nhẹ.',
    severity: 'medium',
    status: 'pending',
    createdAt: '2026-07-24T18:30:00Z'
  }
];

export const INITIAL_HONOR_BANNER: HonorBanner = {
  id: 'honor_q2',
  year: 2026,
  period: 'month',
  periodValue: 'Tháng 07/2026',
  top1UserId: 'usr_staff_2',
  top1Name: 'Lê Thị Hoa',
  top1Avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  top1Revenue: 125000000,
  top2UserId: 'usr_staff_1',
  top2Name: 'Nguyen Van Nam',
  top2Avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  top2Revenue: 89000000,
  createdAt: '2026-07-01T00:00:00Z'
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_admin',
    title: 'Xác nhận hoa hồng mới',
    message: 'Chủ trọ Phạm Quốc Hùng đã bấm xác nhận thanh toán hoa hồng 2.400.000 VNĐ cho P.301 Nguyễn Xí.',
    type: 'commission',
    isRead: false,
    createdAt: '2026-07-25T10:15:00Z'
  },
  {
    id: 'notif_2',
    userId: 'usr_landlord_1',
    title: 'Sự cố kỹ thuật mới',
    message: 'Khách thuê Hoàng Anh Minh (P.201) gửi báo cáo sự cố máy lạnh.',
    type: 'incident',
    isRead: false,
    createdAt: '2026-07-24T18:31:00Z'
  }
];

export const DEFAULT_COMPANY_INFO: SystemCompanyInfo = {
  companyName: 'CÔNG TY TNHH VẬN HÀNH BẤT ĐỘNG SẢN MINIHOUSE VIỆT NAM',
  taxCode: '0316888999',
  address: 'Số 100 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
  phone: '028 7300 9999',
  email: 'contact@minihouse.vn',
  logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80',
  workStartTime: '08:00',
  workEndTime: '17:30',
  lateGraceMinutes: 15,
  latePenaltyDeductionRate: 5 // 5% trừ hoa hồng nếu đi trễ không giải trình hợp lệ
};
