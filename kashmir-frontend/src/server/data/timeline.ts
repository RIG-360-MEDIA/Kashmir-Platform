/**
 * Kashmir history timeline — server data.
 * Returned as-is by /api/documentary/timeline.
 */

export interface TimelineDoc {
  kind: string;
  name: string;
  date: string;
  desc: string;
  source: string;
  url: string;
}

export interface ServerTimelineEvent {
  year: number;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  lat: number | null;
  lng: number | null;
  place: string | null;
  doc?: TimelineDoc;
}

export const TIMELINE_EVENTS: ServerTimelineEvent[] = [
  {
    year: 1339, title: 'Shah Mir Dynasty Founded', category: 'cultural',
    description: 'Shah Mir establishes the first Muslim dynasty in Kashmir, marking a cultural shift in the region.',
    image_url: null, lat: 34.08, lng: 74.79, place: 'Srinagar',
  },
  {
    year: 1586, title: 'Mughal Conquest', category: 'cultural',
    description: 'Emperor Akbar annexes Kashmir into the Mughal Empire. The region becomes a prized summer retreat — the Shalimar and Nishat Bagh gardens are built. Beauty becomes an instrument of empire.',
    image_url: null, lat: 34.09, lng: 74.80, place: 'Srinagar',
  },
  {
    year: 1819, title: 'Sikh Rule Begins', category: 'political',
    description: "Ranjit Singh's forces conquer Kashmir from the Afghans, beginning Sikh governance over the valley.",
    image_url: null, lat: 34.08, lng: 74.78, place: 'Kashmir Valley',
  },
  {
    year: 1846, title: 'Treaty of Amritsar — Kashmir Is Sold', category: 'political',
    description: 'After defeating the Sikhs, the British sell Kashmir and its people to Dogra ruler Gulab Singh for 75 lakh Nanakshahi rupees. A people traded like property. The Dogra dynasty begins its century of rule. Kashmiris are never asked.',
    image_url: null, lat: 32.73, lng: 74.87, place: 'Jammu',
    doc: {
      kind: 'Foundational Treaty',
      name: 'Treaty of Amritsar (1846)',
      date: '16 March 1846',
      desc: "The 'sale deed' of Kashmir. Ten articles transferred all the hilly territory east of the Indus and west of the Ravi to Gulab Singh and his heirs in independent possession, under British suzerainty, for 7.5 million rupees.",
      source: 'Wikisource',
      url: 'https://en.wikisource.org/wiki/Treaty_of_Amritsar',
    },
  },
  {
    year: 1947, title: 'Partition & Instrument of Accession', category: 'conflict',
    description: "India and Pakistan gain independence. Maharaja Hari Singh delays signing accession to either nation. Pakistani tribal militias backed by the army invade on October 22. Singh signs the Instrument of Accession to India on October 26. Indian troops airlift into Srinagar. The wound that will not close opens.",
    image_url: null, lat: 34.08, lng: 74.79, place: 'Srinagar',
    doc: {
      kind: 'Accession Instrument',
      name: 'Instrument of Accession (Jammu & Kashmir)',
      date: '26 October 1947',
      desc: 'The legal document by which Jammu & Kashmir acceded to the Dominion of India under the Indian Independence Act 1947, signed by Maharaja Hari Singh and accepted by Governor-General Mountbatten. It remains the cornerstone of India\'s legal claim to the state.',
      source: 'Wikisource',
      url: 'https://en.wikisource.org/wiki/Instrument_of_Accession_(Jammu_and_Kashmir)',
    },
  },
  {
    year: 1948, title: 'UN Ceasefire & Resolution 47', category: 'political',
    description: 'The UN Security Council passes Resolution 47, ordering a ceasefire and a free plebiscite to let Kashmiris decide their future. India and Pakistan agree. A ceasefire takes effect on January 1, 1949. The Ceasefire Line divides the territory. The plebiscite is never held.',
    image_url: null, lat: 34.05, lng: 74.82, place: 'Kashmir',
    doc: {
      kind: 'UN Resolution',
      name: 'UNSC Resolution 47 (1948)',
      date: '21 April 1948',
      desc: 'The resolution that set out the conditions for a UN-supervised plebiscite in Jammu & Kashmir. Its sequencing — Pakistani withdrawal first — became the central deadlock. Both sides have cited it ever since to opposite ends.',
      source: 'UN Digital Library',
      url: 'https://digitallibrary.un.org/record/112000',
    },
  },
  {
    year: 1949, title: 'Article 370 — Special Autonomous Status', category: 'political',
    description: "Article 370 is incorporated into the Indian Constitution, granting Jammu & Kashmir its own constitution, flag, and jurisdiction over all matters except defence, foreign affairs, and communications. Described as a 'temporary provision' in 1949 — it lasts 70 years.",
    image_url: null, lat: 34.08, lng: 74.79, place: 'Srinagar',
    doc: {
      kind: 'Constitutional Article',
      name: 'Article 370 of the Constitution of India',
      date: 'In force 17 November 1952 (as drafted 1949)',
      desc: "The provision granting Jammu & Kashmir special autonomous status within the Indian Union, limiting Parliament's legislative reach and preserving the state's separate constitution. It governed the state's relationship with India until 2019.",
      source: 'Constitution of India',
      url: 'https://www.constitutionofindia.net/articles/article-370-temporary-provisions-with-respect-to-the-state-of-jammu-and-kashmir/',
    },
  },
  {
    year: 1960, title: 'Indus Waters Treaty Signed', category: 'political',
    description: 'After nine years of World Bank mediation, India and Pakistan divide the Indus river system: the eastern rivers (Ravi, Beas, Sutlej) to India, the western rivers (Indus, Jhelum, Chenab) largely to Pakistan. The treaty survives every subsequent war — until 2025.',
    image_url: null, lat: 24.86, lng: 67.01, place: 'Karachi',
    doc: {
      kind: 'Water Treaty',
      name: 'Indus Waters Treaty (1960)',
      date: '19 September 1960',
      desc: 'The World Bank–brokered treaty allocating the six rivers of the Indus basin between India and Pakistan. Long held as a model of cooperation surviving three wars, it was placed in abeyance by India in April 2025 following the Pahalgam attack.',
      source: 'World Bank',
      url: 'https://www.worldbank.org/en/region/sar/brief/fact-sheet-the-indus-waters-treaty-1960-and-the-role-of-the-world-bank',
    },
  },
  {
    year: 1965, title: 'Second Kashmir War', category: 'conflict',
    description: 'Operation Gibraltar triggers the second India-Pakistan war. Pakistan infiltrates thousands of trained fighters across the Ceasefire Line to spark an uprising that never materialises — Kashmiris do not join. The Tashkent Declaration restores pre-war positions.',
    image_url: null, lat: 34.32, lng: 73.88, place: 'Uri Sector',
  },
  {
    year: 1966, title: 'Tashkent Declaration', category: 'political',
    description: 'Mediated by the Soviet Union, Indian PM Shastri and Pakistani President Ayub Khan sign the Tashkent Declaration, agreeing to withdraw to pre-war positions and restore relations. Shastri dies in Tashkent hours after signing. The Kashmir question is left entirely untouched.',
    image_url: null, lat: 41.30, lng: 69.24, place: 'Tashkent, USSR',
    doc: {
      kind: 'Peace Declaration',
      name: 'Tashkent Declaration (1966)',
      date: '10 January 1966',
      desc: 'The Soviet-brokered agreement ending the 1965 war, restoring the pre-war boundary and ordering prisoner exchanges. It settled the fighting but left the Kashmir question untouched.',
      source: 'UN Peacemaker',
      url: 'https://peacemaker.un.org/india-pakistan-tashkent-declaration66',
    },
  },
  {
    year: 1972, title: 'Simla Agreement — Line of Control Named', category: 'political',
    description: 'India and Pakistan sign the Simla Agreement on July 2. The 1949 Ceasefire Line is renamed the Line of Control. Both sides agree to resolve the Kashmir issue bilaterally — without third-party intervention. The LoC becomes the de facto border that neither side accepts as permanent.',
    image_url: null, lat: 31.10, lng: 77.17, place: 'Shimla',
    doc: {
      kind: 'Bilateral Agreement',
      name: 'Simla Agreement (1972)',
      date: '2 July 1972',
      desc: "Signed after the 1971 war, it committed both nations to resolve their differences bilaterally and peacefully, converting the Ceasefire Line into the Line of Control. India has long cited it to keep Kashmir a bilateral matter. Pakistan placed it in abeyance in April 2025.",
      source: 'UN Peacemaker',
      url: 'https://peacemaker.un.org/india-pakistan-simla-agreement72',
    },
  },
  {
    year: 1987, title: 'Disputed Elections', category: 'political',
    description: 'State assembly elections are widely alleged to be rigged. Muslim United Front candidates who won at the polls find their victories reversed and themselves arrested. A generation that had committed to the democratic path turns toward the gun. The 1987 elections are widely cited as the insurgency\'s ignition switch.',
    image_url: null, lat: 34.08, lng: 74.79, place: 'Srinagar',
  },
  {
    year: 1989, title: 'Armed Insurgency Erupts', category: 'conflict',
    description: 'The Jammu & Kashmir Liberation Front launches armed operations demanding azadi. Multiple armed groups emerge. The valley tips into full insurgency. An estimated 70,000–100,000 people will die over the following three decades.',
    image_url: null, lat: 34.08, lng: 74.80, place: 'Kashmir Valley',
  },
  {
    year: 1990, title: 'Kashmiri Pandit Exodus', category: 'humanitarian',
    description: "Between 100,000 and 250,000 Kashmiri Pandits — the valley's indigenous Hindu minority — flee their homes under threat. Targeted killings, mosque broadcasts urging departure, and a failure of state protection create mass panic. The Pandits become refugees in their own country.",
    image_url: null, lat: 34.09, lng: 74.79, place: 'Kashmir Valley',
  },
  {
    year: 1999, title: 'Lahore Declaration', category: 'political',
    description: 'Prime Ministers Vajpayee and Sharif sign the Lahore Declaration, committing to peace and nuclear restraint after both states had tested weapons in 1998. The Kargil intrusion, which begins months later, undoes the fragile optimism.',
    image_url: null, lat: 31.52, lng: 74.36, place: 'Lahore',
    doc: {
      kind: 'Peace Declaration',
      name: 'Lahore Declaration (1999)',
      date: '21 February 1999',
      desc: "A bilateral commitment to intensify dialogue, reduce nuclear risk and resolve Kashmir peacefully, signed during Vajpayee's historic bus diplomacy to Lahore. The Kargil intrusion months later effectively buried it.",
      source: 'UN Peacemaker',
      url: 'https://peacemaker.un.org/indiapakistan-lahoredeclaration99',
    },
  },
  {
    year: 1999, title: 'Kargil War', category: 'conflict',
    description: 'Pakistani soldiers and Lashkar-e-Taiba militants secretly cross the LoC during winter and occupy strategic Indian positions in the Kargil hills. India responds with Operation Vijay. 527 Indian and an estimated 357–453 Pakistani soldiers are officially killed. Two nuclear-armed states come to the brink.',
    image_url: null, lat: 34.55, lng: 76.13, place: 'Kargil',
  },
  {
    year: 2008, title: 'Amarnath Land Row & Mass Protests', category: 'political',
    description: 'A proposed transfer of forest land to the Amarnath Shrine Board triggers the largest mass protests in a decade. The valley shuts down completely. The Mumbai terror attacks of November 2008 — attributed to Lashkar-e-Taiba — bring India and Pakistan back to the edge.',
    image_url: null, lat: 34.08, lng: 74.79, place: 'Srinagar',
  },
  {
    year: 2016, title: "Burhan Wani Killed — A Generation Rises", category: 'conflict',
    description: 'Indian security forces kill Hizbul Mujahideen commander Burhan Wani — a young, social-media-savvy militant with 70,000 Facebook followers. What follows: 87 days of curfew, pellet guns fired into crowds at close range. An estimated 600 people are blinded or partially blinded.',
    image_url: null, lat: 33.68, lng: 75.15, place: 'South Kashmir',
  },
  {
    year: 2019, title: 'Article 370 Revoked', category: 'political',
    description: 'On August 5, the Indian Parliament abrogates Article 370 and Article 35A in a single session, stripping Jammu & Kashmir of its special status. A complete communications blackout seals the valley for months. Thousands are preventively detained, including elected politicians.',
    image_url: null, lat: 34.08, lng: 74.79, place: 'Srinagar',
    doc: {
      kind: 'Presidential Order',
      name: 'Constitutional Order C.O. 272 (2019)',
      date: '5 August 2019',
      desc: 'The Presidential Order and accompanying parliamentary resolution that rendered Article 370 inoperative, ending Jammu & Kashmir\'s special constitutional status. Paired with the Reorganisation Act, it dissolved the state.',
      source: 'The Gazette of India',
      url: 'https://egazette.gov.in/',
    },
  },
  {
    year: 2019, title: 'J&K Reorganisation Act', category: 'political',
    description: 'Parliament splits Jammu & Kashmir into two Union Territories — Jammu & Kashmir (with a legislature) and Ladakh (without one) — under direct central administration. The state loses its statehood. The reorganisation takes effect on 31 October 2019.',
    image_url: null, lat: 28.62, lng: 77.24, place: 'New Delhi',
    doc: {
      kind: 'Act of Parliament',
      name: 'J&K Reorganisation Act, 2019',
      date: '9 August 2019 (effective 31 October 2019)',
      desc: 'The law that downgraded the state of Jammu & Kashmir into two centrally administered Union Territories, ending its statehood and redrawing the administrative map of the region.',
      source: 'India Code',
      url: 'https://www.indiacode.nic.in/handle/123456789/12289',
    },
  },
  {
    year: 2023, title: 'Supreme Court Upholds Article 370 Repeal', category: 'political',
    description: "A five-judge Constitution Bench unanimously upholds the 2019 abrogation of Article 370 as constitutionally valid, declares it a temporary provision, and orders assembly elections by September 2024 and the eventual restoration of statehood. A landmark judgment on the region's constitutional future.",
    image_url: null, lat: 28.62, lng: 77.24, place: 'New Delhi',
    doc: {
      kind: 'Court Judgment',
      name: 'In re: Article 370 of the Constitution (2023)',
      date: '11 December 2023',
      desc: "The Supreme Court of India's unanimous judgment validating the 2019 abrogation and directing the restoration of statehood and the holding of elections, while recommending a truth and reconciliation process for the region.",
      source: 'Supreme Court of India',
      url: 'https://www.sci.gov.in/',
    },
  },
  {
    year: 2024, title: 'First Assembly Elections Since Article 370', category: 'political',
    description: 'Jammu & Kashmir holds its first assembly elections since the revocation of Article 370 — and the first since it was made a Union Territory. The National Conference–Congress alliance wins. Omar Abdullah becomes Chief Minister. The restoration of statehood — promised by the Indian government — remains undelivered.',
    image_url: null, lat: 34.08, lng: 74.80, place: 'Jammu & Kashmir',
  },
  {
    year: 2025, title: 'Pahalgam Attack & Operation Sindoor', category: 'conflict',
    description: 'On April 22, militants kill 26 tourists at Pahalgam — the deadliest civilian attack in the valley in a quarter-century. India blames Pakistan-backed groups. On May 7, India launches Operation Sindoor, striking targets across Pakistan-administered Kashmir and Pakistan. Four days of exchanges follow before a ceasefire understanding is reached.',
    image_url: null, lat: 34.01, lng: 75.32, place: 'Pahalgam / LoC',
  },
  {
    year: 2025, title: 'India Suspends the Indus Waters Treaty', category: 'political',
    description: "Following the Pahalgam attack, India puts the 1960 Indus Waters Treaty in abeyance — the first time since it was signed. Pakistan retaliates by suspending the Simla Agreement and closing its airspace to Indian aircraft. Two foundational agreements of South Asian coexistence are placed simultaneously on hold.",
    image_url: null, lat: 28.62, lng: 77.24, place: 'New Delhi',
    doc: {
      kind: 'Government Decision',
      name: 'Cabinet Committee on Security Decision (2025)',
      date: '23 April 2025',
      desc: "India's decision to hold the Indus Waters Treaty in abeyance — the first time since 1960 — alongside diplomatic downgrades following the Pahalgam massacre. Pakistan simultaneously placed the Simla Agreement in abeyance.",
      source: 'Press Information Bureau',
      url: 'https://pib.gov.in/',
    },
  },
  {
    year: 2026, title: 'Kashmir — An Unresolved Present', category: 'political',
    description: 'Jammu & Kashmir remains a Union Territory awaiting the promised restoration of statehood. The Indus Waters Treaty is still suspended. The territory remains divided among India, Pakistan, and China. The ceasefire line drawn in 1949 still holds. No plebiscite has ever been held. This film was made in this moment.',
    image_url: null, lat: 34.09, lng: 74.80, place: 'Jammu & Kashmir',
  },
];
