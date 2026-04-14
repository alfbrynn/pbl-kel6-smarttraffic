import React from 'react';
import Link from 'next/link';

export default function SystemLogCard() {
    return (
        <div className="bg-[#0f172a] text-[#f8fafc] rounded-custom p-8 shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex flex-col justify-between">
            <div>
                <h3 className="text-[16px] font-bold m-0 mb-3 text-white">Log Sistem</h3>
                <p className="text-[13px] text-[#94a3b8] leading-normal mb-6">
                    Monitoring aktivitas backend dan kesehatan infrastruktur IoT melalui dashboard pusat.
                </p>
            </div>
            <Link 
                href="/kesehatan-sistem/log" 
                className="bg-bg-card-alt text-text-main border border-border-color p-3 rounded-[6px] text-[13px] font-bold cursor-pointer w-full text-center transition-opacity duration-200 hover:opacity-90 block no-underline"
            >
                Lihat Log Lengkap
            </Link>
        </div>
    );
}
