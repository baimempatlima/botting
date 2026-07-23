"use client";

import { useState, useTransition, useCallback } from "react";
import { logoutAction, getGuestsAction, getRsvpAction } from "../actions";
import {
  getSettingsAction,
  getProsesiAction,
  getCoupleAction,
  getLocationsAction,
  getGalleryAction,
  getBanksAction,
} from "../content-actions";
import type { Guest, RsvpEntry } from "@/lib/supabase";
import type {
  Prosesi,
  CoupleProfileData,
  EventLocation,
  GalleryPhoto,
  BankAccount,
} from "@/lib/types";
import GuestsTab from "./GuestsTab";
import RsvpTab from "./RsvpTab";
import ImportTab from "./ImportTab";
import SettingsTab from "./SettingsTab";
import ContentTab from "./ContentTab";

interface Props {
  initialGuests: Guest[];
  initialRsvps: RsvpEntry[];
  initialSettings: Record<string, string>;
  initialProsesi: Prosesi[];
  initialCouple: CoupleProfileData[];
  initialLocations: EventLocation[];
  initialGallery: GalleryPhoto[];
  initialBanks: BankAccount[];
}

type Tab = "settings" | "tamu" | "rsvp" | "import" | "konten";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "settings", label: "Pengaturan", icon: "⚙️" },
  { id: "konten", label: "Konten", icon: "📝" },
  { id: "tamu", label: "Daftar Tamu", icon: "👥" },
  { id: "rsvp", label: "Status RSVP", icon: "📋" },
  { id: "import", label: "Import CSV", icon: "📤" },
];

export default function AdminDashboard(props: Props) {
  const [tab, setTab] = useState<Tab>("settings");
  const [guests, setGuests] = useState(props.initialGuests);
  const [rsvps, setRsvps] = useState(props.initialRsvps);
  const [settings, setSettings] = useState(props.initialSettings);
  const [prosesi, setProsesi] = useState(props.initialProsesi);
  const [couple, setCouple] = useState(props.initialCouple);
  const [locations, setLocations] = useState(props.initialLocations);
  const [gallery, setGallery] = useState(props.initialGallery);
  const [banks, setBanks] = useState(props.initialBanks);
  const [refreshing, setRefreshing] = useState(false);
  const [, startLogout] = useTransition();

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const [g, r, s, p, c, l, gl, b] = await Promise.all([
      getGuestsAction(),
      getRsvpAction(),
      getSettingsAction(),
      getProsesiAction(),
      getCoupleAction(),
      getLocationsAction(),
      getGalleryAction(),
      getBanksAction(),
    ]);
    setGuests(g);
    setRsvps(r);
    setSettings(s);
    setProsesi(p);
    setCouple(c);
    setLocations(l);
    setGallery(gl);
    setBanks(b);
    setRefreshing(false);
  }, []);

  const handleLogout = () =>
    startLogout(async () => {
      await logoutAction();
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bugis-maroon to-bugis-gold flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L22 12L12 22L2 12Z" />
              </svg>
            </div>
            <div>
              <p className="font-playfair text-base text-bugis-maroon leading-none">
                Dashboard Admin
              </p>
              <p className="font-poppins text-[10px] text-gray-400">
                Amir &amp; Wardah · Wedding Manager
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={refreshing}
              className="p-2 rounded-lg text-gray-400 hover:text-bugis-maroon hover:bg-gray-100 transition-colors"
              title="Refresh data"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              >
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="font-poppins text-xs px-4 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-white rounded-2xl p-1.5 border border-bugis-gold/15 shadow-sm mb-8 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-poppins text-sm font-medium transition-all
                ${
                  tab === t.id
                    ? "bg-bugis-maroon text-white shadow-sm"
                    : "text-gray-500 hover:text-bugis-maroon hover:bg-gray-50"
                }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "settings" && (
          <SettingsTab initial={settings} onRefresh={refresh} />
        )}
        {tab === "konten" && (
          <ContentTab
            prosesi={prosesi}
            couple={couple}
            locations={locations}
            gallery={gallery}
            banks={banks}
            onRefresh={refresh}
          />
        )}
        {tab === "tamu" && (
          <GuestsTab guests={guests} settings={settings} onRefresh={refresh} />
        )}
        {tab === "rsvp" && <RsvpTab rsvps={rsvps} />}
        {tab === "import" && <ImportTab onRefresh={refresh} />}
      </div>
    </div>
  );
}
