// components/pusat-data/TabelLogSensor.tsx
import React from 'react';

// Data dummy (nantinya diganti dengan data dari Firebase)
const DUMMY_DATA = [
    { waktu: '15:20:22 WIB', id: 'SENS-UTARA-01', jarak: '2.4 Meter', status: 'Sedang' },
    // ...
];

export default function TabelLogSensor() {
    return (
        <section className="bg-bg-card p-6 rounded-xl shadow-sm border border-border-color">
            <h2 className="text-lg font-semibold mb-4 text-text-main">Log Data Sensor Real-time</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {/* Struktur thead dan tbody ... */}
                </table>
            </div>
        </section>
    );
}