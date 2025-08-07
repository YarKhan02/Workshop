import React from 'react';
import { themeClasses } from '../../config/theme';

interface ProfileHeaderProps {
  title: string;
  subtitle: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className={`${themeClasses.heading.hero} mb-4`}>
        My <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">{title}</span>
      </h1>
      <p className="text-white/70 text-lg">
        {subtitle}
      </p>
    </div>
  );
};

export default ProfileHeader;
