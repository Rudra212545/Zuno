import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureSection from './components/FeatureSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1c] text-[#e4e4e7] font-[Outfit] overflow-hidden">
      <Navbar />
      <Hero />
      <FeatureSection
        title="Create an Invite-Only Place"
        description="Zuno servers are organized into topic-based channels..."
        image="/assets/invite-only.svg"
      />
      <FeatureSection
        title="Where hanging out is easy"
        description="Voice channels make it easy to chat casually..."
        image="/assets/hangout.svg"
        reverse
      />
      <FeatureSection
        title="Customizable Profiles"
        description="Express yourself with unique avatars, custom statuses, and personal bios to stand out in the community."
        image="/assets/custom-profile.svg"
      />

      <FeatureSection
        title="Integrations & Bots"
        description="Enhance your server with powerful bots and third-party integrations for music, games, and automation."
        image="/assets/integrations.svg"
        reverse
      />
      <Footer />
    </div>
  );
}

export default App;
