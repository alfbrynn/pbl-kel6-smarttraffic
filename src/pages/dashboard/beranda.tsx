import Head from "next/head";
import Sidebar from "@/components/layouts/sidebar/Sidebar";
import BerandaContent from "@/components/dashboard/beranda/BerandaContent";

export default function Beranda() {
  return (
    <>
      <Head>
        <title>Beranda – SMARTRAF</title>
      </Head>
      <div className="flex min-h-screen bg-[#f0f4f8] font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
            <BerandaContent />
            <div className="text-center text-[10px] text-gray-300 tracking-widest uppercase py-4">
              SMARTRAF V2.4.0 — Integrated Urban Traffic Management
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
