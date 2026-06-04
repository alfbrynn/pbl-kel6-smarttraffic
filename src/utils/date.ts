/**
 * Memformat timestamp Firebase atau milliseconds/string ke representasi tanggal lokal (id-ID)
 */
export function formatToDateTime(waktu: any): string {
    if (!waktu) return "";
    
    // Jika format milidetik/timestamp angka
    if (typeof waktu === 'number') {
        return new Date(waktu).toLocaleString('id-ID');
    }
    
    // Jika class Timestamp dari Firestore
    if (typeof waktu.toDate === 'function') {
        return waktu.toDate().toLocaleString('id-ID');
    }
    
    // Jika objek timestamp mentah (seconds/nanoseconds)
    if (waktu.seconds) {
        return new Date(waktu.seconds * 1000).toLocaleString('id-ID');
    }
    
    return String(waktu);
}

/**
 * Memformat timestamp ke representasi waktu jam lokal (id-ID)
 */
export function formatToTimeOnly(waktu: any): string {
    if (!waktu) return "";
    
    let dateObj: Date;
    
    if (typeof waktu === 'number') {
        dateObj = new Date(waktu);
    } else if (typeof waktu.toDate === 'function') {
        dateObj = waktu.toDate();
    } else if (waktu.seconds) {
        dateObj = new Date(waktu.seconds * 1000);
    } else if (typeof waktu === 'string') {
        if (waktu.includes('at')) {
            return waktu.split('at')[1].trim();
        }
        return waktu;
    } else {
        return String(waktu);
    }
    
    return dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
