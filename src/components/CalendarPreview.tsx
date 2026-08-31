export default function CalendarPreview() {
  return (
    <section style={{
      padding: "40px 20px",
      maxWidth: "900px",
      margin: "0 auto"
    }}>
      <h2 style={{
        fontSize: "28px",
        fontWeight: 600,
        marginBottom: "20px",
        textAlign: "center"
      }}>
        Ukážka kalendára
      </h2>

      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
      }}>
        <p style={{ color: "#6f6f80", textAlign: "center" }}>
          Tu bude interaktívny kalendár, kde si zadávateľ nastaví služby,
          prestávky, obedy a dĺžky klientov.
        </p>
      </div>
    </section>
  );
}

