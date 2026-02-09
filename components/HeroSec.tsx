'use client';

import LiquidEther from '@/components/reactBits/hero-sec';
import Link from 'next/link';

function HeroSec() {
    return (
        <div className="relative h-screen w-full overflow-hidden -mt-20">

            {/* 🔹 Background Liquid Effect */}
            <div className="absolute inset-0 z-0">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>

            {/* 🔹 Hero Content (ON TOP) */}
            <div className="absolute top-1/2 left-1/2 z-10 grid place-items-center px-4 text-zinc-800 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center text-center">
                    <span className="mb-3 rounded-full bg-black/50 px-5 py-2 text-xs tracking-widest uppercase text-zinc-200 backdrop-blur">
                        Immutable Proof of Authenticity
                    </span>

                    <h1 className="max-w-5xl text-white bg-clip-text text-[30px]  font-semibold leading-[1.1] text-transparent sm:text-6xl md:text-7xl">
                        Authenticity,
                        {/* <br className="hidden sm:block" /> */}
                        Permanently Recorded.
                    </h1>

                    <p className="my-8 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
                        Phygital establishes an immutable digital provenance for physical products.
                        Each item is cryptographically verified, recorded on the blockchain,
                        and accessible through a single scan — eliminating counterfeits at the source.
                    </p>
                    <Link href='/scanQr'>
                        <button className="mt-6 cursor-pointer rounded-full bg-black/60 px-8 py-3 text-sm font-medium uppercase tracking-wide text-white backdrop-blur transition hover:bg-black/80">
                            Verify Authenticity
                        </button>
                    </Link>

                </div>
            </div>

        </div>
    );
}

export default HeroSec;