import { cookies } from "next/headers";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import { getGuestsAction, getRsvpAction } from "./actions";
import {
  getSettingsAction,
  getProsesiAction,
  getCoupleAction,
  getLocationsAction,
  getGalleryAction,
  getBanksAction,
} from "./content-actions";

export const metadata = { title: "Admin · Amir & Wardah", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = cookies().get("admin_session");
  if (!session?.value) return <LoginPage />;

  const [guests, rsvps, settings, prosesi, couple, locations, gallery, banks] =
    await Promise.all([
      getGuestsAction(),
      getRsvpAction(),
      getSettingsAction(),
      getProsesiAction(),
      getCoupleAction(),
      getLocationsAction(),
      getGalleryAction(),
      getBanksAction(),
    ]);

  return (
    <AdminDashboard
      initialGuests={guests}
      initialRsvps={rsvps}
      initialSettings={settings}
      initialProsesi={prosesi}
      initialCouple={couple}
      initialLocations={locations}
      initialGallery={gallery}
      initialBanks={banks}
    />
  );
}
