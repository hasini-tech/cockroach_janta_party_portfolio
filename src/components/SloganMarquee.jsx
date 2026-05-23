import { Fragment } from 'react';

export default function SloganMarquee() {
  const slogans = [
    'Together We Survive',
    'Stronger Together',
    'Unity / Resilience / Progress',
    'You Cannot Squash A Movement',
  ];

  return (
    <div className="marquee" aria-label="Campaign slogans">
      <div className="marquee-track">
        {[...slogans, ...slogans].map((slogan, index) => (
          <Fragment key={`${slogan}-${index}`}>
            <span>{slogan}</span>
            <span className="dot">+</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
