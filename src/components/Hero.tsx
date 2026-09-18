export default function Hero() {
  return (
    <section
      style={{
        padding: "60px 20px",
        textAlign: "center",
        maxWidth: "900px",
        margin: "0 auto"
      }}
    >
      <h1 style={{ fontSize: "42px", fontWeight: 700, marginBottom: "20px" }}>
        Rezervačný systém pre každého
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "#6f6f80",
          marginBottom: "30px",
          lineHeight: "1.6"
        }}
      >
        Jednoduché rezervácie pre salóny, trénerov, školy, kliniky a všetkých,
        ktorí potrebujú prehľadný kalendár.
      </p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <a className="btn-primary" href="/app.html#/admin" style={{ textDecoration: "none", display: "inline-block" }}>
          Začať ako zadávateľ
        </a>
        <a className="btn-secondary" href="/app.html#/rezervacia" style={{ textDecoration: "none", display: "inline-block" }}>
          Rezervovať ako klient
        </a>
      </div>
    </section>
  );
}
