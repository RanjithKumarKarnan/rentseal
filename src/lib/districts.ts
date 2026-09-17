/**
 * The 38 districts of Tamil Nadu — the single source of truth for every
 * location page on the site.
 *
 * Two page families are generated from this list:
 *   /rental-agreement/[district]   — agreement drafting, e-stamping, e-signing
 *   /stamp-paper/[district]        — non-judicial paper and e-Stamp delivery
 *
 * `zone` ties a district to a DELIVERY_ZONE in ./stamp-paper.ts, so ETA and
 * delivery charge on a location page always match the coverage section on the
 * landing page. Change a district's zone here and both update together.
 *
 * `sroTowns` are the taluk headquarters, which is where the Registration
 * Department's Sub-Registrar Offices sit. `towns` are the main localities in
 * the district, and drive the "areas we cover" block.
 *
 * There is deliberately no order-count field. One existed and was invented,
 * which is not a number a business should publish before it is true. Pages now
 * lead on facts that hold from day one — districts covered, Sub-Registrar
 * Offices, delivery timing.
 */

export type ZoneId = "metro" | "major" | "state";

export type Region =
  | "Chennai & suburbs"
  | "Northern Tamil Nadu"
  | "Kongu Nadu"
  | "Cauvery delta"
  | "Southern Tamil Nadu"
  | "Western ghats";

export interface District {
  /** Official district name, as the Registration Department writes it. */
  name: string;
  /** URL segment. Stable — never change one without adding a redirect. */
  slug: string;
  /** District headquarters town. */
  hq: string;
  region: Region;
  zone: ZoneId;
  /** Taluk headquarters — where the Sub-Registrar Offices are located. */
  sroTowns: string[];
  /** Main towns and localities in the district. */
  towns: string[];
  /** What the district does — one line, used to keep every page distinct. */
  economy: string;
  /** What drives rental and stamp paper demand here specifically. */
  demand: string;
}

