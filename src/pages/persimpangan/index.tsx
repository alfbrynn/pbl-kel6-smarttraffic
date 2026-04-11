import Head from 'next/head';
import MainLayout from '@/components/layouts/MainLayout';
import styles from '@/styles/Persimpangan.module.css';

export default function Persimpangan() {
  return (
    <>
      <Head>
        <title>SMARTRAF - Persimpangan</title>
        <meta name="description" content="Manajemen Persimpangan" />
      </Head>

      <MainLayout>
        <div className={styles.container}>
          
          {/* TOP ROW */}
          <div className={styles.topRow}>
            {/* PROFILE LOKASI */}
            <div className={styles.profileCard}>
              <div className={styles.cardTag}>IDENTITY PANEL</div>
              <h2 className={styles.profileTitle}>Profil Lokasi</h2>
              
              <div className={styles.locationIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Nama Persimpangan</div>
                  <div className={styles.detailValue}>Simpang Polinema</div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Koordinat GPS</div>
                  <div className={styles.detailValue}>-7.9468, 112.6157</div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Jam Operasional</div>
                  <div className={styles.detailValue}>
                    <span className={styles.liveIndicator}></span>
                    24 Jam
                  </div>
                </div>
              </div>
            </div>

            {/* SKEMA TATA LETAK SENSOR */}
            <div className={styles.schemaCard}>
              <div className={styles.schemaHeader}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20"></path>
                  <path d="M2 12h20"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                SKEMA TATA LETAK SENSOR
              </div>
              <div className={styles.schemaBody}>
                <div className={styles.crossroad}>
                  <div className={styles.roadVertical}></div>
                  <div className={styles.roadHorizontal}></div>
                  <div className={styles.centerCircle}></div>
                  
                  {/* Sensor Dots */}
                  <div className={`${styles.sensorDot} ${styles.sensorUtara}`}></div>
                  <div className={`${styles.sensorDot} ${styles.sensorSelatan}`}></div>
                  <div className={`${styles.sensorDot} ${styles.sensorTimur}`}></div>
                  <div className={`${styles.sensorDot} ${styles.sensorBarat}`}></div>
                  
                  {/* Labels */}
                  <div className={`${styles.roadLabel} ${styles.labelUtara}`}>UTARA</div>
                  <div className={`${styles.roadLabel} ${styles.labelSelatan}`}>SELATAN</div>
                  <div className={`${styles.roadLabel} ${styles.labelTimur}`}>TIMUR</div>
                  <div className={`${styles.roadLabel} ${styles.labelBarat}`}>BARAT</div>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeaderWrapper}>
              <div className={styles.iconBox}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
              </div>
              <div>
                <h2 className={styles.cardHeaderTitle}>Pengaturan Parameter</h2>
                <p className={styles.cardHeaderSubtitle}>Konfigurasi ambang batas sensor dan waktu siklus</p>
              </div>
            </div>

            <div className={styles.inputsRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Batas Jarak Kepadatan (cm)</label>
                <div className={styles.inputWrapper}>
                  <input type="text" className={styles.inputField} placeholder="Contoh: 150" />
                  <span className={styles.inputUnit}>CM</span>
                </div>
                <span className={styles.inputHint}>Jarak minimum kendaraan terdeteksi padat oleh sensor ultrasonik.</span>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Durasi Lampu Hijau Maksimal (detik)</label>
                <div className={styles.inputWrapper}>
                  <input type="text" className={styles.inputField} placeholder="Contoh: 60" />
                  <span className={styles.inputUnit}>DET</span>
                </div>
                <span className={styles.inputHint}>Waktu maksimal fase hijau untuk menghindari antrian panjang di jalur lain.</span>
              </div>
            </div>

            <div className={styles.saveButtonWrapper}>
              <button className={styles.saveButton}>
                Simpan Pengaturan
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className={styles.emergencyCard}>
            <div className={styles.emergencyHeader}>
              <div className={styles.emergencyTitleBox}>
                <div className={styles.emergencyIconBox}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div>
                  <h2 className={styles.emergencyTitle}>Kendali Darurat</h2>
                  <p className={styles.emergencySubtitle}>Otomasi Override Prioritas (Ambulans/Pemadam)</p>
                </div>
              </div>
              <div className={styles.manualBadge}>
                <span className={styles.manualBadgeDot}></span>
                SIAGA KENDALI MANUAL
              </div>
            </div>

            <div className={styles.directionGrid}>
              {/* UTARA */}
              <div className={styles.directionButton}>
                <div className={styles.dirIconWrap}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </div>
                <div className={styles.dirLabel}>Jalur Utara</div>
                <div className={styles.dirAction}>PAKSA HIJAU DARURAT</div>
              </div>

              {/* SELATAN */}
              <div className={styles.directionButton}>
                <div className={styles.dirIconWrap}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>
                <div className={styles.dirLabel}>Jalur Selatan</div>
                <div className={styles.dirAction}>PAKSA HIJAU DARURAT</div>
              </div>

              {/* TIMUR */}
              <div className={styles.directionButton}>
                <div className={styles.dirIconWrap}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
                <div className={styles.dirLabel}>Jalur Timur</div>
                <div className={styles.dirAction}>PAKSA HIJAU DARURAT</div>
              </div>

              {/* BARAT */}
              <div className={styles.directionButton}>
                <div className={styles.dirIconWrap}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </div>
                <div className={styles.dirLabel}>Jalur Barat</div>
                <div className={styles.dirAction}>PAKSA HIJAU DARURAT</div>
              </div>
            </div>

            <div className={styles.warningBanner}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>Peringatan: Menekan tombol paksa hijau akan mereset siklus normal lampu lalu lintas. Gunakan hanya saat kendaraan prioritas terdeteksi atau dalam koordinasi dengan petugas lapangan.</p>
            </div>
          </div>

          <div className={styles.footer}>
            SMARTRAF V2.4.0 — INTEGRATED URBAN TRAFFIC MANAGEMENT
          </div>

        </div>
      </MainLayout>
    </>
  );
}
