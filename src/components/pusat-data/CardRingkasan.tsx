// components/pusat-data/CardRingkasan.tsx
import React from 'react';

interface CardRingkasanProps {
  title: string;
  value: string | number;
  trendText: string;
  trendType: 'positive' | 'neutral' | 'negative';
}

export default function CardRingkasan({ title, value, trendText, trendType }: CardRingkasanProps) {
  // Logika warna berdasarkan trendType
  const bgColor = trendType === 'positive' ? 'bg-green-500/10' : trendType === 'neutral' ? 'bg-blue-500/10' : 'bg-red-500/10';
  const textColor = trendType === 'positive' ? 'text-green-500' : trendType === 'neutral' ? 'text-blue-500' : 'text-red-500';

  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-border-color flex-1 flex flex-col justify-center">
      <h3 className="text-sm font-medium text-text-secondary mb-1">{title}</h3>
      <p className="text-4xl font-bold text-text-main">{value}</p>
      <span className={`text-xs font-medium mt-2 w-fit px-2 py-1 rounded ${bgColor} ${textColor}`}>
        {trendText}
      </span>
    </div>
  );
}