export const DISTRICTS: District[] = [
  {
    name: "Ariyalur",
    slug: "ariyalur",
    hq: "Ariyalur",
    region: "Cauvery delta",
    zone: "state",
    sroTowns: ["Ariyalur", "Jayankondam", "Udayarpalayam", "Sendurai", "Andimadam"],
    towns: ["Ariyalur town", "Jayankondam", "Sendurai", "Andimadam"],
    economy:
      "The state's cement and limestone belt, with quarries and plants clustered around Ariyalur and Jayankondam town.",
    demand:
      "Most agreements here are staff quarters taken by cement and quarry companies, and shop leases along the Ariyalur–Jayankondam road. Non-judicial stamp paper demand runs to ₹100 rental and affidavit paper.",
  },
  {
    name: "Chengalpattu",
    slug: "chengalpattu",
    hq: "Chengalpattu",
    region: "Chennai & suburbs",
    zone: "metro",
    sroTowns: [
      "Chengalpattu",
      "Tambaram",
      "Pallavaram",
      "Vandalur",
      "Thiruporur",
      "Tirukalukundram",
      "Maduranthakam",
      "Cheyyur",
    ],
    towns: ["Tambaram", "Chromepet", "Guduvancheri", "Kelambakkam", "Maraimalai Nagar", "Pallavaram"],
    economy:
      "The OMR and GST Road corridor — IT parks at Siruseri and Navalur, and the automotive belt around Maraimalai Nagar and Oragadam.",
    demand:
      "The fastest-moving rental market in the state after Chennai proper. Young IT tenants on OMR, and factory staff housing along GST Road, turn over agreements every eleven months like clockwork.",
  },
  {
    name: "Chennai",
    slug: "chennai",
    hq: "Chennai",
    region: "Chennai & suburbs",
    zone: "metro",
    sroTowns: [
      "Chennai Central",
      "Mylapore",
      "T. Nagar",
      "Adyar",
      "Velachery",
      "Ambattur",
      "Alandur",
      "Sholinganallur",
      "Perambur",
      "Madhavaram",
    ],
    towns: ["Adyar", "Anna Nagar", "Velachery", "T. Nagar", "Porur", "Sholinganallur"],
    economy:
      "The state capital and its registration heartland — more instruments are registered here than in any other district in Tamil Nadu.",
    demand:
      "Every kind of instrument is in demand here: 11-month residential lets across the suburbs, commercial leases in T. Nagar and Guindy, and a constant run of affidavits for passports, name changes and college admissions.",
  },
  {
    name: "Coimbatore",
    slug: "coimbatore",
    hq: "Coimbatore",
    region: "Kongu Nadu",
    zone: "major",
    sroTowns: [
      "Coimbatore North",
      "Coimbatore South",
      "Peelamedu",
      "Mettupalayam",
      "Pollachi",
      "Sulur",
      "Annur",
      "Kinathukadavu",
      "Valparai",
    ],
    towns: ["R.S. Puram", "Peelamedu", "Saibaba Colony", "Gandhipuram", "Vadavalli", "Singanallur"],
    economy:
      "Pumps, motors and textile machinery, plus a large engineering-college population and a growing IT presence at Peelamedu.",
    demand:
      "Student and working-professional lets around Peelamedu and Saibaba Colony, and industrial shed leases in the Ganapathy and Kurichi belts that need commercial drafting, not a residential template.",
  },
  {
    name: "Cuddalore",
    slug: "cuddalore",
    hq: "Cuddalore",
    region: "Northern Tamil Nadu",
    zone: "state",
    sroTowns: [
      "Cuddalore",
      "Chidambaram",
      "Panruti",
      "Virudhachalam",
      "Kattumannarkoil",
      "Bhuvanagiri",
      "Kurinjipadi",
      "Titagudi",
    ],
    towns: ["Cuddalore OT", "Neyveli", "Chidambaram", "Panruti"],
    economy:
      "The Neyveli lignite complex, the SIPCOT chemical estate, and Annamalai University at Chidambaram.",
    demand:
      "Contractor staff housing around Neyveli and SIPCOT, and a steady student rental market at Chidambaram that peaks every June.",
  },
  {
    name: "Dharmapuri",
    slug: "dharmapuri",
    hq: "Dharmapuri",
    region: "Northern Tamil Nadu",
    zone: "state",
    sroTowns: ["Dharmapuri", "Palacode", "Pennagaram", "Harur", "Pappireddipatti", "Karimangalam", "Nallampalli"],
    towns: ["Dharmapuri town", "Harur", "Pennagaram", "Palacode"],
    economy:
      "Mango and granite country, with the Hogenakkal belt and a growing spread of agri-processing units.",
    demand:
      "Agricultural land leases, godown rentals for mango and granite traders, and the affidavits that go with revenue and patta work.",
  },
  {
    name: "Dindigul",
    slug: "dindigul",
    hq: "Dindigul",
    region: "Southern Tamil Nadu",
    zone: "state",
    sroTowns: [
      "Dindigul East",
      "Dindigul West",
      "Palani",
      "Kodaikanal",
      "Vedasandur",
      "Natham",
      "Nilakottai",
      "Oddanchatram",
      "Guziliyamparai",
    ],
    towns: ["Dindigul town", "Palani", "Kodaikanal", "Oddanchatram"],
    economy: "Locks, leather and spinning mills, with Kodaikanal running a tourism economy of its own.",
    demand:
      "Two very different markets in one district — ordinary town lets in Dindigul and Palani, and short-season holiday-property licences in Kodaikanal that need a leave and licence, not a tenancy.",
  },
  {
    name: "Erode",
    slug: "erode",
    hq: "Erode",
    region: "Kongu Nadu",
    zone: "major",
    sroTowns: [
      "Erode",
      "Perundurai",
      "Bhavani",
      "Gobichettipalayam",
      "Sathyamangalam",
      "Kodumudi",
      "Modakurichi",
      "Anthiyur",
      "Nambiyur",
    ],
    towns: ["Perundurai Road", "Brough Road", "Surampatti", "Veerappanchatram"],
    economy:
      "India's largest handloom and powerloom cluster, plus turmeric trading and the SIPCOT estate at Perundurai.",
    demand:
      "Loom shed and godown leases dominate, which are commercial instruments with fit-out and power-supply clauses. Residential lets cluster along Perundurai Road.",
  },
  {
    name: "Kallakurichi",
    slug: "kallakurichi",
    hq: "Kallakurichi",
    region: "Northern Tamil Nadu",
    zone: "state",
    sroTowns: ["Kallakurichi", "Chinnasalem", "Sankarapuram", "Ulundurpet", "Tirukoilur"],
    towns: ["Kallakurichi town", "Ulundurpet", "Tirukoilur", "Chinnasalem"],
    economy:
      "Sugar mills and cashew processing, in a district carved out of Viluppuram in 2019 and still building its town centres.",
    demand:
      "Mill staff quarters and small commercial shops on the Chennai–Trichy highway. A young district whose town centres are still forming, so first-time agreements are more common here than renewals.",
  },
  {
    name: "Kancheepuram",
    slug: "kancheepuram",
    hq: "Kancheepuram",
    region: "Chennai & suburbs",
    zone: "metro",
    sroTowns: ["Kancheepuram", "Sriperumbudur", "Uthiramerur", "Walajabad", "Kundrathur"],
    towns: ["Kancheepuram town", "Sriperumbudur", "Oragadam", "Kundrathur"],
    economy:
      "Silk weaving in the temple town, and the Sriperumbudur–Oragadam manufacturing corridor with its electronics and automotive plants.",
    demand:
      "Company-leased staff accommodation around Sriperumbudur at real scale — often forty or fifty agreements signed in a batch — alongside traditional weaver-house lets in Kancheepuram itself.",
  },
  {
    name: "Kanyakumari",
    slug: "kanyakumari",
    hq: "Nagercoil",
    region: "Southern Tamil Nadu",
    zone: "state",
    sroTowns: ["Agastheeswaram", "Thovalai", "Kalkulam", "Vilavancode", "Killiyoor", "Thiruvattar"],
    towns: ["Nagercoil", "Marthandam", "Kanyakumari", "Colachel"],
    economy:
      "Rubber, tourism and the highest literacy rate in the state, with a very large share of families holding NRI income from the Gulf.",
    demand:
      "A notable volume of power of attorney and property instruments executed for owners living abroad, plus ordinary lets in Nagercoil and Marthandam.",
  },
  {
    name: "Karur",
    slug: "karur",
    hq: "Karur",
    region: "Kongu Nadu",
    zone: "state",
    sroTowns: ["Karur", "Kulithalai", "Krishnarayapuram", "Aravakurichi", "Manmangalam", "Pugalur", "Kadavur"],
    towns: ["Karur town", "Kulithalai", "Pugalur", "Velayuthampalayam"],
    economy: "Home textiles for export, bus body building, and a dense cluster of paper mills at Pugalur.",
    demand:
      "Export units take godowns and staff housing on longer commercial terms, which usually means a registered lease deed rather than an 11-month agreement.",
  },
  {
    name: "Krishnagiri",
    slug: "krishnagiri",
    hq: "Krishnagiri",
    region: "Northern Tamil Nadu",
    zone: "major",
    sroTowns: [
      "Krishnagiri",
      "Hosur",
      "Denkanikottai",
      "Pochampalli",
      "Uthangarai",
      "Bargur",
      "Shoolagiri",
      "Kaveripattinam",
    ],
    towns: ["Hosur", "Sipcot Hosur", "Mathigiri", "Bagalur Road", "Krishnagiri town"],
    economy:
      "Hosur's electronics and automotive belt, close enough to Bengaluru that it functions as part of that labour market.",
    demand:
      "The busiest non-metro rental market we serve. Hosur factory staff turn over constantly, and a good share of tenants are Kannada speakers working in Tamil Nadu — so we draft in plain English and explain the stamp duty in both languages.",
  },
  {
    name: "Madurai",
    slug: "madurai",
    hq: "Madurai",
    region: "Southern Tamil Nadu",
    zone: "major",
    sroTowns: [
      "Madurai North",
      "Madurai South",
      "Madurai East",
      "Madurai West",
      "Melur",
      "Vadipatti",
      "Usilampatti",
      "Thirumangalam",
      "Peraiyur",
    ],
    towns: ["Anna Nagar", "K.K. Nagar", "Villapuram", "Thirunagar", "Bypass Road"],
    economy:
      "The commercial capital of southern Tamil Nadu — temple tourism, a large medical-education sector, and wholesale trade for six surrounding districts.",
    demand:
      "Steady residential demand from medical and engineering students, and commercial shop leases around the Masi streets where the paperwork has to be right because the rents are high.",
  },
  {
    name: "Mayiladuthurai",
    slug: "mayiladuthurai",
    hq: "Mayiladuthurai",
    region: "Cauvery delta",
    zone: "state",
    sroTowns: ["Mayiladuthurai", "Sirkazhi", "Tharangambadi", "Kuthalam"],
    towns: ["Mayiladuthurai town", "Sirkazhi", "Poompuhar", "Tharangambadi"],
    economy:
      "Delta paddy country with a heritage-tourism strip along the coast, split off from Nagapattinam in 2020.",
    demand:
      "Agricultural leases and small-town shop rentals. Being a new district, the common difficulty here is working out which Sub-Registrar Office now has jurisdiction — we confirm that before anything is drafted.",
  },
  {
    name: "Nagapattinam",
    slug: "nagapattinam",
    hq: "Nagapattinam",
    region: "Cauvery delta",
    zone: "state",
    sroTowns: ["Nagapattinam", "Kilvelur", "Vedaranyam", "Thirukkuvalai"],
    towns: ["Nagapattinam town", "Velankanni", "Vedaranyam", "Sikkal"],
    economy: "A fishing and port district, with the Velankanni pilgrimage economy and salt pans at Vedaranyam.",
    demand:
      "Lodging and shop licences around Velankanni that run seasonally, which is exactly the case for a leave and licence rather than a tenancy.",
  },
  {
    name: "Namakkal",
    slug: "namakkal",
    hq: "Namakkal",
    region: "Kongu Nadu",
    zone: "state",
    sroTowns: [
      "Namakkal",
      "Rasipuram",
      "Tiruchengode",
      "Paramathi Velur",
      "Sendamangalam",
      "Mohanur",
      "Kumarapalayam",
    ],
    towns: ["Namakkal town", "Tiruchengode", "Rasipuram", "Komarapalayam"],
    economy:
      "The poultry capital of India, plus a nationally significant lorry-body and transport industry at Tiruchengode.",
    demand:
      "Poultry farm and feed godown leases on agricultural land, which need careful drafting on permitted use, and transport-yard rentals around Tiruchengode.",
  },
  {
    name: "Nilgiris",
    slug: "nilgiris",
    hq: "Udhagamandalam",
    region: "Western ghats",
    zone: "state",
    sroTowns: ["Udhagamandalam", "Coonoor", "Kotagiri", "Gudalur", "Pandalur", "Kundah"],
    towns: ["Ooty", "Coonoor", "Kotagiri", "Gudalur"],
    economy: "Tea estates and hill-station tourism, with a property market shaped by heavy restrictions on land transfer.",
    demand:
      "Homestay and holiday-let licences, which must be drafted as licences — handing a season-long tenant exclusive possession of a hill property is how owners lose control of it.",
  },
  {
    name: "Perambalur",
    slug: "perambalur",
    hq: "Perambalur",
    region: "Cauvery delta",
    zone: "state",
    sroTowns: ["Perambalur", "Kunnam", "Veppanthattai", "Alathur"],
    towns: ["Perambalur town", "Kunnam", "Alathur", "Veppanthattai"],
    economy: "Onion and maize farming, and the smallest district in the state by population.",
    demand:
      "Mostly agricultural leases and single-shop rentals. The smallest district in the state by population, and the one where a plain, correctly stamped agreement matters most because there is no local alternative to fall back on.",
  },
  {
    name: "Pudukkottai",
    slug: "pudukkottai",
    hq: "Pudukkottai",
    region: "Cauvery delta",
    zone: "state",
    sroTowns: [
      "Pudukkottai",
      "Aranthangi",
      "Alangudi",
      "Illuppur",
      "Karambakudi",
      "Kulathur",
      "Ponnamaravathi",
      "Thirumayam",
      "Gandarvakottai",
      "Avudaiyarkoil",
    ],
    towns: ["Pudukkottai town", "Aranthangi", "Keeranur", "Alangudi"],
    economy: "A former princely state, now farming and quarrying, with a very high share of Gulf remittance income.",
    demand:
      "Power of attorney instruments for families with a member working abroad, and ordinary town lets in Pudukkottai and Aranthangi.",
  },
  {
    name: "Ramanathapuram",
    slug: "ramanathapuram",
    hq: "Ramanathapuram",
    region: "Southern Tamil Nadu",
    zone: "state",
    sroTowns: [
      "Ramanathapuram",
      "Paramakudi",
      "Rameswaram",
      "Mudukulathur",
      "Kadaladi",
      "Kamuthi",
      "Tiruvadanai",
    ],
    towns: ["Ramanathapuram town", "Paramakudi", "Rameswaram", "Kamuthi"],
    economy: "Fishing, salt and chilli trade, with the Rameswaram pilgrimage circuit running year round.",
    demand:
      "Lodge and shop licences at Rameswaram, and salt-pan leases that are long-term agricultural instruments needing registration.",
  },
  {
    name: "Ranipet",
    slug: "ranipet",
    hq: "Ranipet",
    region: "Northern Tamil Nadu",
    zone: "state",
    sroTowns: ["Ranipet", "Arakkonam", "Arcot", "Walajah", "Sholingur", "Nemili", "Kalavai"],
    towns: ["Ranipet town", "Arakkonam", "Arcot", "Sholingur"],
    economy:
      "Leather tanning and the SIPCOT industrial estate, plus the railway junction and Air Force station at Arakkonam.",
    demand:
      "Industrial staff housing around SIPCOT and defence-adjacent lets at Arakkonam, where tenants often need an agreement accepted as address proof.",
  },
  {
    name: "Salem",
    slug: "salem",
    hq: "Salem",
    region: "Kongu Nadu",
    zone: "major",
    sroTowns: [
      "Salem",
      "Attur",
      "Mettur",
      "Omalur",
      "Sankagiri",
      "Edappadi",
      "Yercaud",
      "Gangavalli",
      "Vazhapadi",
      "Valapady",
    ],
    towns: ["Hasthampatti", "Fairlands", "Ammapet", "Suramangalam"],
    economy: "Steel, magnesite and sago, with the Mettur dam and thermal complex anchoring the north of the district.",
    demand:
      "A large professional rental market around Hasthampatti and Fairlands, and industrial leases at Mettur that run long enough to require registration.",
  },
  {
    name: "Sivaganga",
    slug: "sivaganga",
    hq: "Sivaganga",
    region: "Southern Tamil Nadu",
    zone: "state",
    sroTowns: [
      "Sivaganga",
      "Karaikudi",
      "Devakottai",
      "Manamadurai",
      "Ilayangudi",
      "Tirupattur",
      "Singampunari",
      "Kalayarkoil",
    ],
    towns: ["Karaikudi", "Sivaganga town", "Devakottai", "Kanadukathan"],
    economy:
      "Chettinad country — heritage mansions, a strong banking and trading diaspora, and Alagappa University at Karaikudi.",
    demand:
      "Heritage-property licences for film shoots and boutique stays, student lets at Karaikudi, and a steady run of settlement and partition instruments in old Chettiar family properties.",
  },
  {
    name: "Tenkasi",
    slug: "tenkasi",
    hq: "Tenkasi",
    region: "Southern Tamil Nadu",
    zone: "state",
    sroTowns: [
      "Tenkasi",
      "Sankarankovil",
      "Shencottai",
      "Alangulam",
      "Kadayanallur",
      "Sivagiri",
      "Thiruvengadam",
      "Veerakeralampudur",
    ],
    towns: ["Tenkasi town", "Courtallam", "Sankarankovil", "Kadayanallur"],
    economy:
      "Powerlooms at Kadayanallur, wind energy along the Shencottai gap, and the Courtallam falls season from July to September.",
    demand:
      "Seasonal cottage licences at Courtallam, and loom-shed leases. Carved out of Tirunelveli in 2019, so jurisdiction questions come up often.",
  },
  {
    name: "Thanjavur",
    slug: "thanjavur",
    hq: "Thanjavur",
    region: "Cauvery delta",
    zone: "state",
    sroTowns: [
      "Thanjavur",
      "Kumbakonam",
      "Papanasam",
      "Orathanadu",
      "Pattukkottai",
      "Peravurani",
      "Thiruvaiyaru",
      "Thiruvidaimarudur",
      "Budalur",
    ],
    towns: ["Thanjavur town", "Kumbakonam", "Pattukkottai", "Thiruvaiyaru"],
    economy: "The rice bowl of Tamil Nadu, with a large university and medical-college population at Thanjavur.",
    demand:
      "Student housing around the medical and agricultural colleges, agricultural land leases across the delta, and shop rentals in the Kumbakonam temple streets.",
  },
  {
    name: "Theni",
    slug: "theni",
    hq: "Theni",
    region: "Western ghats",
    zone: "state",
    sroTowns: ["Theni", "Periyakulam", "Bodinayakanur", "Uthamapalayam", "Andipatti"],
    towns: ["Theni town", "Bodinayakanur", "Cumbum", "Periyakulam"],
    economy: "Cardamom, grapes and the Cumbum valley, sitting on the Kerala border with heavy cross-state trade.",
    demand:
      "Estate and godown leases for the spice trade, plus a fair number of agreements where one party is resident in Kerala — which makes Aadhaar e-signing far easier than a joint visit to an office.",
  },
  {
    name: "Thoothukudi",
    slug: "thoothukudi",
    hq: "Thoothukudi",
    region: "Southern Tamil Nadu",
    zone: "major",
    sroTowns: [
      "Thoothukudi",
      "Tiruchendur",
      "Kovilpatti",
      "Srivaikuntam",
      "Ottapidaram",
      "Ettayapuram",
      "Vilathikulam",
      "Sattankulam",
    ],
    towns: ["Thoothukudi town", "Kovilpatti", "Tiruchendur", "Millerpuram"],
    economy: "A major port, with salt, chemicals, thermal power and the match and printing cluster at Kovilpatti.",
    demand:
      "Port and logistics companies take warehouse space on commercial terms, and there is steady residential demand from the power and chemical plants.",
  },
  {
    name: "Tiruchirappalli",
    slug: "tiruchirappalli",
    hq: "Tiruchirappalli",
    region: "Cauvery delta",
    zone: "major",
    sroTowns: [
      "Tiruchirappalli East",
      "Tiruchirappalli West",
      "Srirangam",
      "Lalgudi",
      "Manapparai",
      "Musiri",
      "Thottiyam",
      "Thuraiyur",
      "Manachanallur",
      "Marungapuri",
    ],
    towns: ["Thillai Nagar", "Srirangam", "Cantonment", "K.K. Nagar", "Woraiyur"],
    economy:
      "BHEL and the Ordnance Factory, a very large engineering and medical college population, and an international airport.",
    demand:
      "Thillai Nagar is one of the densest rental markets outside Chennai. Student and BHEL staff lets renew on an academic and transfer cycle, so we see clear peaks in May and June.",
  },
  {
    name: "Tirunelveli",
    slug: "tirunelveli",
    hq: "Tirunelveli",
    region: "Southern Tamil Nadu",
    zone: "major",
    sroTowns: [
      "Tirunelveli",
      "Palayamkottai",
      "Ambasamudram",
      "Nanguneri",
      "Radhapuram",
      "Cheranmahadevi",
      "Manur",
    ],
    towns: ["Palayamkottai", "Vannarpettai", "Perumalpuram", "Tirunelveli Town"],
    economy:
      "The education hub of the deep south — Palayamkottai alone carries a dozen colleges — with wind energy across the Nanguneri belt.",
    demand:
      "Student and faculty housing dominates around Palayamkottai, and wind-energy companies take land on long leases that always require registration.",
  },
  {
    name: "Tirupathur",
    slug: "tirupathur",
    hq: "Tirupathur",
    region: "Northern Tamil Nadu",
    zone: "state",
    sroTowns: ["Tirupathur", "Vaniyambadi", "Ambur", "Natrampalli", "Jolarpet"],
    towns: ["Ambur", "Vaniyambadi", "Tirupathur town", "Jolarpet"],
    economy:
      "The Ambur–Vaniyambadi leather and footwear export belt, one of the largest in the country, on the Chennai–Bengaluru highway.",
    demand:
      "Tannery and footwear units take industrial premises on commercial leases with pollution-clearance and effluent clauses that a residential template cannot carry.",
  },
  {
    name: "Tiruppur",
    slug: "tiruppur",
    hq: "Tiruppur",
    region: "Kongu Nadu",
    zone: "major",
    sroTowns: [
      "Tiruppur North",
      "Tiruppur South",
      "Avinashi",
      "Palladam",
      "Udumalaipettai",
      "Dharapuram",
      "Kangeyam",
      "Madathukulam",
      "Uthukuli",
    ],
    towns: ["Kumaran Road", "Avinashi Road", "P.N. Road", "Perumanallur"],
    economy: "The knitwear export capital of India, turning over thousands of crores a year in garments.",
    demand:
      "Enormous demand for migrant worker accommodation and factory-shed leases. Many landlords here let ten or more units, so the same terms have to be reproduced accurately again and again — which is exactly where a downloaded template starts to cost money.",
  },
  {
    name: "Tiruvallur",
    slug: "tiruvallur",
    hq: "Tiruvallur",
    region: "Chennai & suburbs",
    zone: "metro",
    sroTowns: [
      "Tiruvallur",
      "Ponneri",
      "Gummidipoondi",
      "Poonamallee",
      "Avadi",
      "Ambattur",
      "Uthukkottai",
      "Pallipattu",
      "Tiruttani",
    ],
    towns: ["Avadi", "Poonamallee", "Ponneri", "Tiruttani", "Gummidipoondi"],
    economy:
      "Chennai's northern and western industrial edge — Ennore port, the Gummidipoondi SIPCOT estate, and the defence establishments at Avadi.",
    demand:
      "Heavy demand at Avadi and Poonamallee from defence and factory staff, and warehouse leases along the Gummidipoondi corridor.",
  },
  {
    name: "Tiruvannamalai",
    slug: "tiruvannamalai",
    hq: "Tiruvannamalai",
    region: "Northern Tamil Nadu",
    zone: "state",
    sroTowns: [
      "Tiruvannamalai",
      "Arani",
      "Cheyyar",
      "Polur",
      "Chengam",
      "Vandavasi",
      "Kalasapakkam",
      "Thandarampattu",
      "Kilpennathur",
      "Vembakkam",
    ],
    towns: ["Tiruvannamalai town", "Arani", "Vandavasi", "Cheyyar"],
    economy:
      "The Arunachaleswarar temple town, which draws a large long-staying visitor population, plus silk weaving at Arani.",
    demand:
      "An unusual market — long-stay lets to visitors, including foreign nationals, around the girivalam path. Those need a licence structure and a properly drafted term rather than an ordinary tenancy.",
  },
  {
    name: "Tiruvarur",
    slug: "tiruvarur",
    hq: "Tiruvarur",
    region: "Cauvery delta",
    zone: "state",
    sroTowns: [
      "Tiruvarur",
      "Mannargudi",
      "Nannilam",
      "Needamangalam",
      "Kodavasal",
      "Thiruthuraipoondi",
      "Valangaiman",
    ],
    towns: ["Tiruvarur town", "Mannargudi", "Thiruthuraipoondi", "Kodavasal"],
    economy: "Delta paddy and a central university, in one of the most agricultural districts in the state.",
    demand:
      "Land leases on a seasonal cycle and modest town rentals. Faculty and student housing around the central university is the growth area.",
  },
  {
    name: "Vellore",
    slug: "vellore",
    hq: "Vellore",
    region: "Northern Tamil Nadu",
    zone: "major",
    sroTowns: ["Vellore", "Katpadi", "Gudiyatham", "Anaicut", "K.V. Kuppam", "Pernambut"],
    towns: ["Katpadi", "Sathuvachari", "Gandhi Nagar", "Bagayam", "Vellore Fort"],
    economy:
      "CMC Hospital and VIT University between them bring in a very large transient population from across India and abroad.",
    demand:
      "The most out-of-state tenants of any district we serve. Patients' families near CMC take short lets, and VIT students fill Katpadi — both cases where Aadhaar e-signing saves a trip nobody wants to make.",
  },
  {
    name: "Viluppuram",
    slug: "viluppuram",
    hq: "Viluppuram",
    region: "Northern Tamil Nadu",
    zone: "state",
    sroTowns: [
      "Viluppuram",
      "Tindivanam",
      "Gingee",
      "Vanur",
      "Marakkanam",
      "Vikravandi",
      "Melmalayanur",
      "Kandachipuram",
      "Tiruvennainallur",
    ],
    towns: ["Viluppuram town", "Tindivanam", "Gingee", "Marakkanam"],
    economy:
      "A major rail junction and cashew and sugar belt, with the Puducherry border and the ECR tourism strip on its eastern edge.",
    demand:
      "Junction-town commercial rentals at Viluppuram and Tindivanam, and beach-property licences along the Marakkanam stretch of the ECR.",
  },
  {
    name: "Virudhunagar",
    slug: "virudhunagar",
    hq: "Virudhunagar",
    region: "Southern Tamil Nadu",
    zone: "state",
    sroTowns: [
      "Virudhunagar",
      "Sivakasi",
      "Sattur",
      "Aruppukottai",
      "Rajapalayam",
      "Srivilliputhur",
      "Tiruchuli",
      "Kariapatti",
      "Watrap",
    ],
    towns: ["Sivakasi", "Rajapalayam", "Aruppukottai", "Srivilliputhur"],
    economy:
      "Sivakasi's fireworks, matches and offset printing — the largest concentration of any of the three in India — with spinning mills at Rajapalayam.",
    demand:
      "Licensed fireworks and match units need premises leases that survive a licensing inspection, so permitted use and statutory-compliance clauses matter more here than almost anywhere else in the state.",
  },
];

