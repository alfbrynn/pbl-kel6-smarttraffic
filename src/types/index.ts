export interface JalurDetail {
    status_lampu?: string;
    status_kepadatan?: string;
    jarak_cm?: number;
    sisa_waktu_detik?: number;
    jumlah_kendaraan?: number;
}

export interface DataSimpang {
    status_sistem?: 'OTOMATIS' | 'OVERRIDE' | string;
    active_override_lane?: 'selatan' | 'timur' | 'barat' | 'none' | string;
    jalur?: {
        selatan?: JalurDetail;
        timur?: JalurDetail;
        barat?: JalurDetail;
    };
}
