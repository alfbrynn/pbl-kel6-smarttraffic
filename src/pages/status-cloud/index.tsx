import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import styles from '@/styles/StatusCloud.module.css';

export default function StatusCloud() {
  const sensorData = [
    { id: 'PBL-MLG-01', location: 'Utara', status: 'Aktif', update: 'Baru saja' },
    { id: 'PBL-MLG-02', location: 'Barat', status: 'Aktif', update: '1m yang lalu' },
    { id: 'PBL-MLG-03', location: 'Timur', status: 'Aktif', update: '3m yang lalu' },
    { id: 'PBL-MLG-04', location: 'Selatan', status: 'Aktif', update: '3m yang lalu' },
  ];

  // Helper to simulate the bar chart distribution
  const bars = [40, 60, 80, 50, 100, 70, 80, 50, 40, 90, 60, 50, 80];

  return (
    <>
      <Head>
        <title>SMARTRAF - Status Cloud</title>
        <meta name="description" content="Status Sinkronisasi Cloud" />
      </Head>

      <MainLayout>
        <div className={styles.container}>
          
          {/* HEADER */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Log Sinkronisasi</h1>
              <p className={styles.pageSubtitle}>
                <span className={styles.liveDot}></span>
                Data terakhir diterima: <span className={styles.boldText}>2 detik yang lalu</span>
              </p>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.btnSecondary}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Segarkan
              </button>
              <button className={styles.btnPrimary}>
                Unduh Log
              </button>
            </div>
          </div>

          {/* STATUS CARDS */}
          <div className={styles.statusRow}>
            {/* GCP */}
            <div className={styles.statusCard}>
              <div className={styles.scHeader}>
                <div className={styles.scTitleBox}>
                  <span className={styles.scLabel}>INFRASTRUKTUR</span>
                  <h3 className={styles.scName}>GCP Virtual Machine</h3>
                </div>
                <div className={styles.scIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <div className={styles.scFooter}>
                <div className={`${styles.scStatus} ${styles.online}`}>
                  <span className={styles.liveDot}></span> Online
                </div>
                <div className={styles.scMeta}>IP: 34.120.45.xx</div>
              </div>
              <div className={styles.scBar}></div>
            </div>

            {/* MQTT */}
            <div className={styles.statusCard}>
              <div className={styles.scHeader}>
                <div className={styles.scTitleBox}>
                  <span className={styles.scLabel}>PROTOKOL</span>
                  <h3 className={styles.scName}>Mosquitto MQTT Broker</h3>
                </div>
                <div className={styles.scIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <div className={styles.scFooter}>
                <div className={`${styles.scStatus} ${styles.online}`}>
                  <span className={styles.liveDot}></span> Connected
                </div>
                <div className={styles.scMeta}>Port: 1883</div>
              </div>
              <div className={styles.scBar}></div>
            </div>

            {/* FIREBASE */}
            <div className={styles.statusCard}>
              <div className={styles.scHeader}>
                <div className={styles.scTitleBox}>
                  <span className={styles.scLabel}>DATABASE</span>
                  <h3 className={styles.scName}>Firebase Firestore</h3>
                </div>
                <div className={styles.scIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <div className={styles.scFooter}>
                <div className={`${styles.scStatus} ${styles.online}`}>
                  <span className={styles.liveDot}></span> Synced
                </div>
                <div className={styles.scMeta}>Region: asia-southeast1</div>
              </div>
              <div className={styles.scBar}></div>
            </div>
          </div>

          {/* MIDDLE ROW */}
          <div className={styles.middleRow}>
            {/* Chart Simulation Card */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Aktivitas Jaringan Real-time</h3>
                <span className={styles.chartLatency}>LATENCY: 42ms</span>
              </div>
              <div className={styles.chartArea}>
                {bars.map((h, i) => (
                  <div 
                    key={i} 
                    className={`${styles.bar} ${h > 80 ? styles.active : ''}`} 
                    style={{ height: `${h}%` }}>
                  </div>
                ))}
              </div>
            </div>

            {/* Log Sistem Card */}
            <div className={styles.logCard}>
              <div>
                <h3 className={styles.lcTitle}>Log Sistem</h3>
                <p className={styles.lcDesc}>
                  Monitoring aktivitas backend dan kesehatan infrastruktur IoT
                </p>
              </div>
              <Link href="/status-cloud/log" className={styles.btnLihatLog} style={{ display: 'block', textDecoration: 'none' }}>Lihat Log</Link>
            </div>
          </div>

          {/* BOTTOM ROW (TABLE) */}
          <div className={styles.sensorCard}>
            <div className={styles.sensorHeader}>
              <h3 className={styles.sensorTitle}>Daftar Sensor</h3>
              <div className={styles.syncBadge}>STATUS TOTAL: SINKRON</div>
            </div>

            <table className={styles.sensorTable}>
              <thead>
                <tr>
                  <th>ID PERANGKAT</th>
                  <th>LOKASI</th>
                  <th>STATUS DATA</th>
                  <th>TERAKHIR UPDATE</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {sensorData.map((s, idx) => (
                  <tr key={idx}>
                    <td className={styles.idPerangkat}>{s.id}</td>
                    <td>{s.location}</td>
                    <td>
                      <span className={styles.sensorStatus}>
                        <span className={styles.liveDot}></span> {s.status}
                      </span>
                    </td>
                    <td>{s.update}</td>
                    <td><span className={styles.actionLink}>Detail</span></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className={styles.seeAllBtn}>
              LIHAT SEMUA PERANGKAT 
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          <div className={styles.footer}>
            SMARTRAF 2026 — PBL KELOMPOK 6.
          </div>
        </div>
      </MainLayout>
    </>
  );
}