/* ─────────────────────────── Lookups ─────────────────────────── */

export function getDistrict(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}

/** Districts in the same region, excluding the one given — used for internal linking. */
export function nearbyDistricts(district: District, limit = 6): District[] {
  const sameRegion = DISTRICTS.filter(
    (d) => d.region === district.region && d.slug !== district.slug,
  );
  if (sameRegion.length >= limit) return sameRegion.slice(0, limit);
  const rest = DISTRICTS.filter(
    (d) => d.slug !== district.slug && !sameRegion.includes(d),
  );
  return [...sameRegion, ...rest].slice(0, limit);
}

export const REGIONS: Region[] = [
  "Chennai & suburbs",
  "Northern Tamil Nadu",
  "Kongu Nadu",
  "Cauvery delta",
  "Southern Tamil Nadu",
  "Western ghats",
];

/** Districts grouped by region, for the index pages. */
export function districtsByRegion(): Array<{ region: Region; districts: District[] }> {
  return REGIONS.map((region) => ({
    region,
    districts: DISTRICTS.filter((d) => d.region === region),
  })).filter((group) => group.districts.length > 0);
}

/**
 * Delivery promise for a district, kept in step with DELIVERY_ZONES.
 * `eta` reads inside a sentence; `shortEta` is title-cased for <title> tags.
 */
