"use client";

export default function TestClientError() {
  return (
    <button onClick={() => { throw new Error("Client 502 test") }}>
      Trigger Error
    </button>
  );
}
