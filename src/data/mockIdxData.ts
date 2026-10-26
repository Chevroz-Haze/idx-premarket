import { IDXAnnouncement, AlertPreferences } from '../types';
import { getJakartaTime } from '../utils/marketTime';

// Helper to generate current Jakarta (WIB) dates dynamically so data is always current (2026+)
function getDynamicWibDates() {
  const nowWib = getJakartaTime();
  const prevWib = new Date(nowWib.getTime() - 24 * 3600 * 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatYMD = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const monthsId = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  const year = nowWib.getFullYear();
  const monthIdx = nowWib.getMonth();
  const monthName = monthsId[monthIdx];
  const nextMonthName = monthsId[(monthIdx + 1) % 12];
  const romanMonth = romanMonths[monthIdx];
  const day = nowWib.getDate();

  return {
    todayStr: formatYMD(nowWib),
    yesterdayStr: formatYMD(prevWib),
    year,
    monthPadded: pad(monthIdx + 1),
    monthName,
    nextMonthName,
    romanMonth,
    day,
    cumDateStr: `${Math.min(28, day + 2)} ${monthName} ${year}`,
    exDateStr: `${Math.min(29, day + 3)} ${monthName} ${year}`,
    recDateStr: `${Math.min(30, day + 4)} ${monthName} ${year}`,
    payDateStr: `20 ${nextMonthName} ${year}`
  };
}

const D = getDynamicWibDates();

export const INITIAL_IDX_ANNOUNCEMENTS: IDXAnnouncement[] = [
  {
    id: `idx-${D.year}-${D.monthPadded}-001`,
    ticker: 'BBCA',
    companyName: 'PT Bank Central Asia Tbk',
    category: 'CORPORATE_ACTION',
    materiality: 'CRITICAL',
    title: `Jadwal dan Tata Cara Pembagian Dividen Interim Tunai Tahun Buku ${D.year}`,
    summary: `Direksi BBCA mengumumkan pembagian Dividen Interim sebesar Rp 55 per lembar saham (total Rp 6,77 Triliun). Cum dividen di Pasar Reguler ditetapkan ${D.cumDateStr}, Pembayaran ${D.payDateStr}.`,
    timestampWIB: `${D.todayStr} 07:14:22`,
    dateStr: D.todayStr,
    timeStr: '07:14:22',
    isPreMarket: true,
    officialRefNo: `089/BBCA/CS/${D.romanMonth}/${D.year}`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-e910f5bb89a24ec0b1c93f0b4d45c11d2',
    tags: ['Dividen Interim', 'Cash Dividend', 'Rp 55/Share', 'Banking'],
    pdfMetadata: {
      companyName: 'PT Bank Central Asia Tbk',
      ticker: 'BBCA',
      isinCode: 'ID1000109507',
      sector: 'Financials',
      subSector: 'Banks',
      officialRegNo: `089/BBCA/CS/${D.romanMonth}/${D.year}`,
      submissionDateWIB: `${D.todayStr} 07:14:22 WIB`,
      publishedDateWIB: `${D.todayStr} 07:15:00 WIB`,
      isPreMarket: true,
      pdfFileName: `BBCA_Pengumuman_Dividen_Interim_${D.year}.pdf`,
      pdfFileSizeKb: 482,
      pdfPages: 4,
      rawDisclaimersStripped: 18,
      keyMetrics: {
        'Nilai Dividen per Saham': 'Rp 55.00',
        'Total Estimasi Pembagian': 'Rp 6.779.023.625.000',
        'Cum Dividen Pasar Reguler': D.cumDateStr,
        'Ex Dividen Pasar Reguler': D.exDateStr,
        'Recording Date (DPS)': `${D.recDateStr} (16:00 WIB)`,
        'Tanggal Pembayaran': D.payDateStr
      },
      extractedSummary: `Berdasarkan Keputusan Direksi yang telah disetujui Dewan Komisaris pada ${D.monthName} ${D.year}, Perseroan melaksanakan pembagian dividen tunai interim untuk tahun buku yang berakhir pada 31 Desember ${D.year}.`,
      cleanedText: `RINGKASAN METADATA BERSIH (PARSED BY BEAUTIFULSOUP & PYPDF):
1. Subjek: Pembagian Dividen Tunai Interim Tahun Buku ${D.year}.
2. Dividen per Saham: Rp 55,00 (lima puluh lima Rupiah).
3. Jadwal Pelaksanaan:
   - Cum Dividen di Pasar Reguler & Negosiasi: ${D.cumDateStr}
   - Ex Dividen di Pasar Reguler & Negosiasi: ${D.exDateStr}
   - Tanggal Pencatatan (Recording Date): ${D.recDateStr}
   - Tanggal Pembayaran Dividen Interim: ${D.payDateStr}
4. Dasar Alokasi: Laba Bersih Q3 ${D.year} sebesar Rp 46,2 Triliun (+12,4% YoY).`
    }
  },
  {
    id: `idx-${D.year}-${D.monthPadded}-002`,
    ticker: 'CUAN',
    companyName: 'PT Petrindo Jaya Kreasi Tbk',
    category: 'SUSPENSION_UMA',
    materiality: 'CRITICAL',
    title: 'Pengumuman Penghentian Sementara Perdagangan Saham (Suspensi) & Penjelasan Volatilitas Transaksi',
    summary: `Bursa Efek Indonesia memutuskan melakukan penghentian sementara (suspensi) perdagangan saham CUAN di Seluruh Pasar mulai Sesi I tanggal ${D.day} ${D.monthName} ${D.year} sehubungan dengan peningkatan harga kumulatif yang signifikan.`,
    timestampWIB: `${D.todayStr} 08:02:10`,
    dateStr: D.todayStr,
    timeStr: '08:02:10',
    isPreMarket: true,
    officialRefNo: `Peng-SPT-00124/BEI.WAS/${D.monthPadded}-${D.year}`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-4c90b6ef22e8d91aa04b12df93f0b4d45',
    tags: ['Suspensi', 'Peng-SPT', 'Cooling Down', 'Mining Energy'],
    pdfMetadata: {
      companyName: 'PT Petrindo Jaya Kreasi Tbk',
      ticker: 'CUAN',
      isinCode: 'ID1000168404',
      sector: 'Energy',
      subSector: 'Oil, Gas & Coal',
      officialRegNo: `Peng-SPT-00124/BEI.WAS/${D.monthPadded}-${D.year}`,
      submissionDateWIB: `${D.todayStr} 08:02:10 WIB`,
      publishedDateWIB: `${D.todayStr} 08:04:15 WIB`,
      isPreMarket: true,
      pdfFileName: `Peng-SPT-00124_BEI_WAS_CUAN_${D.year}.pdf`,
      pdfFileSizeKb: 215,
      pdfPages: 2,
      rawDisclaimersStripped: 14,
      keyMetrics: {
        'Jenis Tindakan Bursa': 'Suspensi Perdagangan Efek',
        'Pasar Terdampak': 'Pasar Reguler & Pasar Tunai',
        'Mulai Berlaku': `Sesi I Perdagangan ${D.day} ${D.monthName} ${D.year}`,
        'Alasan Suspensi': 'Peningkatan Harga Kumulatif Signifikan (Cooling Down)',
        'Divisi Pengawas': 'Divisi Pengawasan Transaksi BEI'
      },
      extractedSummary: `Merujuk pada pengumuman Bursa No. Peng-UMA-00089/BEI.WAS/${D.monthPadded}-${D.year}, BEI memandang perlu melakukan suspensi saham CUAN untuk memberikan waktu memadai bagi pelaku pasar dalam mempertimbangkan keputusan investasi.`,
      cleanedText: `METADATA RESMI BURSA EFEK INDONESIA:
Penghentian Sementara Perdagangan (Suspensi) Efek:
Nama Perusahaan: PT Petrindo Jaya Kreasi Tbk (CUAN)
Mulai: Sesi I Perdagangan Hari Ini (${D.todayStr} Pukul 09.00 WIB)
Tujuan: Cooling down perdagangan dalam rangka perlindungan investor. Para pihak yang berkepentingan diharapkan selalu memperhatikan keterbukaan informasi yang disampaikan perseroan.`
    }
  },
  {
    id: `idx-${D.year}-${D.monthPadded}-003`,
    ticker: 'BREN',
    companyName: 'PT Barito Renewables Energy Tbk',
    category: 'MATERIAL_INFORMATION',
    materiality: 'HIGH',
    title: 'Penjelasan atas Pemberitaan Media & Realisasi Penambahan Kapasitas Pembangkit Panas Bumi Salak Unit 7 & 8',
    summary: `BREN melalui anak usahanya Star Energy Geothermal mengumumkan progres komersialisasi ekspansi kapasitas 104 MW dengan Capex USD 346 Juta. Berkontribusi langsung pada peningkatan EBITDA ${D.year}.`,
    timestampWIB: `${D.todayStr} 07:32:45`,
    dateStr: D.todayStr,
    timeStr: '07:32:45',
    isPreMarket: true,
    officialRefNo: `042/BREN-CORPSEC/${D.romanMonth}/${D.year}`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-7fa29b1399881ec3900b12df93f0b4d45',
    tags: ['Geothermal', 'Capex USD 346M', 'ESG', 'Renewable Energy'],
    pdfMetadata: {
      companyName: 'PT Barito Renewables Energy Tbk',
      ticker: 'BREN',
      isinCode: 'ID1000171200',
      sector: 'Utilities',
      subSector: 'Electric Utilities',
      officialRegNo: `042/BREN-CORPSEC/${D.romanMonth}/${D.year}`,
      submissionDateWIB: `${D.todayStr} 07:32:45 WIB`,
      publishedDateWIB: `${D.todayStr} 07:35:10 WIB`,
      isPreMarket: true,
      pdfFileName: `BREN_Keterbukaan_Informasi_Ekspansi_PanasBumi_${D.year}.pdf`,
      pdfFileSizeKb: 620,
      pdfPages: 6,
      rawDisclaimersStripped: 22,
      keyMetrics: {
        'Kapasitas Tambahan': '104 Megawatt (MW)',
        'Total Realisasi Capex': 'USD 346.000.000',
        'Status Operasional': `Beroperasi Penuh ${D.year}`,
        'Entitas Pelaksana': 'Star Energy Geothermal Salak Pratama Ltd.',
        'PPA dengan PLN': 'Amandemen Kontrak ESC Jangka Panjang 30 Tahun'
      },
      extractedSummary: 'Perseroan menyampaikan penjelasan resmi mengenai penyelesaian tahapan Engineering, Procurement and Construction (EPC) dan sinkronisasi jaringan untuk PLTP Salak Unit 7 dan Unit 8.',
      cleanedText: `METADATA TEKNIS & FINANSIAL (${D.year}):
- Proyek: Salak Binary & Wayang Windu Optimization
- Kontribusi EBITDA Incremental: USD 52 Juta per tahun
- Pembiayaan: 70% Green Loan Facility dari sindikasi perbankan internasional, 30% Kas Internal.`
    }
  },
  {
    id: `idx-${D.year}-${D.monthPadded}-004`,
    ticker: 'BBRI',
    companyName: 'PT Bank Rakyat Indonesia (Persero) Tbk',
    category: 'CORPORATE_ACTION',
    materiality: 'HIGH',
    title: `Keterbukaan Informasi: Realisasi Pelaksanaan Pembelian Kembali Saham (Buyback) Periode ${D.monthName} ${D.year}`,
    summary: 'BBRI telah merealisasikan buyback sebanyak 312,5 Juta lembar saham dengan total serapan dana Rp 1,58 Triliun (harga rata-rata Rp 5.056/saham) untuk program kepemilikan saham pekerja & direksi.',
    timestampWIB: `${D.todayStr} 06:48:19`,
    dateStr: D.todayStr,
    timeStr: '06:48:19',
    isPreMarket: true,
    officialRefNo: `B.102-DIR/CSC/${D.monthPadded}/${D.year}`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-11f87aa945bc11efb1c93f0b4d45c11d2',
    tags: ['Share Buyback', 'Rp 1.58T', 'State-Owned Bank', 'Support Level'],
    pdfMetadata: {
      companyName: 'PT Bank Rakyat Indonesia (Persero) Tbk',
      ticker: 'BBRI',
      isinCode: 'ID1000098304',
      sector: 'Financials',
      subSector: 'Banks',
      officialRegNo: `B.102-DIR/CSC/${D.monthPadded}/${D.year}`,
      submissionDateWIB: `${D.todayStr} 06:48:19 WIB`,
      publishedDateWIB: `${D.todayStr} 06:50:00 WIB`,
      isPreMarket: true,
      pdfFileName: `BBRI_Laporan_Realisasi_Buyback_Saham_${D.year}.pdf`,
      pdfFileSizeKb: 340,
      pdfPages: 3,
      rawDisclaimersStripped: 16,
      keyMetrics: {
        'Jumlah Saham Dibeli Kembali': '312.500.000 Lembar',
        'Harga Rata-rata Pembelian': 'Rp 5.056,40 per lembar',
        'Total Dana Digunakan': 'Rp 1.580.125.000.000',
        'Sisa Plafon Buyback': 'Rp 1.419.875.000.000',
        'Tujuan': 'Program Kepemilikan Saham Karyawan & Direksi (ESOP)'
      },
      extractedSummary: `Laporan realisasi pembelian kembali saham perseroan periode ${D.monthName} ${D.year} dalam rangka pemberian insentif berbasis kinerja berkesinambungan.`,
      cleanedText: `METADATA BUYBACK PERSEROAN:
- Periode Pelaksanaan: 1 ${D.monthName} s.d. ${D.day} ${D.monthName} ${D.year}
- Broker Pelaksana: PT BRI Danareksa Sekuritas (Broker Code: OD)
- Dampak terhadap Likuiditas & CAR: Modal perseroan tetap kuat dengan Capital Adequacy Ratio (CAR) di atas 26,5%, sangat memadai untuk mitigasi risiko kredit.`
    }
  },
  {
    id: `idx-${D.year}-${D.monthPadded}-005`,
    ticker: 'TLKM',
    companyName: 'PT Telkom Indonesia (Persero) Tbk',
    category: 'MATERIAL_INFORMATION',
    materiality: 'MEDIUM',
    title: 'Keterbukaan Informasi Transaksi Afiliasi Konsolidasi Aset Pusat Data (Data Center) ke PT Telkom Data Ekosistem',
    summary: 'TLKM menuntaskan pengalihan hyperscale data center senilai Rp 1,94 Triliun ke NeutraDC sebagai langkah strategis ekspansi kapasitas AI Cloud & Data Center regional.',
    timestampWIB: `${D.todayStr} 07:55:04`,
    dateStr: D.todayStr,
    timeStr: '07:55:04',
    isPreMarket: true,
    officialRefNo: `TEL.88/PR.000/DCI-00/${D.year}`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-88bc110a34fe22efb1c93f0b4d45c11d2',
    tags: ['Data Center', 'NeutraDC', 'Rp 1.94T', 'Telecommunication'],
    pdfMetadata: {
      companyName: 'PT Telkom Indonesia (Persero) Tbk',
      ticker: 'TLKM',
      isinCode: 'ID1000129000',
      sector: 'Telecommunication',
      subSector: 'Integrated Telecommunication Services',
      officialRegNo: `TEL.88/PR.000/DCI-00/${D.year}`,
      submissionDateWIB: `${D.todayStr} 07:55:04 WIB`,
      publishedDateWIB: `${D.todayStr} 07:58:30 WIB`,
      isPreMarket: true,
      pdfFileName: `TLKM_Keterbukaan_Informasi_Konsolidasi_DataCenter_${D.year}.pdf`,
      pdfFileSizeKb: 890,
      pdfPages: 8,
      rawDisclaimersStripped: 31,
      keyMetrics: {
        'Nilai Transaksi': 'Rp 1.942.300.000.000',
        'Kapasitas Terkonsolidasi': '60 Megawatt AI-Ready IT Load',
        'Lokasi Fasilitas': 'Cikarang, Batam, Serpong Hyperscale DC',
        'Valuasi Saham NeutraDC': 'KJPP Rinaldi, Alberth, Baroto & Rekan',
        'Kategori Regulasi': 'Transaksi Afiliasi (POJK 42/POJK.04/2020)'
      },
      extractedSummary: 'Konsolidasi data center merupakan milestone kunci dalam strategi Five Bold Moves TLKM untuk membuka nilai (unlock value) bisnis infrastruktur digital regional.',
      cleanedText: `RINGKASAN AKSI KORPORASI DATA CENTER (${D.year}):
- Transaksi tidak mengandung benturan kepentingan (Conflict of Interest).
- Pendapatan segmen enterprise data center diproyeksikan bertumbuh 24% CAGR.`
    }
  },
  {
    id: `idx-${D.year}-${D.monthPadded}-006`,
    ticker: 'AMMN',
    companyName: 'PT Amman Mineral Internasional Tbk',
    category: 'MATERIAL_INFORMATION',
    materiality: 'HIGH',
    title: 'Laporan Operasional Penuh Smelter Tembaga Sumbawa Barat & Realisasi Ekspor Katoda Tembaga',
    summary: `Smelter tembaga AMMN di Sumbawa Barat mencatatkan utilisasi kapasitas 98,4% pada ${D.monthName} ${D.year} dengan peningkatan volume produksi katoda tembaga dan emas murni (PMR).`,
    timestampWIB: `${D.todayStr} 06:15:30`,
    dateStr: D.todayStr,
    timeStr: '06:15:30',
    isPreMarket: true,
    officialRefNo: `AMMN-EXT/CORP-SEC/${D.year}/${D.monthPadded}/019`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-55fa110022ef44acb1c93f0b4d45c11d2',
    tags: ['Smelter Sumbawa', 'Copper Cathode', 'Gold PMR', 'Mining'],
    pdfMetadata: {
      companyName: 'PT Amman Mineral Internasional Tbk',
      ticker: 'AMMN',
      isinCode: 'ID1000170103',
      sector: 'Basic Materials',
      subSector: 'Metals & Mining',
      officialRegNo: `AMMN-EXT/CORP-SEC/${D.year}/${D.monthPadded}/019`,
      submissionDateWIB: `${D.todayStr} 06:15:30 WIB`,
      publishedDateWIB: `${D.todayStr} 06:18:00 WIB`,
      isPreMarket: true,
      pdfFileName: `AMMN_Update_Operasional_Smelter_${D.year}.pdf`,
      pdfFileSizeKb: 512,
      pdfPages: 5,
      rawDisclaimersStripped: 20,
      keyMetrics: {
        'Tingkat Utilisasi Smelter': '98,4%',
        'Kapasitas Input Konsentrat': '900.000 ton per tahun',
        'Output Katoda Tembaga': '222.000 ton per tahun',
        'Produksi Emas/Perak Murni (PMR)': '18 ton emas, 55 ton perak per tahun',
        'Status Kuota & Ekspor': 'Berjalan Sesuai RKAB Kementerian ESDM'
      },
      extractedSummary: 'Fasilitas PMR (Precious Metals Refinery) dan Smelter Flash Smelting Furnace beroperasi optimal dengan pasokan bijih berkadar tinggi dari Fase 8 Tambang Batu Hijau.',
      cleanedText: `CATATAN TEKNIS OPERASIONAL SMELTER (${D.year}):
- Produksi katoda tembaga LME Grade A dan emas batangan 99,99% telah dikapalkan ke pembeli industri Asia Timur.`
    }
  },
  {
    id: `idx-${D.year}-${D.monthPadded}-007`,
    ticker: 'GOTO',
    companyName: 'PT GoTo Gojek Tokopedia Tbk',
    category: 'FINANCIAL_REPORT',
    materiality: 'MEDIUM',
    title: `Laporan Perkembangan Penggunaan Kas, Posisi Likuiditas & Pertumbuhan EBITDA Grup (${D.year})`,
    summary: 'GOTO melaporkan posisi kas dan setara kas tetap solid sebesar Rp 19,8 Triliun dengan arus kas operasional positif. Pertumbuhan GTV On-Demand Services dan GoTo Financial melampaui konsensus.',
    timestampWIB: `${D.yesterdayStr} 19:42:15`,
    dateStr: D.yesterdayStr,
    timeStr: '19:42:15',
    isPreMarket: false,
    officialRefNo: `GOTO/CORPSEC/${D.year}/${D.monthPadded}-044`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-990a4411eeac1122b1c93f0b4d45c11d2',
    tags: ['Cash Rp 19.8T', 'Positive EBITDA', 'Tech', 'Fintech'],
    pdfMetadata: {
      companyName: 'PT GoTo Gojek Tokopedia Tbk',
      ticker: 'GOTO',
      isinCode: 'ID1000166200',
      sector: 'Technology',
      subSector: 'Software & IT Services',
      officialRegNo: `GOTO/CORPSEC/${D.year}/${D.monthPadded}-044`,
      submissionDateWIB: `${D.yesterdayStr} 19:42:15 WIB`,
      publishedDateWIB: `${D.yesterdayStr} 19:45:00 WIB`,
      isPreMarket: false,
      pdfFileName: `GOTO_Keterbukaan_Posisi_Kas_Q3_${D.year}.pdf`,
      pdfFileSizeKb: 750,
      pdfPages: 7,
      rawDisclaimersStripped: 25,
      keyMetrics: {
        'Kas & Setara Kas': 'Rp 19.800.000.000.000',
        'Realisasi Share Buyback': 'Rp 1,45 Triliun',
        'Pertumbuhan Pinjaman GoTo Financial': '+85% YoY',
        'E-Commerce Service Fee (Tokopedia)': 'Rp 194 Miliar per kuartal'
      },
      extractedSummary: `Perseroan mencatatkan ekspansi margin Adjusted EBITDA positif secara berkelanjutan sepanjang tahun buku ${D.year}.`,
      cleanedText: `RINGKASAN POSISI KEUANGAN GOTO (${D.year}):
- Program pembelian kembali saham (buyback) terus berjalan untuk meningkatkan nilai pemegang saham.
- Sinergi ekosistem GoPay dan aplikasi on-demand meningkatkan frekuensi transaksi pengguna.`
    }
  },
  {
    id: `idx-${D.year}-${D.monthPadded}-008`,
    ticker: 'ASII',
    companyName: 'PT Astra International Tbk',
    category: 'MATERIAL_INFORMATION',
    materiality: 'MEDIUM',
    title: `Laporan Penjualan Kendaraan Bermotor Roda Empat (4W) & Pangsa Pasar Bulanan (${D.monthName} ${D.year})`,
    summary: 'Astra mencatatkan penjualan mobil domestik sebanyak 46.450 unit pada bulan berjalan dengan pangsa pasar mencapai 56,4%. Penjualan kendaraan elektrifikasi (HEV/BEV) tumbuh 38% YoY.',
    timestampWIB: `${D.todayStr} 08:18:40`,
    dateStr: D.todayStr,
    timeStr: '08:18:40',
    isPreMarket: true,
    officialRefNo: `ASII-CS/IDX/${D.romanMonth}/${D.year}/149`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-77881100aaee44acb1c93f0b4d45c11d2',
    tags: ['Automotive Sales', 'Market Share 56.4%', 'HEV/BEV', 'Conglomerate'],
    pdfMetadata: {
      companyName: 'PT Astra International Tbk',
      ticker: 'ASII',
      isinCode: 'ID1000109804',
      sector: 'Industrials',
      subSector: 'Automotive & Components',
      officialRegNo: `ASII-CS/IDX/${D.romanMonth}/${D.year}/149`,
      submissionDateWIB: `${D.todayStr} 08:18:40 WIB`,
      publishedDateWIB: `${D.todayStr} 08:20:00 WIB`,
      isPreMarket: true,
      pdfFileName: `ASII_Laporan_Penjualan_Mobil_${D.monthName}_${D.year}.pdf`,
      pdfFileSizeKb: 310,
      pdfPages: 2,
      rawDisclaimersStripped: 12,
      keyMetrics: {
        'Total Penjualan Astra 4W': '46.450 unit',
        'Pangsa Pasar (Market Share)': '56,4%',
        'Penjualan Toyota & Lexus': '27.120 unit',
        'Penjualan Daihatsu': '15.080 unit',
        'Penjualan EV & Hybrid': '4.250 unit (+38% YoY)'
      },
      extractedSummary: `Data penjualan periode ${D.monthName} ${D.year} mengacu pada laporan Gabungan Industri Kendaraan Bermotor Indonesia (Gaikindo) yang disampaikan kepada OJK dan BEI.`,
      cleanedText: `STATISTIK BULANAN OTOMOTIF ASTRA (${D.year}):
- Permintaan model Hybrid menjadi pendorong utama kestabilan pangsa pasar Astra di atas 56%.`
    }
  },
  {
    id: `idx-${D.year}-${D.monthPadded}-009`,
    ticker: 'PTBA',
    companyName: 'PT Bukit Asam Tbk',
    category: 'CORPORATE_ACTION',
    materiality: 'MEDIUM',
    title: 'Keterbukaan Informasi Peningkatan Kapasitas Angkut Batubara Kereta Api Sumatra & Proyek Hilirisasi',
    summary: `PTBA dan PT Kereta Api Indonesia (KAI) merealisasikan kapasitas angkut batubara relasi Tanjung Enim - Tarahan sebesar 36 Juta ton per tahun pada tahun buku ${D.year}.`,
    timestampWIB: `${D.yesterdayStr} 17:15:10`,
    dateStr: D.yesterdayStr,
    timeStr: '17:15:10',
    isPreMarket: false,
    officialRefNo: `021/EXT-CORPSEC/PTBA/${D.romanMonth}/${D.year}`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-44bb11cc99881ec3900b12df93f0b4d45',
    tags: ['Coal Logistics', 'PT KAI', '36M Tons', 'Mining'],
    pdfMetadata: {
      companyName: 'PT Bukit Asam Tbk',
      ticker: 'PTBA',
      isinCode: 'ID1000094006',
      sector: 'Energy',
      subSector: 'Coal',
      officialRegNo: `021/EXT-CORPSEC/PTBA/${D.romanMonth}/${D.year}`,
      submissionDateWIB: `${D.yesterdayStr} 17:15:10 WIB`,
      publishedDateWIB: `${D.yesterdayStr} 17:18:00 WIB`,
      isPreMarket: false,
      pdfFileName: `PTBA_Kerjasama_Logistik_Batubara_KAI_${D.year}.pdf`,
      pdfFileSizeKb: 430,
      pdfPages: 4,
      rawDisclaimersStripped: 15,
      keyMetrics: {
        'Kapasitas Angkut Realisasi': '36 Juta Ton/Tahun',
        'Rute Utama': 'Tanjung Enim ke Pelabuhan Tarahan Lampung',
        'Investasi Jalur Rel Ganda': 'Dikelola oleh PT KAI',
        'Estimasi Efisiensi Biaya': 'Penghematan freight cost 6,8% per ton'
      },
      extractedSummary: 'Sinergi BUMN antara PTBA dan KAI mengamankan pasokan batubara bagi Pembangkit Listrik PLN dan pasar ekspor Asia.',
      cleanedText: `RINGKASAN OPERASIONAL (${D.year}):
- Menjamin pencapaian target volume penjualan batubara tahun ${D.year} di kisaran 45-47 juta ton.`
    }
  },
  {
    id: `idx-${D.year}-${D.monthPadded}-010`,
    ticker: 'BMRI',
    companyName: 'PT Bank Mandiri (Persero) Tbk',
    category: 'RUPS_PUBLIC_EXPOSE',
    materiality: 'INFORMATIONAL',
    title: `Materi Paparan Publik Terbuka (Public Expose Live) & Kinerja Konsolidasi Triwulan III ${D.year}`,
    summary: `Bank Mandiri merilis materi paparan publik ${D.year} yang mencatatkan pertumbuhan kredit konsolidasi sebesar 16,8% YoY dengan rasio NPL gross terkendali di 0,98%.`,
    timestampWIB: `${D.todayStr} 08:31:05`,
    dateStr: D.todayStr,
    timeStr: '08:31:05',
    isPreMarket: true,
    officialRefNo: `CORP.SEC/PUBEX/BMRI/${D.monthPadded}/${D.year}`,
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-33aa99bb11eeac1122b1c93f0b4d45c11d2',
    tags: ['Public Expose', 'Credit Growth 16.8%', 'NPL 0.98%', 'Banking'],
    pdfMetadata: {
      companyName: 'PT Bank Mandiri (Persero) Tbk',
      ticker: 'BMRI',
      isinCode: 'ID1000095003',
      sector: 'Financials',
      subSector: 'Banks',
      officialRegNo: `CORP.SEC/PUBEX/BMRI/${D.monthPadded}/${D.year}`,
      submissionDateWIB: `${D.todayStr} 08:31:05 WIB`,
      publishedDateWIB: `${D.todayStr} 08:33:00 WIB`,
      isPreMarket: true,
      pdfFileName: `BMRI_Materi_Public_Expose_Live_Q3_${D.year}.pdf`,
      pdfFileSizeKb: 2450,
      pdfPages: 28,
      rawDisclaimersStripped: 42,
      keyMetrics: {
        'Pertumbuhan Kredit Konsolidasi': '16,8% YoY',
        'NPL Gross Konsolidasi': '0,98%',
        'NIM (Net Interest Margin)': '5,28%',
        'CASA Ratio': '80,2%',
        'Pengguna Livin by Mandiri': '31,4 Juta User'
      },
      extractedSummary: `Paparan lengkap capaian operasional tahun ${D.year} dan strategi digital banking Livin dan Kopra by Mandiri dalam mendukung profitabilitas berkelanjutan.`,
      cleanedText: `RINGKASAN PAPARAN EKSEKUTIF (${D.year}):
- Penyaluran kredit korporasi dan komersial terus menjadi motor utama pertumbuhan.
- Pencadangan NPL coverage mencapai 315%, salah satu yang tertinggi di industri perbankan ASEAN.`
    }
  }
];

export const DEFAULT_ALERT_PREFERENCES: AlertPreferences = {
  frequency: 'PRE_MARKET_DIGEST_0830',
  enableMobilePush: true,
  enableBrowserNotifications: true,
  enableTelegramWebhook: false,
  telegramChatId: '@idx_investor_preopen',
  fcmDeviceToken: 'fcm_token_samsung_s26_ultra_id_89412',
  minMateriality: 'MEDIUM',
  watchlistOnly: false,
  watchlistTickers: ['BBCA', 'BBRI', 'BREN', 'TLKM', 'AMMN', 'CUAN'],
  alertCategories: {
    CORPORATE_ACTION: true,
    SUSPENSION_UMA: true,
    FINANCIAL_REPORT: true,
    RUPS_PUBLIC_EXPOSE: false,
    MATERIAL_INFORMATION: true,
    INSIDER_TRANSACTION: true
  },
  soundAlert: true,
  vibrationPattern: true,
  preMarketDigestTime: '08:30'
};