export const ZONE_META: Record<
  ZoneId,
  { label: string; eta: string; shortEta: string; charge: number; cutOff?: string }
> = {
  metro: {
    label: "Chennai metro",
    eta: "Next day",
    shortEta: "Next-Day Delivery",
    charge: 100,
    cutOff: "Same day by Porter, charged at cost",
  },
  major: {
    label: "Major cities",
    eta: "Express",
    shortEta: "Express Delivery",
    charge: 200,
  },
  state: {
    label: "Statewide",
    eta: "2 – 3 working days",
    shortEta: "2–3 Day Delivery",
    charge: 100,
  },
};

/** Towns people search for that are not themselves districts. */
export const NOTABLE_TOWNS: Array<{ town: string; district: string; slug: string }> = [
  { town: "Hosur", district: "Krishnagiri", slug: "krishnagiri" },
  { town: "Trichy", district: "Tiruchirappalli", slug: "tiruchirappalli" },
  { town: "Ooty", district: "Nilgiris", slug: "nilgiris" },
  { town: "Nagercoil", district: "Kanyakumari", slug: "kanyakumari" },
  { town: "Karaikudi", district: "Sivaganga", slug: "sivaganga" },
  { town: "Ambur", district: "Tirupathur", slug: "tirupathur" },
  { town: "Kumbakonam", district: "Thanjavur", slug: "thanjavur" },
  { town: "Sivakasi", district: "Virudhunagar", slug: "virudhunagar" },
  { town: "Neyveli", district: "Cuddalore", slug: "cuddalore" },
  { town: "Tambaram", district: "Chengalpattu", slug: "chengalpattu" },
  { town: "Avadi", district: "Tiruvallur", slug: "tiruvallur" },
  { town: "Sriperumbudur", district: "Kancheepuram", slug: "kancheepuram" },
  { town: "Pollachi", district: "Coimbatore", slug: "coimbatore" },
  { town: "Rajapalayam", district: "Virudhunagar", slug: "virudhunagar" },
  { town: "Mettur", district: "Salem", slug: "salem" },
  { town: "Arakkonam", district: "Ranipet", slug: "ranipet" },
];

