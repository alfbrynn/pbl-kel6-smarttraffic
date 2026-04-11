import Head from 'next/head';
import MainLayout from '@/components/layouts/MainLayout';
import styles from '@/styles/Laporan.module.css';

export default function Laporan() {
  const tableData = [
    { time: '08:30', location: 'Jalur Utara', distance: 15, status: 'PADAT' },
    { time: '08:32', location: 'Jalur Selatan', distance: 120, status: 'LANCAR' },
    { time: '08:35', location: 'Jalur Timur', distance: 45, status: 'CUKUP PADAT' },
    { time: '08:38', location: 'Jalur Barat', distance: 200, status: 'LANCAR' },
    { time: '08:40', location: 'Jalur Utara', distance: 25, status: 'PADAT' },
  ];

  return (
    <>
      <Head>
        <title>SMARTRAF - Laporan</title>
        <meta name="description" content="Laporan Data Sensor Real-time" />
      </Head>

      <MainLayout>
        <div className={styles.container}>
          
          {/* PAGE HEADER */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Log Data Sensor Real-time</h1>
              <p className={styles.pageSubtitle}>Laporan komprehensif aktivitas sensor pada jalur utama hari ini.</p>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.btnSecondary}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Unduh CSV
              </button>
              <button className={styles.btnPrimary}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Cetak PDF
              </button>
            </div>
          </div>

          {/* STATS ROW */}
          <div className={styles.statsRow}>
            {/* STAT 1 */}
            <div className={styles.statCard}>
              <div className={styles.scHeader}>TOTAL DETEKSI</div>
              <div className={styles.scValueRow}>
                <div className={styles.scValue}>1, 284</div>
                <div className={styles.scBadge}>+12%</div>
              </div>
            </div>

            {/* STAT 2 */}
            <div className={styles.statCard}>
              <div className={styles.scHeader}>RATA-RATA JARAK</div>
              <div className={styles.scValueRow}>
                <div className={styles.scValue}>82</div>
                <div className={styles.scUnit}>cm</div>
              </div>
            </div>

            {/* STAT 3 */}
            <div className={styles.statCard}>
              <div className={styles.scHeader}>STATUS NORMAL</div>
              <div className={styles.scValueRow}>
                <div className={styles.scValue}>94.2</div>
                <div className={styles.scUnit}>%</div>
              </div>
            </div>

            {/* STAT 4 */}
            <div className={styles.statCard}>
              <div className={styles.scHeader}>ALERT SISTEM</div>
              <div className={styles.scValueRow}>
                <div className={styles.scAlert}>03</div>
                <div className={styles.scAlertIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className={styles.tableCard}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>WAKTU (WIB)</th>
                  <th>LOKASI JALUR</th>
                  <th>JARAK DETEKSI (CM)</th>
                  <th>STATUS</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => {
                  let statusClass = '';
                  if (row.status === 'PADAT') statusClass = styles.statusPadat;
                  else if (row.status === 'LANCAR') statusClass = styles.statusLancar;
                  else if (row.status === 'CUKUP PADAT') statusClass = styles.statusCukupPadat;

                  return (
                    <tr key={idx}>
                      <td>{row.time}</td>
                      <td>{row.location}</td>
                      <td>{row.distance}</td>
                      <td>
                        <span className={`${styles.statusPill} ${statusClass}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.actionBtn}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* PAGINATION */}
            <div className={styles.pagination}>
              <span>Menampilkan <strong>1-5</strong> dari <strong>100</strong> data</span>
              <div className={styles.pageControls}>
                <button className={styles.pageNavBtn}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button className={`${styles.pageNum} ${styles.active}`}>1</button>
                <button className={styles.pageNum}>2</button>
                <button className={styles.pageNum}>3</button>
                <span className={styles.pageEllipsis}>...</span>
                <button className={styles.pageNum}>20</button>
                <button className={styles.pageNavBtn}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM CARDS */}
          <div className={styles.bottomRow}>
            
            {/* ANALYSIS CARD */}
            <div className={styles.analysisCard}>
              {/* Decorative Background */}
              <div className={styles.bgIllustration}>
                <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 100 L60 40 L100 80 L140 20 L180 60" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="140" cy="80" r="28" stroke="currentColor" strokeWidth="16" />
                </svg>
              </div>

              <div className={styles.analysisContent}>
                <h3 className={styles.analysisTitle}>Analisis Kecepatan Arus</h3>
                <p className={styles.analysisDesc}>
                  Visualisasi rata-rata kecepatan kendaraan berdasarkan data sensor hari ini di seluruh persimpangan.
                </p>
                <div className={styles.analysisMetrics}>
                  <div className={styles.metricCol}>
                    <span className={styles.metricLabel}>EFISIENSI JALUR</span>
                    <span className={styles.metricVal}>82%</span>
                  </div>
                  <div className={styles.metricCol}>
                    <span className={styles.metricLabel}>WAKTU TEMPUH</span>
                    <span className={styles.metricVal}>-4.2<small style={{fontSize: '14px', letterSpacing: '0'}}>m</small></span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY CARD */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryContent}>
                <h3 className={styles.summaryTitle}>Ringkasan Puncak Kepadatan</h3>
                <p className={styles.summaryDesc}>
                  Puncak kemacetan hari ini terjadi pada pukul 08:00 WIB di jalur utara.
                </p>
              </div>
              <div className={styles.summaryIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 0 0-8 8v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a8 8 0 0 0-8-8z"></path>
                  <circle cx="9" cy="13" r="2"></circle>
                  <circle cx="15" cy="13" r="2"></circle>
                  <path d="M10 17h4"></path>
                  {/* Headset mic */}
                  <path d="M22 13v8a2 2 0 0 1-2 2H16"></path>
                </svg>
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
