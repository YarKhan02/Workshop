import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, UserCar, ProfileState, NewCarData } from '../services/interfaces/auth';

export const useProfile = () => {
  const { user } = useAuth();

  // Mock profile data - replace with API calls
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    address: '123 Main Street, Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001'
  });

  // Mock cars data - replace with API calls
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

  const [state, setState] = useState<ProfileState>({
    isEditing: false,
    showAddCar: false,
  });

  const [newCar, setNewCar] = useState<NewCarData>({
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

  const handleSaveProfile = async () => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving profile:', profile);
      setState(prev => ({ ...prev, isEditing: false }));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddCar = async () => {
    if (!newCar.make || !newCar.model || !newCar.year || !newCar.licensePlate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const carToAdd: UserCar = {
        ...newCar,
        id: Math.random().toString(36).substr(2, 9),
        isDefault: cars.length === 0
      };
      
      setCars(prev => [...prev, carToAdd]);
      setNewCar({ make: '', model: '', year: '', licensePlate: '', color: '' });
      setState(prev => ({ ...prev, showAddCar: false }));
      toast.success('Vehicle added successfully');
    } catch (error) {
      toast.error('Failed to add vehicle');
    }
  };

  const handleRemoveCar = async (carId: string) => {
    try {
      setCars(prev => prev.filter(car => car.id !== carId));
      toast.success('Vehicle removed successfully');
    } catch (error) {
      toast.error('Failed to remove vehicle');
    }
  };

  const handleSetDefaultCar = async (carId: string) => {
    try {
      setCars(prev => prev.map(car => ({
        ...car,
        isDefault: car.id === carId
      })));
      toast.success('Default vehicle updated');
    } catch (error) {
      toast.error('Failed to update default vehicle');
    }
  };

  const toggleEditMode = () => {
    setState(prev => ({ ...prev, isEditing: !prev.isEditing }));
  };

  const toggleAddCarMode = () => {
    setState(prev => ({ ...prev, showAddCar: !prev.showAddCar }));
    if (state.showAddCar) {
      setNewCar({ make: '', model: '', year: '', licensePlate: '', color: '' });
    }
  };

  const handleNewCarChange = (field: keyof NewCarData, value: string) => {
    setNewCar(prev => ({
      ...prev,
      [field]: field === 'licensePlate' ? value.toUpperCase() : value
    }));
  };

  return {
    profile,
    cars,
    newCar,
    isEditing: state.isEditing,
    showAddCar: state.showAddCar,
    handleProfileUpdate,
    handleSaveProfile,
    handleAddCar,
    handleRemoveCar,
    handleSetDefaultCar,
    toggleEditMode,
    toggleAddCarMode,
    handleNewCarChange,
  };
};
