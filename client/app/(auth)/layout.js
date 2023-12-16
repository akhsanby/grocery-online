export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body>
        <div className="d-flex justify-content-center align-items-center" style={{ width: "100vw", height: "100vh" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
