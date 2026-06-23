/**
 * Documentary chapter markers — server data.
 * Ported verbatim from the former `documentary_data.py::get_documentary_timestamps()`.
 * Returned by /api/documentary/timestamps.
 *
 * The frontend's useTimestamps hook prefers film.ts chapters for display, so this
 * endpoint exists purely for parity with the old backend. Output is byte-identical
 * to the former Python response (verified).
 */

export interface ServerTimestampMarker {
  timestamp_seconds: number;
  title: string;
  description: string;
  chapter: string | null;
}

export const TIMESTAMP_MARKERS: ServerTimestampMarker[] = [
  { timestamp_seconds: 0,    title: 'Opening — Paradise on Earth', description: 'Aerial shots of Kashmir Valley. Dal Lake at dawn.',                          chapter: 'Prologue' },
  { timestamp_seconds: 180,  title: 'Ancient Roots',               description: "Kashmir's Hindu and Buddhist heritage. Temples and monasteries.",         chapter: 'Chapter 1: Origins' },
  { timestamp_seconds: 600,  title: 'The Mughal Era',              description: 'Kashmir as the jewel of the Mughal Empire. Gardens of Srinagar.',          chapter: 'Chapter 1: Origins' },
  { timestamp_seconds: 1200, title: 'Colonial Transaction',        description: 'Treaty of Amritsar. Kashmir sold like property.',                          chapter: 'Chapter 2: Empire & Control' },
  { timestamp_seconds: 1800, title: '1947 — The Great Divide',     description: 'Partition, tribal invasion, accession. The wound that never healed.',      chapter: 'Chapter 3: Partition' },
  { timestamp_seconds: 2700, title: 'Decades of Tension',          description: "Wars of '65 and '71. The militarization of daily life.",                   chapter: 'Chapter 4: Conflict' },
  { timestamp_seconds: 3600, title: 'The Insurgency',              description: '1989 onward. Armed rebellion, exodus, and military crackdown.',            chapter: 'Chapter 5: Insurgency' },
  { timestamp_seconds: 4500, title: 'Voices of the People',        description: 'Interviews with Kashmiris — families, students, shopkeepers.',             chapter: 'Chapter 6: Human Stories' },
  { timestamp_seconds: 5100, title: 'Article 370 & After',         description: 'August 5, 2019. Communication blackout. A new political reality.',         chapter: 'Chapter 7: Present Day' },
  { timestamp_seconds: 5400, title: 'Epilogue — What Remains',     description: "Closing reflections. Kashmir's unresolved future.",                        chapter: 'Epilogue' },
];
