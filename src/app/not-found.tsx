"use client";
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '7rem', fontWeight: 700, margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 600, margin: '1.2rem 0' }}>
        Oops! Page Not Found
      </h2>
      <p style={{ fontSize: '1.3rem', maxWidth: 500 }}>
        The page you were looking for doesn't exist. It might have been moved, or the link may be broken.
      </p>
      <a
        href="/"
        style={{
          marginTop: '2.5rem',
          padding: '1rem 2.5rem',
          background: '#fff',
          color: '#764ba2',
          borderRadius: '25px',
          fontWeight: 700,
          fontSize: '1.3rem',
          textDecoration: 'none',
        }}
      >
        Go Home
      </a>
      <div style={{ fontSize: '5rem', marginTop: '2.5rem' }}>🚀</div>
    </div>
  );
}
