import BrandsFeature from "@/components/home/Brandsfeature";
import CtaFooter from "@/components/home/Ctafooter";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/Howitworks";
import StatsBar from "@/components/home/Statsbar";
import WhyBlockchain from "@/components/home/Whyblockchain";

export default function Home() {
  return (
     <>
      {/* Global design tokens + shared utility classes */}
      <style>{globalStyles}</style>

      <div style={{ background: "var(--cream)" }}>
        <Hero />
        <StatsBar />
        <div className="section-divider" />
        <BrandsFeature />
        <WhyBlockchain />
        <HowItWorks />
        <CtaFooter />
      </div>
    </>
  );
}


export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=DM+Sans:wght@300;400;500&display=swap');

  /* *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } */

  :root {
    --cream: #F2EDE6;
    --ink: #0E0D0B;
    --ink2: #1C1A17;
    --gold: #B89A6A;
    --gold-light: #D4B896;
    --stone: #8C8378;
    --glass-bg: rgba(242,237,230,0.55);
    --glass-border: rgba(184,154,106,0.25);
    --glass-dark: rgba(14,13,11,0.55);
    --glass-dark-border: rgba(184,154,106,0.2);
  }

  body {
    background: var(--cream);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* ── SHARED BUTTONS ── */
  .btn-primary {
    background: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 100px;
    padding: 14px 30px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.01em;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-arrow {
    width: 20px;
    height: 20px;
    background: rgba(255,255,255,0.12);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
  }

  .btn-ghost {
    background: transparent;
    color: var(--stone);
    border: 1px solid rgba(140,131,120,0.3);
    border-radius: 100px;
    padding: 14px 28px;
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── SHARED DIVIDER ── */
  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(184,154,106,0.3), transparent);
    margin: 0 5vw;
  }
`;