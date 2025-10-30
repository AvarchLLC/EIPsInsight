// Re-export the closeable, session-aware EtherWorld ad implementation.
// This ensures every existing import of `EtherWorldAdCard` renders the
// `CloseableAdCard` without changing all import sites.

import CloseableAdCard from "./CloseableAdCard";

export default CloseableAdCard;
