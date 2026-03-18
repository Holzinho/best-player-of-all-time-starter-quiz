export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Best Player of All Time Quiz</h1>
      <p>Willkommen! Die App läuft erfolgreich.</p>
      <p>
        <small>
          App URL: {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
        </small>
      </p>
    </main>
  );
}
