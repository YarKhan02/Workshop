import React from 'react';
import {
  Layout,
  ProfileHeader,
  PersonalInfoCard,
  VehicleInfoCard
} from '../components';
import { useProfile } from '../hooks/useProfile';

const Profile: React.FC = () => {
  const {
    profile,
    cars,
    newCar,
    isEditing,
    showAddCar,
    handleProfileUpdate,
    handleSaveProfile,
    handleAddCar,
    handleRemoveCar,
    handleSetDefaultCar,
    toggleEditMode,
    toggleAddCarMode,
    handleNewCarChange,
  } = useProfile();

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <ProfileHeader
              title="Profile"
              subtitle="Manage your personal information and vehicle details"
            />

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <PersonalInfoCard
                profile={profile}
                isEditing={isEditing}
                onEdit={toggleEditMode}
                onSave={handleSaveProfile}
                onUpdate={handleProfileUpdate}
              />

              {/* Vehicle Information */}
              <VehicleInfoCard
                cars={cars}
                newCar={newCar}
                showAddCar={showAddCar}
                onAddCar={handleAddCar}
                onRemoveCar={handleRemoveCar}
                onSetDefaultCar={handleSetDefaultCar}
                onToggleAddCar={toggleAddCarMode}
                onNewCarChange={handleNewCarChange}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;