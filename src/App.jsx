import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  BellRing,
  Check,
  ChevronRight,
  Flame,
  Handshake,
  Megaphone,
  Menu,
  MessageSquareText,
  Radio,
  Share2,
  ShieldCheck,
  Sparkles,
  Vote,
  X,
  Zap,
} from 'lucide-react';
import { geoMercator, geoPath } from 'd3-geo';
import { heroPosterImg } from './assets/images';

const INDIA_GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/geojson/india.geojson';
const MAP_WIDTH = 560;
const MAP_HEIGHT = 700;

const navItems = [
  ['pulse', 'Pulse'],
  ['agenda', 'Agenda'],
  ['manifesto', 'Manifesto'],
  ['lab', 'Action Lab'],
  ['join', 'Join'],
];

const pulseStats = [
  ['00', 'Corporate donors'],
  ['05', 'Hard demands'],
  ['24/7', 'Online desk'],
  ['2026', 'Launch cycle'],
];

const agendaCards = [
  {
    icon: Vote,
    title: 'Protect every vote',
    text: 'Build a public pressure layer around voter deletion, booth intimidation, and quiet database games.',
    tag: 'Democracy',
  },
  {
    icon: Megaphone,
    title: 'Break media capture',
    text: 'Track ownership, call out paid narratives, and make independent civic explainers shareable.',
    tag: 'Media',
  },
  {
    icon: ShieldCheck,
    title: 'Stop mandate theft',
    text: 'Treat political defection like a public fraud, not a clever career move.',
    tag: 'Accountability',
  },
  {
    icon: Handshake,
    title: '50% representation',
    text: 'Push equal representation for women in Parliament and Cabinet without hiding behind token maths.',
    tag: 'Power',
  },
];

const manifesto = [
  ['01', 'No post-retirement reward seats for Chief Justices.'],
  ['02', 'Deleted legitimate votes should trigger criminal accountability.'],
  ['03', '50% reservation for women and 50% Cabinet representation.'],
  ['04', 'Cancel captured media licences and investigate compromised anchors.'],
  ['05', 'Ban defecting MPs and MLAs from public office for 20 years.'],
];

const labItems = [
  ['Signal Room', 'Daily rapid-response threads, petition drops, and local issue boosts.'],
  ['Meme Desk', 'Satire as distribution: sharp, sourced, and impossible to scroll past.'],
  ['People Ledger', 'A living wall of promises, expenses, betrayals, and receipts.'],
];

const pledgeOptions = [
  'I will fact-check before forwarding.',
  'I will call out deleted votes.',
  'I will support independent media.',
  'I will show up beyond hashtags.',
];

const socialLinks = [
  ['Instagram', 'https://www.instagram.com/cockroachjantaparty/'],
  ['YouTube', 'https://www.youtube.com/'],
  ['X', 'https://x.com/'],
  ['LinkedIn', 'https://www.linkedin.com/'],
];

// ─── Cockroach Cursor ─────────────────────────────────────────────────────────

