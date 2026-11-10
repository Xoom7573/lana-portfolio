import type { ReactNode } from "react";

// The slides' two-tone headline: first line white, second line blush.
export default function SectionHeading({
  lines,
  className = "",
  as: Tag = "h2",
}: {
  lines: [ReactNode, ReactNode?];
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const [first, second] = lines;
  return (
    <Tag className={`headline ${className}`}>
      <span className="block text-white">{first}</span>
      {second && <span className="block text-blush">{second}</span>}
    </Tag>
  );
}
