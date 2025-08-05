import React from 'react';

interface Stat {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
  className?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats, className = '' }) => {
  return (
    <section className={`py-16 bg-gradient-to-r from-orange-500/10 to-orange-600/10 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="text-5xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