const REELS = [
  {
    id: 'reel-1',
    href: 'https://www.instagram.com/reel/DYqbQEwEf3W/?igsh=bXhsOXpleGh6eXNv',
    title: 'Janta',
    embed: 'https://www.instagram.com/reel/DYqbQEwEf3W/embed',
    bg: 'linear-gradient(135deg,#7c3aed 0%,#4f1d96 60%,#1e0a3c 100%)',
  },
  {
    id: 'reel-3',
    href: 'https://www.instagram.com/reel/DYnMMMRSCkm/?igsh=MzRndGhvbGsxaGtu',
    title: 'Receipts',
    embed: 'https://www.instagram.com/reel/DYnMMMRSCkm/embed',
    bg: 'linear-gradient(135deg,#6d28d9 0%,#4c1d95 60%,#0f0520 100%)',
  },
  {
    id: 'reel-4',
    href: 'https://www.instagram.com/reel/DYkXbgkM-4M/?igsh=MTVleXp4anRpNTU5cg==',
    title: 'Agenda',
    embed: 'https://www.instagram.com/reel/DYkXbgkM-4M/embed',
    bg: 'linear-gradient(135deg,#5b21b6 0%,#3b0764 60%,#0a0014 100%)',
  },
  {
    id: 'reel-5',
    href: 'https://www.instagram.com/reel/DYhlAcmNgth/?igsh=MTJyMXR5MWE0MTlpeA==',
    title: 'Pulse',
    embed: 'https://www.instagram.com/reel/DYhlAcmNgth/embed',
    bg: 'linear-gradient(135deg,#7e22ce 0%,#4a1d96 55%,#14051f 100%)',
  },
  {
    id: 'reel-6',
    href: 'https://www.instagram.com/reel/DYhn62rvgbt/?igsh=c3A0d2R1cXV4Mjg3',
    title: 'Drop',
    embed: 'https://www.instagram.com/reel/DYhn62rvgbt/embed',
    bg: 'linear-gradient(135deg,#6d28d9 0%,#581c87 55%,#0d0020 100%)',
  },
];



// ─── Hooks ───────────────────────────────────────────────────────────────────

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, next)));
      document.documentElement.style.setProperty('--scroll', `${next.toFixed(2)}`);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return progress;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.2, 0.45, 0.7] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.16 },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Components ──────────────────────────────────────────────────────────────

function BrandMark() {
  return (
    <a href="#top" className="brand" aria-label="Cockroach Janta Party home">
      <span className="brand-mark"><Zap size={18} /></span>
      <span>
        <strong>CJP</strong>
        <small>Gen Z civic signal / Est. 2026</small>
      </span>
    </a>
  );
}

function Nav({ active }) {
  const [open, setOpen] = useState(false);
  const progress = useScrollProgress();
  const close = () => setOpen(false);
  return (
    <header className="site-nav">
      <div className="nav-progress" style={{ '--progress': `${progress}%` }} />
      <div className="nav-shell">
        <BrandMark />
        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} onClick={close}>
              {label}
            </a>
          ))}
          <a href="#join" className="nav-cta" onClick={close}>
            Join signal <ArrowUpRight size={16} />
          </a>
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero genz-hero" id="top">
      <div className="hero-media" aria-hidden="true">
        <img src="/images/cyber_glitch.png" alt="" />
        <div className="scanlines" />
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="signal-pill reveal">
            <Radio size={15} />
            CJP is not a party page. It is a pressure feed.
          </div>
          <h1 className="hero-title">
            <span>Swipe</span>
            <span>Right</span>
            <span>On Rage.</span>
          </h1>
          <p className="hero-lede reveal">
            A Gen Z political startup for the lazy, unemployed, extremely online, and dangerously
            observant. Less podium. More receipts.
          </p>
          <div className="hero-actions reveal">
            <a className="button button-primary" href="#join">
              Build your pledge <ChevronRight size={18} />
            </a>
            <a className="button button-ghost" href="#agenda">
              Explore agenda <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="hero-orbit reveal">
          <div className="poster-card reel-card">
            <img
              src="/images/cockroach.png"
              alt="Futuristic campaign visual"
              onError={(event) => { event.currentTarget.src = heroPosterImg; }}
            />
            <div className="poster-meta">
              <span>Drop 001</span>
              <strong>Lazy is a labour policy issue</strong>
            </div>
          </div>
          <div className="floating-card card-a"><Flame size={15} /> trending: voter rights</div>
          <div className="floating-card card-b"><Share2 size={15} /> shareable manifesto</div>
          <div className="floating-card card-c"><BellRing size={15} /> receipts mode on</div>
        </div>
      </div>
    </section>
  );
}

