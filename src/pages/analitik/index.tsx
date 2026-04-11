import Head from 'next/head';
import MainLayout from '@/components/layouts/MainLayout';
import styles from '@/styles/Analitik.module.css';

export default function Analitik() {
  return (
    <>
      <Head>
        <title>SMARTRAF - Analitik</title>
        <meta name="description" content="Analisis Data Lalu Lintas" />
      </Head>

      <MainLayout>
        <div className={styles.container}>
          
          {/* AI PREDICTION CARD */}
          <div className={styles.aiCard}>
            <div className={styles.aiContentWrapper}>
              <div className={styles.aiIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4"></path>
                  <path d="M12 18v4"></path>
                  <path d="M4.93 4.93l2.83 2.83"></path>
                  <path d="M16.24 16.24l2.83 2.83"></path>
                  <path d="M2 12h4"></path>
                  <path d="M18 12h4"></path>
                  <path d="M4.93 19.07l2.83-2.83"></path>
                  <path d="M16.24 7.76l2.83-2.83"></path>
                </svg>
              </div>
              <div>
                <span className={styles.aiTitle}>PREDIKSI KEPADATAN AI</span>
                <p className={styles.aiText}>
                  "Berdasarkan data historis, <span className={styles.aiHighlight}>Jalur Selatan</span> berpotensi padat pada <span className={styles.aiHighlight}>16:00 WIB</span>"
                </p>
              </div>
            </div>
            <button className={styles.btnAnalysis}>Detail Analisis</button>
          </div>

          {/* MAIN CHART CARD */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <h2 className={styles.chartTitle}>Pola Kepadatan Mingguan</h2>
                <p className={styles.chartSubtitle}>Distribusi intensitas volume kendaraan per jam</p>
              </div>
              <div className={styles.intensityBadge}>
                RENDAH
                <div className={styles.intensityDots}>
                  <div className={styles.iDot1}></div>
                  <div className={styles.iDot2}></div>
                  <div className={styles.iDot3}></div>
                </div>
                TINGGI
              </div>
            </div>

            <div className={styles.legendRow}>
              <div className={styles.legendItem}>
                <div className={`${styles.lDot} ${styles.ldUtara}`}></div> Jalur Utara
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.lDot} ${styles.ldSelatan}`}></div> Jalur Selatan
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.lDot} ${styles.ldTimur}`}></div> Jalur Timur
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.lDot} ${styles.ldBarat}`}></div> Jalur Barat
              </div>
            </div>

            {/* Mocking SVG Chart for Visual Aesthetics */}
            <div className={styles.chartArea}>
              <svg className={styles.svgPlaceholder} viewBox="0 0 800 280" preserveAspectRatio="none">
                {/* Grid Lines */}
                <path d="M50 40 L800 40" stroke="#f1f5f9" strokeWidth="1" />
                <path d="M50 100 L800 100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M50 160 L800 160" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M50 220 L800 220" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M50 280 L800 280" stroke="#f1f5f9" strokeWidth="1" />
                
                {/* Labels Y */}
                <text x="40" y="44" fontSize="10" fill="#94a3b8" textAnchor="end">100%</text>
                <text x="40" y="104" fontSize="10" fill="#94a3b8" textAnchor="end">75%</text>
                <text x="40" y="164" fontSize="10" fill="#94a3b8" textAnchor="end">50%</text>
                <text x="40" y="224" fontSize="10" fill="#94a3b8" textAnchor="end">25%</text>
                <text x="40" y="280" fontSize="10" fill="#94a3b8" textAnchor="end">0%</text>
                
                {/* Labels X */}
                <text x="50" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">00:00</text>
                <text x="200" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">06:00</text>
                <text x="425" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">12:00</text>
                <text x="650" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">18:00</text>
                <text x="800" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">23:00</text>

                {/* Graph Lines (Utara: Dark, Selatan: Green, Timur: Orange, Barat: Red) */}
                <path d="M50 250 L150 230 L250 210 L350 100 L450 150 L550 200 L650 90 L750 160 L800 180" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
                <path d="M50 260 L150 250 L250 200 L350 80 L450 160 L550 180 L650 130 L750 200 L800 240" fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
                <path d="M50 270 L150 260 L250 240 L350 140 L450 200 L550 230 L650 120 L750 230 L800 250" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
                <path d="M50 265 L150 240 L250 160 L350 110 L450 155 L550 140 L650 100 L750 200 L800 230" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
                
                {/* Dots on peaks */}
                <circle cx="350" cy="80" r="3" fill="#10b981"/>
                <circle cx="650" cy="90" r="3" fill="#1e293b"/>
              </svg>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className={styles.bottomRow}>
            {/* MINI CHART */}
            <div className={styles.miniChartCard}>
              <div className={styles.mcHeader}>
                <div>
                  <h2 className={styles.chartTitle}>Rata-rata Waktu Tunggu Kendaraan</h2>
                  <p className={styles.chartSubtitle}>Tren efisiensi lampu lalu lintas dalam 24 jam terakhir</p>
                </div>
                <div className={styles.mcTabs}>
                  <button className={`${styles.mcTab} ${styles.active}`}>HARI INI</button>
                  <button className={styles.mcTab}>KEMARIN</button>
                </div>
              </div>
              <div className={styles.miniChartArea}>
                <svg className={styles.svgPlaceholder} viewBox="0 0 500 180" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <path d="M10 40 L500 40" stroke="#f1f5f9" strokeWidth="1" />
                  <path d="M10 90 L500 90" stroke="#f1f5f9" strokeWidth="1" />
                  <path d="M10 140 L500 140" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Labels X */}
                  <text x="20" y="170" fontSize="9" fill="#94a3b8">00:00</text>
                  <text x="120" y="170" fontSize="9" fill="#94a3b8">06:00</text>
                  <text x="240" y="170" fontSize="9" fill="#94a3b8">12:00</text>
                  <text x="360" y="170" fontSize="9" fill="#94a3b8">18:00</text>
                  <text x="460" y="170" fontSize="9" fill="#94a3b8">23:59</text>

                  {/* Area Chart Path */}
                  <path d="M10 140 L50 130 L100 140 L160 100 L220 80 L300 110 L360 80 L420 55 L500 70 L500 180 L10 180 Z" fill="#f1f5f9" />
                  <path d="M10 140 L50 130 L100 140 L160 100 L220 80 L300 110 L360 80 L420 55 L500 70" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
                  
                  {/* Tooltip Simulation */}
                  <circle cx="420" cy="55" r="4" fill="#1e293b" />
                  <rect x="360" y="20" width="60" height="20" rx="4" fill="#1e293b" />
                  <text x="390" y="34" fontSize="9" fill="#ffffff" textAnchor="middle">16:45: 142s</text>
                </svg>
              </div>
            </div>

            {/* RIGHT STATS */}
            <div className={styles.statsCol}>
              <div className={styles.statWhiteCard}>
                <div className={styles.swHeader}>EFISIENSI RATA-RATA</div>
                <div className={styles.swValueRow}>
                  <div className={styles.swValue}>84.2%</div>
                  <div className={styles.swBadge}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    12%
                  </div>
                </div>
                <div className={styles.swDesc}>Peningkatan arus lalu lintas dibandingkan pekan lalu.</div>
              </div>

              <div className={styles.statDarkCard}>
                <div className={styles.sdHeader}>TOTAL KENDARAAN TERDETEKSI</div>
                <div className={styles.sdValue}>42, 891</div>
                <div className={styles.sdProgressBar}>
                  <div className={styles.sdFill}></div>
                </div>
                <div className={styles.sdDesc}>68% dari kapasitas maksimal.</div>
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
