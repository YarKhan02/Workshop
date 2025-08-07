import React from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save } from 'lucide-react';
import { UserProfile } from '../../services/interfaces/auth';

interface PersonalInfoCardProps {
  profile: UserProfile;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (field: keyof UserProfile, value: string) => void;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  profile,
  isEditing,
  onEdit,
  onSave,
  onUpdate,
}) => {
  return (
    <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <User className="w-6 h-6 mr-3 text-orange-400" />
          Personal Information
        </h2>
        <button
          onClick={isEditing ? onSave : onEdit}
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
              onChange={(e) => onUpdate('name', e.target.value)}
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
              onChange={(e) => onUpdate('email', e.target.value)}
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
              onChange={(e) => onUpdate('phone', e.target.value)}
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
              onChange={(e) => onUpdate('address', e.target.value)}
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
                onChange={(e) => onUpdate('city', e.target.value)}
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
                onChange={(e) => onUpdate('state', e.target.value)}
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
                onChange={(e) => onUpdate('zipCode', e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            ) : (
              <div className="text-white font-medium">{profile.zipCode}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