function Pulse() {
  return (
    <section className="pulse-wall" id="pulse">
      <div className="pulse-copy reveal">
        <div className="section-kicker">Live pulse</div>
        <h2>Politics that behaves like your feed.</h2>
      </div>
      <div className="pulse-grid">
        {pulseStats.map(([value, label], index) => (
          <div className="pulse-tile reveal" style={{ '--delay': `${index * 70}ms` }} key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    'Receipts over speeches',
    'No corporate remote control',
    'Fact-check the powerful',
    'Democracy needs push notifications',
  ];
  return (
    <div className="marquee" aria-label="Campaign principles">
      <div className="marquee-track">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function Agenda() {
  return (
    <section className="section agenda-section" id="agenda">
      <div className="section-head reveal">
        <div>
          <div className="section-kicker">Issue stack</div>
          <h2>Policy, but make it scannable.</h2>
        </div>
        <p>
          The old politics page gives you walls of text. This one turns the fight into modules
          people can understand, remix, and actually use.
        </p>
      </div>
      <div className="agenda-grid">
        {agendaCards.map(({ icon: Icon, title, text, tag }, index) => (
          <article className="agenda-card reveal" style={{ '--delay': `${index * 80}ms` }} key={title}>
            <div className="agenda-icon"><Icon size={22} /></div>
            <span>{tag}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Vision() {
  return (
    <section className="section system vision-remix" id="lab">
      <div className="system-visual reveal">
        <video
          src="/assets/video/cock_video.mp4"
          poster="/images/cyber_cockroach.png"
          aria-label="Cyberpunk Cockroach Janta Party visual"
          autoPlay loop muted playsInline
        />
      </div>
      <div className="system-copy reveal">
        <div className="section-kicker">Action Lab</div>
        <h2>Not a rally. A civic product lab.</h2>
        <p>
          CJP turns political frustration into formats that travel: dashboards, meme briefs,
          explainers, petition raids, local issue cards, and share kits.
        </p>
        <div className="lab-list">
          {labItems.map(([title, text]) => (
            <div className="lab-row" key={title}>
              <BadgeCheck size={18} />
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="section manifesto" id="manifesto">
      <div className="section-kicker reveal">Manifesto stack</div>
      <div className="section-head reveal">
        <h2>Five demands. Screenshot friendly.</h2>
        <p>Same political core, rebuilt as a scrollable stack instead of a lecture.</p>
      </div>
      <div className="manifesto-stack">
        {manifesto.map(([num, text], index) => (
          <article className="manifesto-card reveal" style={{ '--delay': `${index * 75}ms` }} key={num}>
            <span>{num}</span>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Join() {
  const [selected, setSelected] = useState(new Set([pledgeOptions[0]]));
  const toggle = (option) => {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  };
  const pledgeScore = Math.round((selected.size / pledgeOptions.length) * 100);
  return (
    <section className="section join" id="join">
      <div className="join-panel pledge-panel reveal">
        <div>
          <div className="section-kicker">Join flow</div>
          <h2>Build your mini pledge.</h2>
          <p>
            Tap what you are ready to do. No fake form drama, just a small public operating system
            for better political habits.
          </p>
          <div className="pledge-meter" aria-label={`${pledgeScore}% pledge complete`}>
            <span style={{ width: `${pledgeScore}%` }} />
          </div>
          <strong className="pledge-score">{pledgeScore}% signal strength</strong>
        </div>
        <div className="checks">
          {pledgeOptions.map((option) => (
            <button
              type="button"
              className={selected.has(option) ? 'check is-selected' : 'check'}
              key={option}
              onClick={() => toggle(option)}
            >
              <span>{selected.has(option) ? <Check size={16} /> : <ShieldCheck size={16} />}</span>
              {option}
            </button>
          ))}
        </div>
        <a className="button button-primary join-button" href="mailto:contact@cockroachjantaparty.org">
          Send the signal <MessageSquareText size={18} />
        </a>
      </div>
    </section>
  );
}

// ─── Instagram Embed ──────────────────────────────────────────────────────────

function InstagramEmbed() {
  return (
    <section
      className="instagram-section"
      id="instagram"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2.25rem',
        padding: '3.75rem 1rem 3.5rem',
        width: '100%',
        overflow: 'hidden',
        background: '#ffffff',
      }}
    >
      <style>{`
        .instagram-refresh {
          align-items: center;
          background: rgba(255,255,255,0.82);
          border: 2px solid #19b98a;
          border-radius: 999px;
          box-shadow: 0 10px 24px rgba(17,154,114,0.13);
          color: #119a72;
          display: inline-flex;
          font-size: 0.82rem;
          font-weight: 800;
          gap: 0.55rem;
          justify-content: center;
          min-width: 12.5rem;
          padding: 0.7rem 1.4rem;
          text-decoration: none;
        }
        .instagram-refresh span {
          width: 0.48rem;
          height: 0.48rem;
          border-radius: 999px;
          background: currentColor;
        }
        .instagram-copy {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 34rem;
          padding: 0 1rem;
          text-align: center;
          width: 100%;
        }
        .reels-rail {
          display: grid;
          grid-auto-columns: clamp(17rem, 31vw, 22.5rem);
          grid-auto-flow: column;
          gap: clamp(1rem, 2vw, 1.5rem);
          max-width: var(--content, 1120px);
          overflow-x: auto;
          overscroll-behavior-x: contain;
          padding: 0.15rem;
          scroll-padding-inline: 0.15rem;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          width: min(100%, var(--content, 1120px));
        }
        .reels-rail::-webkit-scrollbar {
          display: none;
        }
        .reel-link {
          aspect-ratio: 9 / 16;
          border-radius: 0.8rem;
          box-shadow: 0 22px 50px rgba(31,12,64,0.18);
          color: #fff;
          display: block;
          overflow: hidden;
          position: relative;
          scroll-snap-align: start;
          text-decoration: none;
        }
        .reel-frame {
          background: #fff;
          border: 0;
          height: 100%;
          inset: 0;
          position: absolute;
          width: 100%;
          z-index: 1;
        }
        .reel-badge {
          align-items: center;
          background: #dc3f78;
          border-radius: 999px;
          display: inline-flex;
          font-size: 0.72rem;
          font-weight: 900;
          gap: 0.35rem;
          letter-spacing: 0.04em;
          padding: 0.45rem 0.72rem;
          position: absolute;
          right: 1rem;
          top: 1rem;
          z-index: 3;
        }
        .reel-badge span,
        .reel-badge span {
          width: 0;
          height: 0;
          border-bottom: 0.32rem solid transparent;
          border-left: 0.48rem solid #fff;
          border-top: 0.32rem solid transparent;
        }
        @media (max-width: 620px) {
          .instagram-section {
            gap: 1.5rem !important;
            padding: 2.75rem 0.75rem 2.5rem !important;
          }
          .instagram-copy h2 {
            font-size: 1.45rem !important;
            line-height: 1.1;
          }
          .instagram-copy p {
            font-size: 0.92rem;
            line-height: 1.5;
          }
          .reels-rail {
            grid-auto-columns: minmax(16rem, 86vw);
            max-width: 100%;
          }
          .reel-link {
            border-radius: 0.6rem;
          }
          .reel-badge {
            right: 0.65rem;
            top: 0.65rem;
          }
        }
      `}</style>

      <a className="instagram-refresh" href="https://www.instagram.com/cockroachjantaparty/" target="_blank" rel="noreferrer">
        <span /> Refresh Posts
      </a>

      <div className="instagram-copy">
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6 }}>
          Follow the signal
        </div>
      </div>
      <div className="reels-rail" aria-label="Instagram reels">
        {REELS.map((reel) => (
          <article
            className="reel-link"
            key={reel.id}
            style={{ background: reel.bg }}
          >
            <iframe
              className="reel-frame"
              src={reel.embed}
              title={`${reel.title} Instagram reel`}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── India Map ────────────────────────────────────────────────────────────────

function RoachIcon() {
  return (
    <svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }}>
      <defs>
        <radialGradient id="wlm" cx="40%" cy="45%" r="58%">
          <stop offset="0%" stopColor="#7A3C12" />
          <stop offset="100%" stopColor="#3A1A06" />
        </radialGradient>
        <radialGradient id="wrm" cx="60%" cy="45%" r="58%">
          <stop offset="0%" stopColor="#7A3C12" />
          <stop offset="100%" stopColor="#3A1A06" />
        </radialGradient>
        <radialGradient id="pgm" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#7A3A10" />
          <stop offset="100%" stopColor="#2E1205" />
        </radialGradient>
        <radialGradient id="hgm" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#9B5523" />
          <stop offset="100%" stopColor="#3A1A06" />
        </radialGradient>
      </defs>
      <g transform="translate(50,110)">
        <line x1="-16" y1="60" x2="-40" y2="80" stroke="#3A1A06" strokeWidth="3" strokeLinecap="round" />
        <line x1="-40" y1="80" x2="-68" y2="105" stroke="#3A1A06" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="16" y1="60" x2="40" y2="80" stroke="#3A1A06" strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="80" x2="68" y2="105" stroke="#3A1A06" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="-18" y1="18" x2="-50" y2="38" stroke="#3A1A06" strokeWidth="3" strokeLinecap="round" />
        <line x1="-50" y1="38" x2="-82" y2="46" stroke="#3A1A06" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="18" y1="18" x2="50" y2="38" stroke="#3A1A06" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="38" x2="82" y2="46" stroke="#3A1A06" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="-14" y1="-36" x2="-42" y2="-55" stroke="#3A1A06" strokeWidth="3" strokeLinecap="round" />
        <line x1="-42" y1="-55" x2="-70" y2="-62" stroke="#3A1A06" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="14" y1="-36" x2="42" y2="-55" stroke="#3A1A06" strokeWidth="3" strokeLinecap="round" />
        <line x1="42" y1="-55" x2="70" y2="-62" stroke="#3A1A06" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="-8" cy="18" rx="12" ry="72" fill="url(#wlm)" transform="rotate(-4,-8,18)" />
        <ellipse cx="8" cy="18" rx="12" ry="72" fill="url(#wrm)" transform="rotate(4,8,18)" />
        <line x1="0" y1="-46" x2="0" y2="86" stroke="#1A0800" strokeWidth="1" opacity="0.7" />
        <ellipse cx="0" cy="-50" rx="18" ry="14" fill="url(#pgm)" />
        <ellipse cx="0" cy="-68" rx="10" ry="9" fill="url(#hgm)" />
        <path d="M-5 -75 C-12 -90 -26 -108 -44 -120" stroke="#2E1205" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M5 -75 C12 -90 26 -108 44 -120" stroke="#2E1205" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <ellipse cx="-6" cy="-72" rx="2.5" ry="2" fill="#0D0400" />
        <ellipse cx="6" cy="-72" rx="2.5" ry="2" fill="#0D0400" />
      </g>
    </svg>
  );
}

function RoachOverlay({ point }) {
  if (!point) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: `${(point[1] / MAP_HEIGHT) * 100}%`,
        left: `${(point[0] / MAP_WIDTH) * 100}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 10,
        animation: 'roachPop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}
    >
      <div style={{ animation: 'roachWiggle 2.2s ease-in-out infinite' }}>
        <RoachIcon />
      </div>
    </div>
  );
}

function IndiaMapSection() {
  const [clicked, setClicked] = useState(new Set());
  const [tooltip, setTooltip] = useState(null);
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(INDIA_GEOJSON_URL)
      .then((response) => {
        if (!response.ok) throw new Error('India map data failed to load');
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setMapData(data);
      })
      .catch(() => {
        if (!cancelled) setMapData({ type: 'FeatureCollection', features: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { features, path, stateNames, stateCenters } = useMemo(() => {
    const mapFeatures = mapData?.features || [];
    if (!mapFeatures.length) {
      return { features: [], path: null, stateNames: [], stateCenters: new Map() };
    }

    const projection = geoMercator().fitExtent(
      [[22, 16], [MAP_WIDTH - 22, MAP_HEIGHT - 16]],
      mapData,
    );
    const nextPath = geoPath(projection);
    const names = [...new Set(mapFeatures.map((feature) => feature.properties?.st_nm).filter(Boolean))].sort();
    const centerTotals = new Map();

    mapFeatures.forEach((feature) => {
      const name = feature.properties?.st_nm;
      const centroid = nextPath.centroid(feature);
      if (!name || !Number.isFinite(centroid[0]) || !Number.isFinite(centroid[1])) return;
      const current = centerTotals.get(name) || { x: 0, y: 0, count: 0 };
      current.x += centroid[0];
      current.y += centroid[1];
      current.count += 1;
      centerTotals.set(name, current);
    });

    const centers = new Map(
      [...centerTotals.entries()].map(([name, value]) => [
        name,
        [value.x / value.count, value.y / value.count],
      ]),
    );

    return { features: mapFeatures, path: nextPath, stateNames: names, stateCenters: centers };
  }, [mapData]);

  const total = stateNames.length || 36;
  const infested = clicked.size;

  const handleClick = (name) => {
    if (!name) return;
    setClicked((prev) => {
      const next = new Set(prev);
      next.add(name);
      return next;
    });
  };

  return (
    <section
      className="india-map-section"
      style={{
        padding: '4rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes roachPop {
          0%   { transform: scale(0) rotate(-180deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes roachWiggle {
          0%, 100% { transform: scale(1) rotate(-5deg); }
          50%       { transform: scale(1.15) rotate(5deg); }
        }
        .india-map-svg {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 22px 34px rgba(249,115,22,0.16));
        }
        .map-district {
          fill: rgba(101,67,33,0.2);
          stroke: rgba(62,39,20,0.42);
          stroke-width: 0.45;
          cursor: pointer;
          transition: fill 0.18s ease, stroke 0.18s ease;
        }
        .map-district:hover,
        .map-district:focus-visible {
          fill: rgba(92,55,28,0.58);
          stroke: rgba(43,25,13,0.9);
          stroke-width: 0.9;
          outline: none;
        }
        .map-district.is-clicked {
          fill: rgba(74,44,23,0.82);
          stroke: rgba(30,18,10,0.86);
        }
        .map-loading {
          align-items: center;
          color: rgba(62,39,20,0.72);
          display: flex;
          font-size: 0.82rem;
          font-weight: 700;
          height: 32rem;
          justify-content: center;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .india-map-head {
          text-align: center;
        }
        .india-map-title {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
        }
        .india-map-progress {
          width: 100%;
          max-width: 480px;
          height: 6px;
          border-radius: 99px;
          background: rgba(62,39,20,0.1);
          overflow: hidden;
        }
        .india-map-wrap {
          width: 100%;
          max-width: 560px;
          position: relative;
        }
        @media (max-width: 760px) {
          .india-map-section {
            padding: 3rem 1rem !important;
            gap: 1.5rem !important;
          }
          .india-map-title {
            font-size: clamp(1.5rem, 7vw, 2rem);
            line-height: 1.08;
          }
          .india-map-wrap {
            max-width: min(100%, 440px);
          }
          .map-loading {
            height: 24rem;
          }
        }
        @media (max-width: 460px) {
          .india-map-section {
            padding: 2.5rem 0.75rem !important;
          }
          .india-map-wrap {
            max-width: 100%;
          }
          .map-loading {
            height: 19rem;
          }
        }
      `}</style>

      {/* Header */}
      <div className="india-map-head">
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.5rem' }}>
          Infestation map
        </div>
        <h2 className="india-map-title">
          Click a state. Release the roach.
        </h2>
        <p style={{ opacity: 0.6, marginTop: '0.5rem', fontSize: '0.95rem' }}>
          {infested} of {total} states infested with civic signal.
        </p>
      </div>

      {/* Progress bar */}
      <div className="india-map-progress">
        <div style={{
          height: '100%',
          width: `${(infested / total) * 100}%`,
          background: 'linear-gradient(90deg, #8b5a2b, #3e2714)',
          borderRadius: 99,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Map */}
      <div className="india-map-wrap">
        {!path && <div className="map-loading">Loading India map</div>}

        {path && (
          <svg
            className="india-map-svg"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            role="img"
            aria-label="India outline map with clickable states and union territories"
          >
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="rgba(255,255,255,0.02)" />
            {features.map((feature, index) => {
              const name = feature.properties?.st_nm || feature.properties?.district || 'India';
              const isClicked = clicked.has(name);
              return (
                <path
                  key={`${name}-${feature.properties?.district || index}`}
                  d={path(feature) || ''}
                  className={`map-district ${isClicked ? 'is-clicked' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${name}${isClicked ? ' infested' : ''}`}
                  onClick={() => handleClick(name)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleClick(name);
                    }
                  }}
                  onMouseEnter={(event) => setTooltip({ name, x: event.clientX, y: event.clientY })}
                  onMouseMove={(event) => setTooltip({ name, x: event.clientX, y: event.clientY })}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setTooltip({ name, x: rect.left + rect.width / 2, y: rect.top });
                  }}
                  onBlur={() => setTooltip(null)}
                />
              );
            })}
          </svg>
        )}

        {/* Roach overlays */}
        {[...clicked].map((name) => (
          <RoachOverlay key={name} point={stateCenters.get(name)} />
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 12,
          top: tooltip.y - 32,
          background: 'rgba(0,0,0,0.88)',
          color: '#fff',
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          pointerEvents: 'none',
          zIndex: 9999,
          whiteSpace: 'nowrap',
        }}>
          {tooltip.name} {clicked.has(tooltip.name) ? '🪳 infested' : '— click to infest'}
        </div>
      )}

      {/* Reset */}
      {infested > 0 && (
        <button
          type="button"
          onClick={() => setClicked(new Set())}
          style={{
            background: 'transparent',
            border: '1px solid rgba(62,39,20,0.5)',
            color: '#3e2714',
            padding: '0.5rem 1.5rem',
            borderRadius: 99,
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          Clear infestation 🪳
        </button>
      )}
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <BrandMark />
          <p>Cockroach Janta Party, rebuilt as a Gen Z civic interface.</p>
        </div>
        <div className="footer-social" aria-label="Social media links">
          {socialLinks.map(([label, href]) => (
            <a href={href} key={label} target="_blank" rel="noreferrer">
              {label} <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
        <a className="footer-top" href="#top">Back to top <ArrowUpRight size={16} /></a>
      </div>
      <div className="footer-powered">Powered by Techvaseegrah</div>
    </footer>
  );
}

// ─── App Entry ───────────────────────────────────────────────────────────────

export default function App() {
  const sectionIds = useMemo(() => navItems.map(([id]) => id), []);
  const active = useActiveSection(sectionIds);
  useReveal();

  return (
    <div className="app">
      <Nav active={active} />
      <main>
        <Hero />
        <Pulse />
        <Marquee />
        <Agenda />
        <InstagramEmbed />
        <Manifesto />
        <Vision />
      </main>
      <IndiaMapSection />
      <Join />
      <Footer />
      <div className="noise" aria-hidden="true" />
    </div>
  );
}
