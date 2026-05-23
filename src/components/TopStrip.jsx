export default function TopStrip() {
  const items = [
    'Party Launch / Volume 1, Edition 1',
    'Filed under: General Disgruntlement',
    'Sponsored by no one. Funded by nothing.',
    'HQ: Wherever the wifi works',
    'Now accepting rants, retweets, and resentment',
  ];

  return (
    <div className="top-strip">
      <div className="ticker">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
