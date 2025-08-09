import React, { useRef, useEffect } from 'react';
import { Car, Plus } from 'lucide-react';
import { useCars } from '../../../hooks/useBooking';
import { useAuth } from '../../../contexts/AuthContext';
import { themeClasses } from '../../../config/theme';
import type { BookingStepProps, Car as CarType } from '../../../services/interfaces/booking';

interface CarDetailsProps extends BookingStepProps {
  onCarUpdate: (car: CarType) => void;
}

const CarDetails: React.FC<CarDetailsProps> = ({
  bookingData,
  onCarUpdate,
  isLoading = false,
}) => {
  const { cars, loading, addCar } = useCars();
  const { user } = useAuth();
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [selectedCarId, setSelectedCarId] = React.useState<string | null>(null);

  const makeRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const licensePlateRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  // Pre-fill form if bookingData has car info
  useEffect(() => {
    if (bookingData.car && makeRef.current) {
      makeRef.current.value = bookingData.car.make;
      modelRef.current!.value = bookingData.car.model;
      yearRef.current!.value = bookingData.car.year;
      licensePlateRef.current!.value = bookingData.car.license_plate;
      colorRef.current!.value = bookingData.car.color || '';
    }
  }, [bookingData.car]);

  const handleSavedCarSelect = (car: CarType) => {
    setSelectedCarId(car.id || null);
    setIsAddingNew(false);
    onCarUpdate(car);
  };

  const handleNewCarToggle = () => {
    setIsAddingNew(true);
    setSelectedCarId(null);
    // Clear form
    if (makeRef.current) {
      makeRef.current.value = '';
      modelRef.current!.value = '';
      yearRef.current!.value = '';
      licensePlateRef.current!.value = '';
      colorRef.current!.value = '';
    }
  };

  const handleFormUpdate = () => {
    if (!makeRef.current) return;

    const carData: CarType = {
      make: makeRef.current.value.trim(),
      model: modelRef.current!.value.trim(),
      year: yearRef.current!.value.trim(),
      license_plate: licensePlateRef.current!.value.trim(),
      color: colorRef.current!.value.trim(),
    };

    onCarUpdate(carData);
  };

  const handleSaveNewCar = async () => {
    if (!makeRef.current) return;

    const carData: CarType = {
      make: makeRef.current.value.trim(),
      model: modelRef.current!.value.trim(),
      year: yearRef.current!.value.trim(),
      license_plate: licensePlateRef.current!.value.trim(),
      color: colorRef.current!.value.trim(),
      customer_id: user?.id, // Include customer ID from authenticated user
    };

    try {
      await addCar(carData);
      // Car is now saved and will appear in the saved cars list
    } catch (error) {
      console.error('Failed to save car:', error);
      // You might want to show a toast notification here
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
          Vehicle Information
        </h2>
        <p className="text-white/70">Select your vehicle or add a new one</p>
      </div>

      {/* Saved Cars Section */}
      {!loading && cars.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Your Saved Vehicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <SavedCarCard
                key={car.id}
                car={car}
                isSelected={selectedCarId === car.id}
                onSelect={() => handleSavedCarSelect(car)}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add New Car Button */}
      {!isAddingNew && (
        <div className="text-center">
          <button
            onClick={handleNewCarToggle}
            disabled={isLoading}
            className={`
              ${themeClasses.button.outline} 
              px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Plus className="w-5 h-5" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      )}

      {/* New Car Form */}
      {(isAddingNew || cars.length === 0) && (
        <div className={`${themeClasses.card.primary} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Car className="w-6 h-6 mr-2 text-orange-400" />
              Vehicle Details
            </h3>
            {cars.length > 0 && (
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <CarForm
            makeRef={makeRef}
            modelRef={modelRef}
            yearRef={yearRef}
            licensePlateRef={licensePlateRef}
            colorRef={colorRef}
            onUpdate={handleFormUpdate}
            onSave={handleSaveNewCar}
            isLoading={isLoading}
            showSaveButton={true}
          />
        </div>
      )}
    </div>
  );
};

interface SavedCarCardProps {
  car: CarType;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const SavedCarCard: React.FC<SavedCarCardProps> = ({
  car,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  const cardClasses = `
    ${themeClasses.card.primary} 
    ${isSelected ? themeClasses.card.featured : ''} 
    p-4 cursor-pointer relative group
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <div className={cardClasses} onClick={disabled ? undefined : onSelect}>
      <div className="flex items-center mb-2">
        <Car className="w-5 h-5 text-orange-400 mr-2" />
        <h4 className="text-white font-medium">
          {car.make} {car.model}
        </h4>
      </div>
      <div className="space-y-1 text-sm text-white/60">
        <p>Year: {car.year}</p>
        <p>License: {car.license_plate}</p>
        {car.color && <p>Color: {car.color}</p>}
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

interface CarFormProps {
  makeRef: React.RefObject<HTMLInputElement | null>;
  modelRef: React.RefObject<HTMLInputElement | null>;
  yearRef: React.RefObject<HTMLInputElement | null>;
  licensePlateRef: React.RefObject<HTMLInputElement | null>;
  colorRef: React.RefObject<HTMLInputElement | null>;
  onUpdate: () => void;
  onSave: () => void;
  isLoading: boolean;
  showSaveButton: boolean;
}

const CarForm: React.FC<CarFormProps> = ({
  makeRef,
  modelRef,
  yearRef,
  licensePlateRef,
  colorRef,
  onUpdate,
  onSave,
  isLoading,
  showSaveButton,
}) => {
  const inputClasses = `
    w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white 
    rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
    transition-colors placeholder-white/50
  `;

  const handleInputChange = () => {
    onUpdate();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Make *
          </label>
          <input
            ref={makeRef}
            type="text"
            className={inputClasses}
            placeholder="e.g., Toyota, Honda, BMW"
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Model *
          </label>
          <input
            ref={modelRef}
            type="text"
            className={inputClasses}
            placeholder="e.g., Camry, Civic, X3"
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Year *
          </label>
          <input
            ref={yearRef}
            type="text"
            className={inputClasses}
            placeholder="e.g., 2020"
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Color
          </label>
          <input
            ref={colorRef}
            type="text"
            className={inputClasses}
            placeholder="e.g., White, Black, Silver"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          License Plate *
        </label>
        <input
          ref={licensePlateRef}
          type="text"
          className={inputClasses}
          placeholder="e.g., MH01AB1234"
          onChange={handleInputChange}
          required
        />
      </div>

      {showSaveButton && (
        <div className="flex justify-end">
          <button
            onClick={onSave}
            disabled={isLoading}
            className={`
              ${themeClasses.button.primary} 
              px-6 py-2 rounded-lg text-sm
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            Save Vehicle
          </button>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
