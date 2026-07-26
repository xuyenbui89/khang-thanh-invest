import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  Room,
  Contract,
  AttendanceRecord,
  CommissionConfig,
  IncidentReport,
  HonorBanner,
  NotificationItem,
  SystemCompanyInfo,
  SupabaseConfig,
  RoomTenant
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_ROOMS,
  INITIAL_CONTRACTS,
  INITIAL_ATTENDANCE,
  DEFAULT_COMMISSION_CONFIG,
  INITIAL_INCIDENTS,
  INITIAL_HONOR_BANNER,
  INITIAL_NOTIFICATIONS,
  DEFAULT_COMPANY_INFO
} from '../data/mockData';
import { loadSupabaseConfigFromStorage, saveSupabaseConfigToStorage } from '../lib/supabase';

interface DataContextType {
  properties: Property[];
  rooms: Room[];
  contracts: Contract[];
  attendance: AttendanceRecord[];
  commissionConfig: CommissionConfig;
  incidents: IncidentReport[];
  honorBanner: HonorBanner;
  notifications: NotificationItem[];
  companyInfo: SystemCompanyInfo;
  supabaseConfig: SupabaseConfig;

  // Actions
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'vacantRooms' | 'status'>) => Property;
  updateProperty: (property: Property) => void;
  deleteProperty: (propertyId: string) => void;
  
  addTenantToRoom: (
    roomId: string,
    tenants: RoomTenant[],
    contractDetails: {
      staffId: string;
      staffName: string;
      sourceOwnerId?: string;
      sourceOwnerName?: string;
      rentPrice: number;
      startDate: string;
      endDate: string;
      notes?: string;
    }
  ) => void;

  switchTenantRoom: (sourceRoomId: string, targetRoomId: string, tenantId: string) => void;

  landlordConfirmCommission: (contractId: string) => void;
  adminConfirmCommission: (contractId: string) => void;

  submitAttendance: (record: Omit<AttendanceRecord, 'id' | 'approvalStatus'>) => void;
  approveAttendanceLate: (recordId: string, isApproved: boolean, penaltyAmount?: number) => void;

  updateCommissionConfig: (config: CommissionConfig) => void;
  submitIncidentReport: (report: Omit<IncidentReport, 'id' | 'createdAt' | 'status'>) => void;
  updateIncidentStatus: (reportId: string, status: IncidentReport['status']) => void;

  updateHonorBanner: (banner: HonorBanner) => void;
  updateCompanyInfo: (info: SystemCompanyInfo) => void;
  updateSupabaseConfig: (config: SupabaseConfig) => void;
  markNotificationRead: (id: string) => void;
  syncWithSupabase: () => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('crm_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('crm_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [contracts, setContracts] = useState<Contract[]>(() => {
    const saved = localStorage.getItem('crm_contracts');
    return saved ? JSON.parse(saved) : INITIAL_CONTRACTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('crm_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [commissionConfig, setCommissionConfig] = useState<CommissionConfig>(() => {
    const saved = localStorage.getItem('crm_commission_config');
    return saved ? JSON.parse(saved) : DEFAULT_COMMISSION_CONFIG;
  });

  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('crm_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [honorBanner, setHonorBanner] = useState<HonorBanner>(() => {
    const saved = localStorage.getItem('crm_honor_banner');
    return saved ? JSON.parse(saved) : INITIAL_HONOR_BANNER;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('crm_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [companyInfo, setCompanyInfo] = useState<SystemCompanyInfo>(() => {
    const saved = localStorage.getItem('crm_company_info');
    return saved ? JSON.parse(saved) : DEFAULT_COMPANY_INFO;
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(loadSupabaseConfigFromStorage);

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('crm_properties', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('crm_rooms', JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem('crm_contracts', JSON.stringify(contracts)); }, [contracts]);
  useEffect(() => { localStorage.setItem('crm_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('crm_commission_config', JSON.stringify(commissionConfig)); }, [commissionConfig]);
  useEffect(() => { localStorage.setItem('crm_incidents', JSON.stringify(incidents)); }, [incidents]);
  useEffect(() => { localStorage.setItem('crm_honor_banner', JSON.stringify(honorBanner)); }, [honorBanner]);
  useEffect(() => { localStorage.setItem('crm_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('crm_company_info', JSON.stringify(companyInfo)); }, [companyInfo]);

  // Push notification helper
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  // Property Actions
  const addProperty = (newProp: Omit<Property, 'id' | 'createdAt' | 'vacantRooms' | 'status'>): Property => {
    const id = `prop_${Date.now()}`;
    const property: Property = {
      ...newProp,
      id,
      vacantRooms: newProp.totalRooms,
      status: 'available',
      createdAt: new Date().toISOString()
    };

    // Auto create default room objects for this property
    const createdRooms: Room[] = [];
    for (let i = 1; i <= newProp.totalRooms; i++) {
      const roomNum = `P.${100 + i}`;
      createdRooms.push({
        id: `room_${id}_${i}`,
        propertyId: id,
        roomNumber: roomNum,
        floor: Math.ceil(i / 3),
        area: newProp.totalArea,
        rentPrice: newProp.rentPrice,
        status: 'vacant',
        tenants: [],
        currentTenantCount: 0,
        maxOccupants: newProp.maxOccupants,
        extraPersonFee: 300000,
        electricityRate: newProp.electricityRate,
        waterRate: newProp.waterRate,
        wifiFee: newProp.wifiFee
      });
    }

    setProperties(prev => [property, ...prev]);
    setRooms(prev => [...createdRooms, ...prev]);

    addNotification({
      userId: 'all',
      title: 'Tài sản mới đã đăng',
      message: `${property.landlordName} vừa đăng tài sản: ${property.title} (${property.totalRooms} phòng).`,
      type: 'system'
    });

    return property;
  };

  const updateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    setRooms(prev => prev.filter(r => r.propertyId !== propertyId));
  };

  // Tenant check-in and contract registration
  const addTenantToRoom = (
    roomId: string,
    newTenants: RoomTenant[],
    contractDetails: {
      staffId: string;
      staffName: string;
      sourceOwnerId?: string;
      sourceOwnerName?: string;
      rentPrice: number;
      startDate: string;
      endDate: string;
      notes?: string;
    }
  ) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    const updatedRooms = rooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          status: 'occupied' as const,
          tenants: newTenants,
          currentTenantCount: newTenants.length
        };
      }
      return r;
    });

    setRooms(updatedRooms);

    // Decrement vacant rooms on property
    const propId = targetRoom.propertyId;
    const targetProp = properties.find(p => p.id === propId);

    if (targetProp) {
      const newVacant = Math.max(0, targetProp.vacantRooms - 1);
      const isOutOfStock = newVacant === 0;

      const updatedProperties = properties.map(p => {
        if (p.id === propId) {
          return {
            ...p,
            vacantRooms: newVacant,
            status: isOutOfStock ? ('out_of_stock' as const) : p.status
          };
        }
        return p;
      });

      setProperties(updatedProperties);

      // Calculate commission (50% or prop commission rate)
      const commissionRate = targetProp.commissionRate || 50;
      const commissionVal = (contractDetails.rentPrice * commissionRate) / 100;

      const primaryTenant = newTenants.find(t => t.isPrimary) || newTenants[0];

      const newContract: Contract = {
        id: `ctr_${Date.now()}`,
        propertyId: targetProp.id,
        propertyName: targetProp.title,
        roomId: targetRoom.id,
        roomNumber: targetRoom.roomNumber,
        tenantName: primaryTenant ? primaryTenant.fullName : 'Khách thuê mới',
        tenantPhone: primaryTenant ? primaryTenant.phone : '',
        staffId: contractDetails.staffId,
        staffName: contractDetails.staffName,
        sourceOwnerId: contractDetails.sourceOwnerId,
        sourceOwnerName: contractDetails.sourceOwnerName,
        rentPrice: contractDetails.rentPrice,
        commissionAmount: commissionVal,
        commissionStatus: 'pending',
        contractDate: new Date().toISOString().slice(0, 10),
        startDate: contractDetails.startDate,
        endDate: contractDetails.endDate,
        notes: contractDetails.notes
      };

      setContracts(prev => [newContract, ...prev]);

      addNotification({
        userId: targetProp.landlordId,
        title: 'Đã có khách thuê phòng',
        message: `${targetRoom.roomNumber} (${targetProp.title}) vừa được cho thuê cho khách ${primaryTenant?.fullName}.`,
        type: 'contract'
      });
    }
  };

  // Switch room for tenant
  const switchTenantRoom = (sourceRoomId: string, targetRoomId: string, tenantId: string) => {
    const sourceRoom = rooms.find(r => r.id === sourceRoomId);
    const targetRoom = rooms.find(r => r.id === targetRoomId);

    if (!sourceRoom || !targetRoom) return;

    const movingTenants = sourceRoom.tenants.filter(t => t.id === tenantId);
    const remainingTenants = sourceRoom.tenants.filter(t => t.id !== tenantId);

    setRooms(prev =>
      prev.map(r => {
        if (r.id === sourceRoomId) {
          return {
            ...r,
            tenants: remainingTenants,
            currentTenantCount: remainingTenants.length,
            status: remainingTenants.length === 0 ? ('vacant' as const) : ('occupied' as const)
          };
        }
        if (r.id === targetRoomId) {
          const combined = [...r.tenants, ...movingTenants];
          return {
            ...r,
            tenants: combined,
            currentTenantCount: combined.length,
            status: 'occupied' as const
          };
        }
        return r;
      })
    );

    addNotification({
      userId: 'all',
      title: 'Chuyển phòng thành công',
      message: `Khách thuê đã được chuyển từ ${sourceRoom.roomNumber} sang ${targetRoom.roomNumber}.`,
      type: 'system'
    });
  };

  // Landlord confirms commission payout -> notifies Admin
  const landlordConfirmCommission = (contractId: string) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          return { ...c, commissionStatus: 'landlord_paid' as const };
        }
        return c;
      })
    );

    const contract = contracts.find(c => c.id === contractId);
    addNotification({
      userId: 'usr_admin',
      title: 'Xác nhận hoa hồng từ chủ nhà',
      message: `Chủ trọ đã thanh toán hoa hồng cho hợp đồng ${contract?.propertyName} (${contract?.roomNumber}). Vui lòng duyệt nhận tiền.`,
      type: 'commission'
    });
  };

  // Admin confirms receipt -> creates Voucher receipt & notifies Landlord
  const adminConfirmCommission = (contractId: string) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          return { ...c, commissionStatus: 'admin_confirmed' as const };
        }
        return c;
      })
    );

    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      addNotification({
        userId: 'usr_landlord_1',
        title: 'Phiếu xác nhận hoa hồng',
        message: `Super Admin đã xác nhận nhận tiền hoa hồng ${contract.commissionAmount.toLocaleString('vi-VN')} VNĐ cho ${contract.roomNumber}. Cảm ơn Quý chủ trọ!`,
        type: 'commission'
      });
    }
  };

  // Attendance GPS
  const submitAttendance = (record: Omit<AttendanceRecord, 'id' | 'approvalStatus'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att_${Date.now()}`,
      approvalStatus: record.isLate ? 'pending' : 'approved'
    };

    setAttendance(prev => [newRecord, ...prev]);

    if (record.isLate) {
      addNotification({
        userId: 'usr_admin',
        title: 'Chấm công trễ giờ có giải trình',
        message: `Nhân viên ${record.userName} vừa chấm công vào trễ (${record.timeIn}) với lý do: "${record.lateReason}".`,
        type: 'attendance'
      });
    }
  };

  const approveAttendanceLate = (recordId: string, isApproved: boolean, penaltyAmount?: number) => {
    setAttendance(prev =>
      prev.map(a => {
        if (a.id === recordId) {
          return {
            ...a,
            approvalStatus: isApproved ? ('approved' as const) : ('rejected_penalty' as const),
            penaltyAmount: isApproved ? 0 : (penaltyAmount || 100000)
          };
        }
        return a;
      })
    );
  };

  // Commission Config
  const updateCommissionConfig = (config: CommissionConfig) => {
    setCommissionConfig(config);
  };

  // Incident Reports
  const submitIncidentReport = (report: Omit<IncidentReport, 'id' | 'createdAt' | 'status'>) => {
    const newIncident: IncidentReport = {
      ...report,
      id: `inc_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setIncidents(prev => [newIncident, ...prev]);

    addNotification({
      userId: report.landlordId,
      title: 'Báo cáo sự cố mới',
      message: `Khách ${report.tenantName} (${report.roomNumber}) vừa gửi báo cáo: ${report.title}`,
      type: 'incident'
    });
  };

  const updateIncidentStatus = (reportId: string, status: IncidentReport['status']) => {
    setIncidents(prev =>
      prev.map(i => (i.id === reportId ? { ...i, status } : i))
    );
  };

  // Honor Banner
  const updateHonorBanner = (banner: HonorBanner) => {
    setHonorBanner(banner);
  };

  // Company Info
  const updateCompanyInfo = (info: SystemCompanyInfo) => {
    setCompanyInfo(info);
  };

  // Supabase Config
  const updateSupabaseConfig = (config: SupabaseConfig) => {
    setSupabaseConfig(config);
    saveSupabaseConfigToStorage(config);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const syncWithSupabase = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/supabase/sync', { method: 'POST' });
      if (res.ok) {
        const now = new Date().toISOString();
        const newCfg = { ...supabaseConfig, isConnected: true, lastSyncedAt: now };
        setSupabaseConfig(newCfg);
        saveSupabaseConfigToStorage(newCfg);
        return true;
      }
    } catch (err) {
      console.warn('Sync simulated:', err);
    }
    const now = new Date().toISOString();
    const newCfg = { ...supabaseConfig, isConnected: true, lastSyncedAt: now };
    setSupabaseConfig(newCfg);
    saveSupabaseConfigToStorage(newCfg);
    return true;
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        rooms,
        contracts,
        attendance,
        commissionConfig,
        incidents,
        honorBanner,
        notifications,
        companyInfo,
        supabaseConfig,

        addProperty,
        updateProperty,
        deleteProperty,
        addTenantToRoom,
        switchTenantRoom,
        landlordConfirmCommission,
        adminConfirmCommission,
        submitAttendance,
        approveAttendanceLate,
        updateCommissionConfig,
        submitIncidentReport,
        updateIncidentStatus,
        updateHonorBanner,
        updateCompanyInfo,
        updateSupabaseConfig,
        markNotificationRead,
        syncWithSupabase
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
