"use client";

import { useState } from "react";

export default function ProfilePhoto() {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`profile-photo ${loaded ? "is-loaded" : ""}`} aria-label="Sam Joor profile photo">
      {!failed ? (
        <img
          src="/sam-profile.png"
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
      <span aria-hidden="true">SJ</span>
    </div>
  );
}
