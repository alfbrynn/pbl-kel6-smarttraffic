import Head from "next/head";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import PrediksiAI from "@/components/dashboard/analitik/PrediksiAI";
import PolaKepadatan from "@/components/dashboard/analitik/PolaKepadatan";
import WaktuTunggu from "@/components/dashboard/analitik/WaktuTunggu";
import StatCards from "@/components/dashboard/analitik/StatCards";

export default function Analitik() {
  return (
    <>
      <Head>
        <title>Analitik – SMARTRAF</title>
      </Head>
      <div className="flex min-h-screen bg-[#f0f4f8] font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title="Pusat Kontrol" />
          <main className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
            <PrediksiAI />
            <PolaKepadatan />
            <div className="flex gap-4">
              <div className="flex-[2]">
                <WaktuTunggu />
              </div>
              <div className="flex-1">
                <StatCards />
              </div>
            </div>
            <div className="text-center text-[10px] text-gray-300 tracking-widest uppercase py-4">
              SMARTRAF V2.4.0 — Integrated Urban Traffic Management
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
