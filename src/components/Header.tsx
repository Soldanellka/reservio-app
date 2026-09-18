export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "16px 24px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}
    >
      <div className="logo" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
        RESERVIO
      </div>
      <nav className="nav" style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
        <a href="/app.html#/rezervacia">Rezervovať termín</a>
        <a href="/app.html#/admin">Pre zadávateľa</a>
      </nav>
    </header>
  );
}
