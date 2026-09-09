import "./globals.css";

export const metadata = {
  title: "Reservio – Rezervačný systém",
  description: "Univerzálny rezervačný systém pre každého"
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  );
}
