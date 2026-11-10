export default function Marquee({ words }: { words: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {words.map((word) => (
        <li key={word} className="flex items-center">
          <span className="headline px-6 text-3xl md:px-10 md:text-5xl">{word}</span>
          <span className="text-xl text-maroon/50 md:text-3xl">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative z-10 -mx-[5vw] -rotate-[1.5deg] overflow-hidden bg-blush py-4 text-maroon shadow-[0_20px_50px_-20px_rgb(0_0_0/0.5)] md:py-6">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
