// The admin panel's logo (login screen) and icon (top-left of the nav), in the site's colours:
// blush on bordeaux like the site's menu, so it reads in the admin's light and dark themes.
export function Logo() {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.55em 0.8em 0.4em",
        borderRadius: "0.4rem",
        background: "#5d0e2a",
        color: "#ffd5e5",
        fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
        fontWeight: 900,
        fontSize: "1.9rem",
        lineHeight: 1,
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
      }}
    >
      Lana Libeert<span style={{ color: "#ffffff" }}>.</span>
    </span>
  );
}

export function Icon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icon.svg" alt="" width={24} height={24} style={{ display: "block" }} />;
}
