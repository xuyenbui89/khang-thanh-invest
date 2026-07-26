import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { StaffDashboard } from './components/dashboard/StaffDashboard';
import { LandlordDashboard } from './components/dashboard/LandlordDashboard';
import { TenantDashboard } from './components/dashboard/TenantDashboard';

import { PropertyListView } from './components/properties/PropertyListView';
import { PropertyFormModal } from './components/properties/PropertyFormModal';
import { PropertyDetailModal } from './components/properties/PropertyDetailModal';
import { ImageSliderModal } from './components/common/ImageSliderModal';

import { CustomerManagementPage } from './pages/CustomerManagementPage';
import { ContractManagementPage } from './pages/ContractManagementPage';
import { FinancePage } from './pages/FinancePage';
import { UserManagementPage } from './pages/UserManagementPage';

import { LoginModal } from './components/auth/LoginModal';
import { UpdateAccountModal } from './components/auth/UpdateAccountModal';
import { RegisterTenantModal } from './components/modals/RegisterTenantModal';
import { RoomSwitchModal } from './components/modals/RoomSwitchModal';
import { AttendanceModal } from './components/modals/AttendanceModal';

import { Property, Room } from './types';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { isSupabaseConnected } = useData();

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Property Modals
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const [selectedPropertyForEdit, setSelectedPropertyForEdit] = useState<Property | undefined>(undefined);
  
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);
  const [isPropertyDetailOpen, setIsPropertyDetailOpen] = useState(false);

  // Image Slider Modal
  const [imageSliderProps, setImageSliderProps] = useState<{ images: string[]; title: string } | null>(null);

  // Landlord Operations Modals
  const [selectedRoomForRegister, setSelectedRoomForRegister] = useState<Room | null>(null);
  const [isRegisterTenantOpen, setIsRegisterTenantOpen] = useState(false);

  const [selectedRoomForSwitch, setSelectedRoomForSwitch] = useState<Room | null>(null);
  const [isRoomSwitchOpen, setIsRoomSwitchOpen] = useState(false);

  // Attendance GPS Modal
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  // Open Image Slider Helper
  const handleOpenImages = (images: string[], title: string) => {
    setImageSliderProps({ images, title });
  };

  // Open Property Detail Helper
  const handleViewPropertyDetail = (property: Property) => {
    setSelectedPropertyForDetail(property);
    setIsPropertyDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col font-sans antialiased relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Ambient Frosted Background Orbs / Glow Mesh */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* Top Fixed Header */}
      <div className="relative z-30">
        <Header
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenAccount={() => setIsAccountModalOpen(true)}
        />
      </div>

      <div className="flex-grow flex w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 gap-6 relative z-10">
        
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Workspace Body */}
        <main className="flex-grow min-w-0 space-y-6">
          
          {/* Supabase Realtime Sync Banner */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-[11px] shadow-lg shadow-black/20">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50' : 'bg-amber-400'}`}></span>
              <span className="font-semibold text-slate-200">
                {isSupabaseConnected ? 'Kết nối Supabase Cloud Database Realtime: HOẠT ĐỘNG' : 'Supabase Sync Ready (Chế độ lưu trữ kép Memory/Client)'}
              </span>
            </div>
            <span className="text-slate-400 font-medium hidden sm:inline">
              Vai trò hiện tại: <strong className="text-indigo-400 uppercase">{currentUser.role}</strong> ({currentUser.fullName})
            </span>
          </div>

          {/* TAB 1: DASHBOARD (Rendered dynamically based on Role) */}
          {activeTab === 'dashboard' && (
            <>
              {currentUser.role === 'super_admin' && <AdminDashboard />}
              {currentUser.role === 'staff' && (
                <StaffDashboard onOpenAttendance={() => setIsAttendanceOpen(true)} />
              )}
              {currentUser.role === 'landlord' && (
                <LandlordDashboard
                  onOpenRegisterTenantModal={(room) => {
                    setSelectedRoomForRegister(room);
                    setIsRegisterTenantOpen(true);
                  }}
                  onOpenRoomSwitchModal={(sourceRoom) => {
                    setSelectedRoomForSwitch(sourceRoom);
                    setIsRoomSwitchOpen(true);
                  }}
                />
              )}
              {currentUser.role === 'tenant' && <TenantDashboard />}
            </>
          )}

          {/* TAB 2: PROPERTIES (Kho nguồn hàng) */}
          {activeTab === 'properties' && (
            <PropertyListView
              onOpenCreateModal={() => {
                setSelectedPropertyForEdit(undefined);
                setIsPropertyFormOpen(true);
              }}
              onViewDetail={handleViewPropertyDetail}
              onOpenImages={handleOpenImages}
            />
          )}

          {/* TAB 3: CUSTOMERS & VIEWINGS */}
          {activeTab === 'customers' && <CustomerManagementPage />}

          {/* TAB 4: CONTRACTS & COMMISSIONS */}
          {activeTab === 'contracts' && <ContractManagementPage />}

          {/* TAB 5: FINANCE & PAYROLL */}
          {activeTab === 'finance' && <FinancePage />}

          {/* TAB 6: USERS MANAGEMENT (Super Admin Only) */}
          {activeTab === 'users' && <UserManagementPage />}

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl py-4 text-center text-xs text-slate-400 relative z-10">
        <p>© 2025 CRM TRỌ - MINIHOUSE. Hệ thống kiểm soát vận hành bất động sản cho thuê chuyên nghiệp.</p>
      </footer>

      {/* ALL SYSTEM MODALS */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      <UpdateAccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />

      <PropertyFormModal
        isOpen={isPropertyFormOpen}
        onClose={() => setIsPropertyFormOpen(false)}
        initialProperty={selectedPropertyForEdit}
      />

      <PropertyDetailModal
        property={selectedPropertyForDetail}
        isOpen={isPropertyDetailOpen}
        onClose={() => setIsPropertyDetailOpen(false)}
        onOpenImages={handleOpenImages}
      />

      <ImageSliderModal
        images={imageSliderProps?.images || []}
        isOpen={!!imageSliderProps}
        onClose={() => setImageSliderProps(null)}
        title={imageSliderProps?.title}
      />

      <RegisterTenantModal
        room={selectedRoomForRegister}
        isOpen={isRegisterTenantOpen}
        onClose={() => setIsRegisterTenantOpen(false)}
      />

      <RoomSwitchModal
        sourceRoom={selectedRoomForSwitch}
        isOpen={isRoomSwitchOpen}
        onClose={() => setIsRoomSwitchOpen(false)}
      />

      <AttendanceModal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
      />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