/* ─────────────────────────── Per-district FAQs ─────────────────────────── */

export interface Faq {
  q: string;
  a: string;
}

/**
 * FAQs written from a district's own data — its SRO towns, delivery zone,
 * headquarters and the towns we serve.
 *
 * These exist because the generic FAQ block was rendering the same eight
 * answers on all 76 location pages, which is duplicate content at exactly the
 * scale Google demotes. Every district now answers the questions a searcher in
 * that district actually types, and each page gets its own FAQPage schema.
 */
export function rentalFaqs(d: District): Faq[] {
  const zone = ZONE_META[d.zone];
  const [first, second] = d.sroTowns;

  return [
    {
      q: `Is an online rental agreement legally valid in ${d.name}?`,
      a: `Yes. The agreement is drafted on a Tamil Nadu compliant template, e-stamped with duty paid to the Government of Tamil Nadu, and signed using Aadhaar e-Sign — which has the same legal effect as a handwritten signature under Section 3A of the Information Technology Act, 2000. It is admissible in evidence in ${d.name} exactly as a paper agreement would be. Nothing about the district changes its validity.`,
    },
    {
      q: `Do I have to visit a Sub-Registrar Office in ${d.name}?`,
      a: `Not for an 11-month agreement — e-stamping alone makes it valid in evidence, and the whole thing happens online. Registration only becomes compulsory once the term reaches 12 months, under Section 17(1)(d) of the Registration Act, 1908. If that applies to you, ${d.name} has Sub-Registrar Offices at ${d.sroTowns.slice(0, 4).join(", ")}${d.sroTowns.length > 4 ? " and other taluk headquarters" : ""}, and we book the slot at whichever one has jurisdiction over your property.`,
    },
    {
      q: `How much stamp duty will I pay on a rental agreement in ${d.name}?`,
      a: `One per cent of the total rent across the whole term plus any deposit — the same rate everywhere in Tamil Nadu, ${d.name} included. On ₹15,000 a month for 11 months with a ₹1,00,000 deposit, the chargeable value is ₹2,65,000 and the duty is ₹2,650. We show that arithmetic line by line before you pay, and the government portion passes through at cost with no markup.`,
    },
    {
      q: `How quickly can I get my agreement in ${d.name}?`,
      a: `The signed PDF usually reaches both parties within four hours of the last Aadhaar OTP, wherever in ${d.name} you are — delivery of a digital document does not depend on your district. If you also want a printed, stamped copy couriered to you, ${d.name} falls in our ${zone.label.toLowerCase()} zone, so that arrives ${zone.eta.toLowerCase()}${zone.cutOff ? ` when you order before 2 pm` : ""}.`,
    },
    {
      q: `Which areas of ${d.name} do you cover?`,
      a: `Every taluk in the district. Most of our ${d.name} work comes from ${d.towns.slice(0, 3).join(", ")} and around ${d.hq}, but coverage is not limited to those — the agreement is drafted and signed online, so where the property sits inside ${d.name} makes no difference to what you pay or how long it takes.`,
    },
    {
      q: `My landlord and I are not in the same city. Can we still sign?`,
      a: `Yes, and this is one of the main reasons people use us. Each party signs with an Aadhaar OTP on their own phone, from wherever they happen to be. We regularly complete agreements where the property is in ${first}${second ? ` or ${second}` : ""} and the owner is in another state or abroad. Only a registered lease of 12 months or more requires both parties to appear in person.`,
    },
  ];
}

