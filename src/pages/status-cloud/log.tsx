import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import styles from '@/styles/LogSistem.module.css';

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
    if (level === 'INFO') return styles.badgeInfo;
    if (level === 'WARNING') return styles.badgeWarning;
    if (level === 'ERROR') return styles.badgeError;
    return '';
  };

  return (
    <>
      <Head>
        <title>SMARTRAF - Detail Log Sistem</title>
        <meta name="description" content="Detail Monitoring Aktivitas Backend" />
      </Head>

      <MainLayout>
        <div className={styles.container}>
          
          <Link href="/status-cloud" className={styles.backButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Kembali ke Status Cloud
          </Link>

          <div className={styles.tableCard}>
            <div className={styles.cardHeader}>
              <div className={styles.titleArea}>
                <h2 className={styles.mainTitle}>Diagnostik Sistem Real-time</h2>
                <p className={styles.subTitle}>Monitoring aktivitas backend dan kesehatan infrastruktur IoT</p>
              </div>
              <div className={styles.filterArea}>
                <div className={styles.searchBox}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input type="text" className={styles.searchInput} placeholder="Cari ID Error atau Node" />
                </div>
                <div className={styles.filterBox}>
                  Semua Status
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>WAKTU (WIB)</th>
                  <th>KOMPONEN</th>
                  <th>TINGKAT</th>
                  <th>PESAN SISTEM</th>
                </tr>
              </thead>
              <tbody>
                {logData.map((log, i) => (
                  <tr key={i}>
                    <td className={styles.tdMono}>{log.time}</td>
                    <td className={styles.tdComp}>{log.comp}</td>
                    <td>
                      <span className={`${styles.badge} ${getBadgeClass(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className={styles.tdMono}>{log.msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.pagination}>
              <span>Menampilkan 1-10 dari 1,240 log</span>
              <div className={styles.pageControls}>
                <button className={styles.textBtn}>Sebelumnya</button>
                <button className={`${styles.numBtn} ${styles.active}`}>1</button>
                <button className={styles.numBtn}>2</button>
                <button className={styles.numBtn}>3</button>
                <span style={{ fontSize: '12px', margin: '0 4px', color: '#94a3b8' }}>...</span>
                <button className={styles.textBtn}>Selanjutnya</button>
              </div>
            </div>
          </div>

          {/* BOTTOM STATS ROW */}
          <div className={styles.statsRow}>
            <div className={styles.bottomStat}>
              <div className={styles.bsLabel}>SISTEM UPTIME</div>
              <div className={styles.bsValueRow}>
                <span className={styles.bsValue}>99.98%</span>
                <span className={`${styles.bsBadge} ${styles.green}`}>STABIL</span>
              </div>
            </div>

            <div className={styles.bottomStat}>
              <div className={styles.bsLabel}>ACTIVE NODES</div>
              <div className={styles.bsValueRow}>
                <span className={styles.bsValue}>242</span>
                <span className={`${styles.bsBadge} ${styles.gray}`}>DARI 245</span>
              </div>
            </div>

            <div className={`${styles.bottomStat} ${styles.bottomStatError}`}>
              <div className={`${styles.bsLabel} ${styles.bsLabelError}`}>ERROR (LAST 1H)</div>
              <div className={styles.bsValueRow}>
                <span className={`${styles.bsValue} ${styles.bsValueError}`}>12</span>
                <span className={`${styles.bsBadge} ${styles.red}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '2px'}}>
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                  2%
                </span>
              </div>
            </div>

            <div className={styles.bottomStat}>
              <div className={styles.bsLabel}>MQTT LATENCY</div>
              <div className={styles.bsValueRow}>
                <span className={styles.bsValue}>24ms</span>
                <span className={`${styles.bsBadge} ${styles.gray}`}>LOW</span>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            SMARTRAF 2026 — PBL KELOMPOK 6.
          </div>
        </div>
      </MainLayout>
    </>
  );
}
