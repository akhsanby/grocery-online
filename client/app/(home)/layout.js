import Navbar from "./components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css"></link>
      </head>
      <body>
        <div style={{ width: "100vw" }}>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