export function stampPaperFaqs(d: District): Faq[] {
  const zone = ZONE_META[d.zone];

  return [
    {
      q: `How fast is non-judicial stamp paper delivered in ${d.name}?`,
      a: `${d.name} is in our ${zone.label.toLowerCase()} zone, so non-judicial stamp paper reaches you ${zone.eta.toLowerCase()}${zone.cutOff ? ` — ${zone.cutOff.toLowerCase()}` : ""}. Delivery is ₹${zone.charge}, and free once the physical paper in your order crosses ₹2,000 or ten sheets. An e-Stamp certificate, where your instrument allows one, is emailed within minutes — nothing is delivered, so its value does not count towards that free-delivery threshold.`,
    },
    {
      q: `Do you deliver physical stamp paper in ${d.name}, or only e-Stamps?`,
      a: `Both. The ₹100, ₹500, ₹1,000 and ₹5,000 sheets are physical non-judicial stamp paper — the original hard copy — delivered to your door in ${d.name} ${zone.eta.toLowerCase()}. An e-Stamp certificate for an exact amount of duty is emailed instead. Tell us what you are executing and we will say which one it needs before you order.`,
    },
    {
      q: `Do you charge more than the printed value in ${d.name}?`,
      a: `No. You pay exactly the denomination printed on the sheet plus the flat ₹${zone.charge} delivery charge for ${d.name}, both stated before you confirm. We do not mark up the paper and we do not mark up government duty — the platform fee is the only thing we earn, and GST at 18% applies to that fee alone.`,
    },
    {
      q: `Which denomination do I need?`,
      a: `Most 11-month rental agreements in Tamil Nadu are executed on ₹100 paper, and so are affidavits, declarations and indemnity bonds — ₹100 is the smallest sheet we carry. Partnership and commercial deeds go on ₹500, and we stock ₹1,000 and ₹5,000 above that. Where the duty payable is a specific figure — a lease deed, sale agreement or mortgage — only an e-Stamp certificate for that exact amount will do. Tell us what you are executing and we will tell you which applies before you order.`,
    },
    {
      q: `Is the non-judicial stamp paper you deliver in ${d.name} genuine?`,
      a: `Yes. Everything is procured through licensed stamp vendors and the state's authorised e-Stamping channel. Each sheet or certificate carries a serial number you can verify yourself against the Registration Department's records, and we print that number on your invoice so you can check without having to ask us.`,
    },
    {
      q: `Where in ${d.name} do you deliver?`,
      a: `Every taluk in the district, including ${d.towns.slice(0, 3).join(", ")} and ${d.hq}. If your town is not one we name on this page it is still covered — the ${zone.eta.toLowerCase()} promise applies across ${d.name}, not just to the larger towns.`,
    },
    {
      q: `Can I order non-judicial stamp paper in bulk for my firm in ${d.name}?`,
      a: `Yes. Ten sheets or more ships free anywhere in ${d.name}, we can hold a recurring monthly supply against a standing order, and we raise a single GST invoice to your GSTIN rather than one per delivery. This is set up for law firms, builders, HR teams and brokers — ask us about account terms.`,
    },
  ];
}
