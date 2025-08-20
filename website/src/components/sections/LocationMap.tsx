import React from 'react';
import { MapPin } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface LocationData {
  title: string;
  address: string;
  city: string;
  mapPlaceholder: string;
}

interface WhyChooseUsFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface WhyChooseUsData {
  title: string;
  features: WhyChooseUsFeature[];
}

interface LocationMapProps {
  location: LocationData;
  whyChooseUs: WhyChooseUsData;
}

const LocationMap: React.FC<LocationMapProps> = ({ location, whyChooseUs }) => {
  return (
    <div className="space-y-8">
      {/* Map Placeholder */}
      <div className="bg-black/50 border border-orange-900/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-orange-900/50 to-orange-800/50 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{location.title}</h3>
            <p className="text-gray-400">{location.mapPlaceholder}</p>
          </div>
        </div>
        <div className="p-6">
          <h4 className="font-bold text-white mb-2">Detailing Hub Location</h4>
          <p className="text-gray-400">
            {location.address}<br />
            {location.city}
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className={`${themeClasses.card.primary} p-8`}>
        <h3 className="text-2xl font-bold text-white mb-6">{whyChooseUs.title}</h3>
        <div className="space-y-4">
          {whyChooseUs.features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-start">
                <IconComponent className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
