import React from 'react'

const JewelryBadges = ({ specs }: { specs: any }) => {
  if (!specs) return null;

  const attributes = [
    { label: "18k Gold Plated", icon: "✨", active: !!specs.plating },
    { label: "Anti-Tarnish", icon: "🛡️", active: specs.is_anti_tarnish },
    { label: "Water Resistant", icon: "💧", active: specs.is_water_resistant },
  ];

  return (
    <div className="flex flex-wrap gap-3 my-6">
      {attributes.map((attr) => attr.active && (
        <div key={attr.label} className="flex items-center bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-gray-700">{attr.icon} {attr.label}</span>
        </div>
      ))}
    </div>
  )
}

export default JewelryBadges
