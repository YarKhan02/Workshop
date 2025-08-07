import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Car, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface UserCar {
  id: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color: string;
  isDefault: boolean;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddCar, setShowAddCar] = useState(false);

  // Mock user profile data
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    address: '123 Main Street, Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001'
  });

  // Mock cars data
  const [cars, setCars] = useState<UserCar[]>([
    {
      id: '1',
      make: 'BMW',
      model: 'X5',
      year: '2022',
      licensePlate: 'MH01AB1234',
      color: 'Black',
      isDefault: true
    },
    {
      id: '2',
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      licensePlate: 'MH02CD5678',
      color: 'White',
      isDefault: false
    }
  ]);

  const [newCar, setNewCar] = useState<Omit<UserCar, 'id' | 'isDefault'>>({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    color: ''
  });

  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Here you would save to API
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  const handleAddCar = () => {
    if (newCar.make && newCar.model && newCar.year && newCar.licensePlate) {
      const carToAdd: UserCar = {
        ...newCar,
        id: Math.random().toString(36).substr(2, 9),
        isDefault: cars.length === 0
      };
      setCars(prev => [...prev, carToAdd]);
      setNewCar({ make: '', model: '', year: '', licensePlate: '', color: '' });
      setShowAddCar(false);
    }
  };

  const handleRemoveCar = (carId: string) => {
    setCars(prev => prev.filter(car => car.id !== carId));
  };

  const handleSetDefaultCar = (carId: string) => {
    setCars(prev => prev.map(car => ({
      ...car,
      isDefault: car.id === carId
    })));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              My <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Profile</span>
            </h1>
            <p className="text-white/70 text-lg">
              Manage your personal information and vehicle details
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <User className="w-6 h-6 mr-3 text-orange-400" />
                  Personal Information
                </h2>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-300"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  ) : (
                    <div className="text-white font-medium">{profile.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  ) : (
                    <div className="text-white font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-orange-400" />
                      {profile.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  ) : (
                    <div className="text-white font-medium flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-orange-400" />
                      {profile.phone}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => handleProfileUpdate('address', e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  ) : (
                    <div className="text-white font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-orange-400" />
                      {profile.address}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => handleProfileUpdate('city', e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    ) : (
                      <div className="text-white font-medium">{profile.city}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.state}
                        onChange={(e) => handleProfileUpdate('state', e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    ) : (
                      <div className="text-white font-medium">{profile.state}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">ZIP Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.zipCode}
                        onChange={(e) => handleProfileUpdate('zipCode', e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    ) : (
                      <div className="text-white font-medium">{profile.zipCode}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Car className="w-6 h-6 mr-3 text-orange-400" />
                  My Vehicles
                </h2>
                <button
                  onClick={() => setShowAddCar(true)}
                  className="flex items-center px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-300"
                >
                  Add Vehicle
                </button>
              </div>

              <div className="space-y-4">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      car.isDefault
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-orange-900/30 bg-black/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">
                          {car.year} {car.make} {car.model}
                        </div>
                        <div className="text-white/60 text-sm">
                          {car.licensePlate} • {car.color}
                        </div>
                        {car.isDefault && (
                          <div className="text-orange-400 text-xs font-medium mt-1">
                            Default Vehicle
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!car.isDefault && (
                          <button
                            onClick={() => handleSetDefaultCar(car.id)}
                            className="text-xs px-3 py-1 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition-colors"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveCar(car.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {cars.length === 0 && (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-orange-400/50 mx-auto mb-4" />
                    <p className="text-white/60">No vehicles added yet</p>
                  </div>
                )}
              </div>

              {/* Add Vehicle Form */}
              {showAddCar && (
                <div className="mt-6 p-4 border border-orange-500/30 rounded-lg bg-orange-500/5">
                  <h3 className="text-white font-semibold mb-4">Add New Vehicle</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Make (e.g., Toyota)"
                        value={newCar.make}
                        onChange={(e) => setNewCar(prev => ({ ...prev, make: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
                      />
                      <input
                        type="text"
                        placeholder="Model (e.g., Camry)"
                        value={newCar.model}
                        onChange={(e) => setNewCar(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="number"
                        placeholder="Year"
                        value={newCar.year}
                        onChange={(e) => setNewCar(prev => ({ ...prev, year: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
                        min="1990"
                        max="2025"
                      />
                      <input
                        type="text"
                        placeholder="License Plate"
                        value={newCar.licensePlate}
                        onChange={(e) => setNewCar(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                        className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
                      />
                      <input
                        type="text"
                        placeholder="Color (optional)"
                        value={newCar.color}
                        onChange={(e) => setNewCar(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddCar}
                        className="px-6 py-2 bg-orange-500 text-black rounded-lg font-medium hover:bg-orange-400 transition-colors"
                      >
                        Add Vehicle
                      </button>
                      <button
                        onClick={() => setShowAddCar(false)}
                        className="px-6 py-2 bg-black/50 border border-orange-900/30 text-white rounded-lg hover:border-orange-500/50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
