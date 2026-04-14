import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';

export default function LogSistem() {
  const logData = [
    { time: '14:20:01', comp: 'Mosquitto MQTT', level: 'INFO', msg: 'MQTT Client Connected: PERSIMP-SUD-01' },
    { time: '14:18:45', comp: 'Node.js Backend', level: 'WARNING', msg: 'High CPU Usage on GCP VM - instance-prod-02 (84%)' },
    { time: '14:15:22', comp: 'Firebase Firestore', level: 'INFO', msg: 'Sinkronisasi Firebase berhasil: data cluster-A' },
    { time: '14:12:10', comp: 'GCP Engine', level: 'ERROR', msg: 'Koneksi dari NODE-JKT-01 terputus - Timeout 5000ms' },
    { time: '14:10:05', comp: 'Mosquitto MQTT', level: 'INFO', msg: 'Topic subscription renewed: traffic/flow/#' },
    { time: '14:08:59', comp: 'Node.js Backend', level: 'INFO', msg: 'API Endpoint /v1/telemetry heart-beat: OK' },
    { time: '14:05:30', comp: 'GCP Engine', level: 'WARNING', msg: 'Storage latency detected: zone-asia-southeast1-a' },
    { time: '14:02:11', comp: 'Firebase Firestore', level: 'INFO', msg: 'Batch update success: 154 entries processed' },
    { time: '13:58:44', comp: 'Mosquitto MQTT', level: 'ERROR', msg: 'Socket error: Connection refused at addr 10.0.4.11' },
    { time: '13:55:00', comp: 'Node.js Backend', level: 'INFO', msg: 'System garbage collection completed in 45ms' }
  ];

  const getBadgeClass = (level: string) => {
    if (level === 'INFO') return 'bg-accent-cyan-hover text-white';
    if (level === 'WARNING') return 'bg-accent-orange-bg text-accent-orange';
    if (level === 'ERROR') return 'bg-accent-red-bg text-accent-red';
    return '';
  };

  return (
    <>
      <Head>
        <title>SMARTRAF - Detail Log Sistem</title>
        <meta name="description" content="Detail Monitoring Aktivitas Backend" />
      </Head>

      <MainLayout>
        <div className="flex flex-col gap-6">
          
          <Link href="/status-cloud" className="inline-flex items-center gap-2 bg-transparent border-none text-[13px] font-semibold text-text-secondary cursor-pointer mb-[-8px] p-0 transition-colors duration-200 no-underline hover:text-text-main">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Kembali ke Status Cloud
          </Link>

          <div className="bg-bg-card rounded-custom shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-border-color">
              <div className="flex flex-col">
                <h2 className="text-[18px] font-bold text-text-main m-0 mb-1.5">Diagnostik Sistem Real-time</h2>
                <p className="text-[13px] text-text-secondary m-0">Monitoring aktivitas backend dan kesehatan infrastruktur IoT</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center bg-bg-card-alt rounded-[6px] px-3 py-2 gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input type="text" className="border-none bg-transparent outline-none text-[13px] text-text-main w-[200px] placeholder:text-text-secondary" placeholder="Cari ID Error atau Node" />
                </div>
                <div className="flex items-center bg-bg-main border border-border-color rounded-[6px] px-3 py-2 text-[13px] text-text-main font-semibold cursor-pointer gap-2">
                  Semua Status
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] bg-bg-card border-b border-border-color">WAKTU (WIB)</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] bg-bg-card border-b border-border-color">KOMPONEN</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] bg-bg-card border-b border-border-color">TINGKAT</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] bg-bg-card border-b border-border-color">PESAN SISTEM</th>
                </tr>
              </thead>
              <tbody>
                {logData.map((log, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-[12px] text-text-secondary border-b border-border-color align-middle font-mono">{log.time}</td>
                    <td className="px-6 py-4 text-[12px] text-text-main border-b border-border-color align-middle font-bold">{log.comp}</td>
                    <td className="px-6 py-4 text-[12px] text-text-main border-b border-border-color align-middle">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-[12px] text-[9px] font-extrabold tracking-[0.5px] uppercase ${getBadgeClass(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-text-secondary border-b border-border-color align-middle font-mono">{log.msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-4 flex justify-between items-center text-[12px] text-text-secondary">
              <span>Menampilkan 1-10 dari 1,240 log</span>
              <div className="flex items-center gap-2">
                <button className="bg-bg-card border border-border-color rounded-[4px] px-3 py-1.5 text-[12px] font-semibold text-text-main cursor-pointer transition-colors duration-200 hover:bg-bg-hover">Sebelumnya</button>
                <button className="bg-bg-hover border-none w-7 h-7 flex items-center justify-center rounded-[4px] text-[12px] text-text-main font-semibold cursor-pointer">1</button>
                <button className="bg-transparent border-none w-7 h-7 flex items-center justify-center rounded-[4px] text-[12px] text-text-secondary font-semibold cursor-pointer hover:bg-bg-hover">2</button>
                <button className="bg-transparent border-none w-7 h-7 flex items-center justify-center rounded-[4px] text-[12px] text-text-secondary font-semibold cursor-pointer hover:bg-bg-hover">3</button>
                <span className="text-[12px] text-text-secondary mx-1">...</span>
                <button className="bg-bg-card border border-border-color rounded-[4px] px-3 py-1.5 text-[12px] font-semibold text-text-main cursor-pointer transition-colors duration-200 hover:bg-bg-hover">Selanjutnya</button>
              </div>
            </div>
          </div>

          {/* BOTTOM STATS ROW */}
          <div className="grid grid-cols-4 gap-5">
            <div className="bg-bg-card-alt rounded-custom p-6 flex flex-col">
              <div className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] mb-3">SISTEM UPTIME</div>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-semibold text-text-main tracking-tight">99.98%</span>
                <span className="text-[10px] font-extrabold text-accent-green">STABIL</span>
              </div>
            </div>

            <div className="bg-bg-card-alt rounded-custom p-6 flex flex-col">
              <div className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] mb-3">ACTIVE NODES</div>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-semibold text-text-main tracking-tight">242</span>
                <span className="text-[10px] font-extrabold text-text-secondary">DARI 245</span>
              </div>
            </div>

            <div className="bg-[rgba(239,68,68,0.1)] border border-accent-red rounded-custom p-6 flex flex-col">
              <div className="text-[11px] font-bold text-accent-red uppercase tracking-[0.5px] mb-3">ERROR (LAST 1H)</div>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-semibold text-accent-red tracking-tight">12</span>
                <span className="text-[10px] font-extrabold text-accent-red">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', marginRight: '2px', verticalAlign: 'middle'}}>
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                  2%
                </span>
              </div>
            </div>

            <div className="bg-bg-card-alt rounded-custom p-6 flex flex-col">
              <div className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] mb-3">MQTT LATENCY</div>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-semibold text-text-main tracking-tight">24ms</span>
                <span className="text-[10px] font-extrabold text-text-secondary">LOW</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 pb-0 text-[12px] text-[#94a3b8]">
            SMARTRAF 2026 — PBL KELOMPOK 6.
          </div>
        </div>
      </MainLayout>
    </>
  );
}
