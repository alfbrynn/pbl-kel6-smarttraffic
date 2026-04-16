import Head from 'next/head';
import MainLayout from '@/components/layouts/MainLayout';
import StatusCards from '@/components/kesehatan-sistem/StatusCards';
import NetworkActivityCard from '@/components/kesehatan-sistem/NetworkActivityCard';
import SystemLogCard from '@/components/kesehatan-sistem/SystemLogCard';
import SensorTable from '@/components/kesehatan-sistem/SensorTable';

export default function StatusCloud() {
  return (
    <>
      <Head>
        <title>SMARTRAF - Kesehatan Sistem</title>
        <meta name="description" content="Dashboard monitoring kesehatan sistem dan infrastruktur IoT" />
      </Head>

      <MainLayout>
        <div className="flex flex-col gap-6">

          {/* HEADER SECTION */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-[24px] font-bold text-text-main m-0">Infrastruktur & Cloud</h1>
              <p className="text-[13px] text-text-secondary mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-green rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                Status Infrastruktur: <span className="font-bold text-text-main">Operasional</span>
                <span className="text-[11px] text-[#64748b] ml-1 px-1.5 py-0.5 bg-bg-card-alt rounded">SLA 99.9%</span>
              </p>
            </div>
            <div className="flex gap-3">
              {/* <button className="bg-bg-card border border-border-color text-text-main px-4 py-2 rounded-[6px] text-[13px] font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-bg-hover">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export PDF
              </button>
              <button className="bg-accent-cyan text-white px-5 py-2 rounded-[6px] text-[13px] font-bold cursor-pointer transition-all hover:opacity-90 shadow-[0_2px_10px_rgba(6,182,212,0.2)]">
                Refresh Dashboard
              </button> */}
            </div>
          </div>

          {/* CLOUD SERVICES CARDS */}
          <StatusCards />

          {/* MIDDLE SECTION: NETWORK & SYSTEM LOG */}
          <div className="grid grid-cols-[1.8fr_1fr] gap-6">
            <NetworkActivityCard />
            <SystemLogCard />
          </div>

          {/* SENSOR STATUS TABLE */}
          <SensorTable />

          {/* FOOTER */}
          <div className="text-center pt-4 pb-0 text-[12px] text-[#94a3b8] font-medium tracking-wide">
            SMARTRAF IoT INFRASTRUCTURE — PBL KELOMPOK 6
          </div>
        </div>
      </MainLayout>
    </>
  );
}
