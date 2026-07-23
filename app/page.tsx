import Cover from './components/Cover';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import CoupleProfile from './components/CoupleProfile';
import StoryTimeline from './components/StoryTimeline';
import LocationSection from './components/LocationSection';
import Gallery from './components/Gallery';
import RSVPForm from './components/RSVPForm';
import Footer from './components/Footer';
import OrnamentDivider from './components/OrnamentDivider';
import DigitalEnvelope from './components/DigitalEnvelope';
import { fetchWeddingData } from '@/lib/fetch-wedding';

export const revalidate = 60; // ISR: refresh data setiap 60 detik

export default async function Home() {
  const data = await fetchWeddingData();

  return (
    <main className="min-h-screen bg-bugis-cream selection:bg-bugis-maroon selection:text-white">
      <Cover groomName={data.settings.groom_name} brideName={data.settings.bride_name} weddingDate={data.settings.wedding_date} />
      <Hero groomName={data.settings.groom_name} brideName={data.settings.bride_name} />

      <Countdown weddingDate={data.settings.wedding_date} />
      <OrnamentDivider />
      <CoupleProfile data={data.couple} />
      <OrnamentDivider />
      <StoryTimeline data={data.prosesi} />
      <OrnamentDivider />
      <LocationSection data={data.locations} groomName={data.settings.groom_name} brideName={data.settings.bride_name} />
      <OrnamentDivider />
      <Gallery data={data.gallery} />
      <OrnamentDivider />
      <DigitalEnvelope data={data.banks} />
      <OrnamentDivider />
      <RSVPForm />
      <Footer groomName={data.settings.groom_name} brideName={data.settings.bride_name} />
    </main>
  );
}
