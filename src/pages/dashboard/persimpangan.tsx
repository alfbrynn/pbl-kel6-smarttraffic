import Head from "next/head";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import ProfilLokasi from "@/components/dashboard/ProfilLokasi";
import PengaturanParameter from "@/components/dashboard/PengaturanParameter";
import KendaliDarurat from "@/components/dashboard/KendaliDarurat";

export default function Persimpangan() {
  return (
    <>
      <Head>
        <title>Persimpangan – SMARTRAF</title>
      </Head>

      <div className="flex min-h-screen bg-[#f0f4f8] font-sans">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title="Pusat Kontrol" />

          <main className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
            <ProfilLokasi />
            <PengaturanParameter />
            <KendaliDarurat />

            {/* Footer */}
            <div className="text-center text-[10px] text-gray-300 tracking-widest uppercase py-4">
              SMARTRAF V2.4.0 — Integrated Urban Traffic Management
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
