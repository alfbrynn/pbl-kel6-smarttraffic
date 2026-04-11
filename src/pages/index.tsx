import Head from 'next/head';
import Image from 'next/image';
import MainLayout from '@/components/layouts/MainLayout';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>SMARTRAF - Pusat Kontrol</title>
        <meta name="description" content="Dashboard Smart Traffic" />
      </Head>

      <MainLayout>
        <div className={styles.dashboard}>

          {/* STATS ROW */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>STATUS SISTEM</span>
                <span className={styles.statValue}>Optimal</span>
              </div>
              <div className={`${styles.iconWrapper} ${styles.green}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>RATA-RATA ANTREAN</span>
                <span className={styles.statValue}>42.5<small>CM</small></span>
              </div>
              <div className={`${styles.iconWrapper} ${styles.blue}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="M18 17V9"></path>
                  <path d="M13 17V5"></path>
                  <path d="M8 17v-3"></path>
                </svg>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>SENSOR AKTIF</span>
                <span className={styles.statValue}>4 / 4</span>
              </div>
              <div className={`${styles.iconWrapper} ${styles.yellow}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                  <path d="M12 12v9"></path>
                  <path d="m8 17 4 4 4-4"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* SECTION HEADER */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Monitoring Persimpangan Utama</h2>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot}></span>
              Live Update
            </div>
          </div>

          {/* TRAFFIC GRID */}
          <div className={styles.trafficGrid}>
            {/* UTARA */}
            <div className={styles.trafficCard}>
              <div className={styles.tcHeader}>
                <div className={styles.tcTitleGroup}>
                  <h3 className={styles.tcTitle}>Jalur Utara</h3>
                  <p className={styles.tcSubtitle}>ID Sensor: SN-UTARA-01</p>
                </div>
                <div className={`${styles.statusBadge} ${styles.lancar}`}>Lancar</div>
              </div>
              <div className={styles.tcBody}>
                <div className={styles.tL}>
                  <div className={`${styles.tLLight} ${styles.red}`}></div>
                  <div className={`${styles.tLLight} ${styles.yellow}`}></div>
                  <div className={`${styles.tLLight} ${styles.green} ${styles.active}`}></div>
                </div>
                <div className={styles.tcInfo}>
                  <div className={styles.tcLabel}>JARAK ANTREAN</div>
                  <div className={styles.tcValue}>24<small>CM</small></div>
                  <div className={styles.tcBarTrack}>
                    <div className={`${styles.tcBarFill} ${styles.lancar}`} style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* SELATAN */}
            <div className={styles.trafficCard}>
              <div className={styles.tcHeader}>
                <div className={styles.tcTitleGroup}>
                  <h3 className={styles.tcTitle}>Jalur Selatan</h3>
                  <p className={styles.tcSubtitle}>ID Sensor: SN-SELATAN-02</p>
                </div>
                <div className={`${styles.statusBadge} ${styles.cukupPadat}`}>Cukup Padat</div>
              </div>
              <div className={styles.tcBody}>
                <div className={styles.tL}>
                  <div className={`${styles.tLLight} ${styles.red}`}></div>
                  <div className={`${styles.tLLight} ${styles.yellow} ${styles.active}`}></div>
                  <div className={`${styles.tLLight} ${styles.green}`}></div>
                </div>
                <div className={styles.tcInfo}>
                  <div className={styles.tcLabel}>JARAK ANTREAN</div>
                  <div className={styles.tcValue}>142<small>CM</small></div>
                  <div className={styles.tcBarTrack}>
                    <div className={`${styles.tcBarFill} ${styles.cukupPadat}`} style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* TIMUR */}
            <div className={styles.trafficCard}>
              <div className={styles.tcHeader}>
                <div className={styles.tcTitleGroup}>
                  <h3 className={styles.tcTitle}>Jalur Timur</h3>
                  <p className={styles.tcSubtitle}>ID Sensor: SN-TIMUR-03</p>
                </div>
                <div className={`${styles.statusBadge} ${styles.padat}`}>Padat</div>
              </div>
              <div className={styles.tcBody}>
                <div className={styles.tL}>
                  <div className={`${styles.tLLight} ${styles.red} ${styles.active}`}></div>
                  <div className={`${styles.tLLight} ${styles.yellow}`}></div>
                  <div className={`${styles.tLLight} ${styles.green}`}></div>
                </div>
                <div className={styles.tcInfo}>
                  <div className={styles.tcLabel}>JARAK ANTREAN</div>
                  <div className={styles.tcValue}>482<small>CM</small></div>
                  <div className={styles.tcBarTrack}>
                    <div className={`${styles.tcBarFill} ${styles.padat}`} style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BARAT */}
            <div className={styles.trafficCard}>
              <div className={styles.tcHeader}>
                <div className={styles.tcTitleGroup}>
                  <h3 className={styles.tcTitle}>Jalur Barat</h3>
                  <p className={styles.tcSubtitle}>ID Sensor: SN-BARAT-04</p>
                </div>
                <div className={`${styles.statusBadge} ${styles.lancar}`}>Lancar</div>
              </div>
              <div className={styles.tcBody}>
                <div className={styles.tL}>
                  <div className={`${styles.tLLight} ${styles.red}`}></div>
                  <div className={`${styles.tLLight} ${styles.yellow}`}></div>
                  <div className={`${styles.tLLight} ${styles.green} ${styles.active}`}></div>
                </div>
                <div className={styles.tcInfo}>
                  <div className={styles.tcLabel}>JARAK ANTREAN</div>
                  <div className={styles.tcValue}>12<small>CM</small></div>
                  <div className={styles.tcBarTrack}>
                    <div className={`${styles.tcBarFill} ${styles.lancar}`} style={{ width: '8%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className={styles.bottomRow}>
            {/* MAP CARD */}
            <div className={styles.mapCard}>
              <div className={styles.cardHeaderFull}>
                <h3 className={styles.cardTitle}>Peta Lokasi Persimpangan</h3>
                <span className={styles.actionLink}>
                  PERBESAR
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </span>
              </div>
              <div className={styles.mapImage}>
                {/* Embedded Map Fallback - Using a standard static placeholder styling instead of real interactive map to ensure it matches the static look */}
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=112.61,-7.95,112.62,-7.94&layer=mapnik"
                  style={{ border: 0 }}>
                </iframe>
                <div className={styles.mapOverlay}>
                  <div className={styles.overlayTitle}>KOORDINAT PUSAT</div>
                  <div className={styles.overlayValue}>-6.2088° S, 106.8456° E</div>
                </div>
              </div>
            </div>

            {/* ACTIVITY SYSTEM */}
            <div className={styles.activityCard}>
              <div className={styles.cardHeaderFull}>
                <h3 className={styles.cardTitle}>Aktivitas Sistem</h3>
              </div>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={`${styles.actDot} ${styles.green}`}></div>
                  <div className={styles.actContent}>
                    <span className={styles.actText}>Jalur Utara beralih ke HIJAU</span>
                    <span className={styles.actTime}>14:02:45</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={`${styles.actDot} ${styles.yellow}`}></div>
                  <div className={styles.actContent}>
                    <span className={styles.actText}>Kepadatan terdeteksi di Timur</span>
                    <span className={styles.actTime}>14:01:22</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={`${styles.actDot} ${styles.gray}`}></div>
                  <div className={styles.actContent}>
                    <span className={styles.actText}>Sensor SN-SELATAN-02 Sinkronisasi</span>
                    <span className={styles.actTime}>13:58:10</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={`${styles.actDot} ${styles.red}`}></div>
                  <div className={styles.actContent}>
                    <span className={styles.actText}>Peringatan: Antrean Barat meningkat</span>
                    <span className={styles.actTime}>13:55:04</span>
                  </div>
                </div>
              </div>
              <button className={styles.viewAllLogs}>LIHAT SEMUA LOG SENSOR</button>
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
