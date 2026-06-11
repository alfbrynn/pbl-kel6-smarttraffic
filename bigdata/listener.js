// bigdata/listener.js
// Independent service to handle Big Data ingestion and PySpark analysis triggers
// Runs on the GCP VM: node bigdata/listener.js

const admin = require('firebase-admin');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// 1. DETERMINE PATH TO SERVICE ACCOUNT KEY
let serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
    serviceAccountPath = path.resolve(__dirname, '../bridge/serviceAccountKey.json');
}
if (!fs.existsSync(serviceAccountPath)) {
    serviceAccountPath = path.resolve(__dirname, 'bridge/serviceAccountKey.json');
}

if (!fs.existsSync(serviceAccountPath)) {
    console.error(`❌ Error: File serviceAccountKey.json tidak ditemukan.`);
    process.exit(1);
}

// 2. INITIALIZE FIREBASE ADMIN
admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
});
const db = admin.firestore();
const docRef = db.collection('system').doc('bigdata');

console.log('🚀 Big Data VM Listener has started!');
console.log(`📡 Listening for changes on Firestore document: system/bigdata`);

// 3. LISTEN FOR TRIGGER
docRef.onSnapshot(async (docSnap) => {
    if (!docSnap.exists) {
        // Initialize the document if it doesn't exist
        console.log('ℹ️ Document system/bigdata does not exist. Initializing...');
        await docRef.set({
            status: 'idle',
            error: null,
            results: null,
            triggered_at: null,
            finished_at: null
        });
        return;
    }

    const data = docSnap.data();
    
    // Check if a job has been requested
    if (data.status === 'requested') {
        console.log('\n⚡ [JOB] Analisis HDFS & PySpark diminta oleh Web UI...');
        
        try {
            // Step A: Update status to 'ingesting'
            console.log('🔄 [1/3] Memperbarui status ke "ingesting"...');
            await docRef.update({
                status: 'ingesting',
                error: null
            });

            // Find correct path for ingest.py relative to working directory
            const ingestScriptPath = path.resolve(__dirname, 'ingest.py');
            console.log(`📦 [2/3] Mengeksekusi ingest data: python3 ${ingestScriptPath}`);

            exec(`python3 "${ingestScriptPath}"`, async (ingestErr, ingestStdout, ingestStderr) => {
                if (ingestErr) {
                    console.error('❌ Ingest Error:', ingestErr.message);
                    console.error(ingestStderr);
                    await docRef.update({
                        status: 'failed',
                        error: `Gagal Ingest HDFS: ${ingestErr.message}\n${ingestStderr}`,
                        finished_at: admin.firestore.FieldValue.serverTimestamp()
                    });
                    return;
                }

                console.log('✅ Ingestion berhasil. Output:');
                console.log(ingestStdout);

                // Step B: Update status to 'analyzing'
                console.log('🔄 [3/3] Memperbarui status ke "analyzing"...');
                await docRef.update({
                    status: 'analyzing'
                });

                const analyzeScriptPath = path.resolve(__dirname, 'analyze.py');
                console.log(`📊 Menjalankan analisis PySpark + Groq AI: python3 ${analyzeScriptPath}`);

                exec(`python3 "${analyzeScriptPath}"`, async (analyzeErr, analyzeStdout, analyzeStderr) => {
                    if (analyzeErr) {
                        console.error('❌ Analysis Error:', analyzeErr.message);
                        console.error(analyzeStderr);
                        await docRef.update({
                            status: 'failed',
                            error: `Gagal Analisis Spark: ${analyzeErr.message}\n${analyzeStderr}`,
                            finished_at: admin.firestore.FieldValue.serverTimestamp()
                        });
                        return;
                    }

                    console.log('✅ Analisis Spark & Groq AI Berhasil! Output:');
                    console.log(analyzeStdout);
                    // Note: analyze.py will set status = "completed" and write the results block.
                });
            });
        } catch (error) {
            console.error('❌ Listener Error:', error);
            await docRef.update({
                status: 'failed',
                error: `System Listener Error: ${error.message}`,
                finished_at: admin.firestore.FieldValue.serverTimestamp()
            });
        }
    }
}, (err) => {
    console.error('❌ Firestore Listen Error:', err);
});
