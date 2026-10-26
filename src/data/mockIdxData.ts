import { IDXAnnouncement, AlertPreferences } from '../types';

export const INITIAL_IDX_ANNOUNCEMENTS: IDXAnnouncement[] = [
  {
    id: 'idx-2024-10-001',
    ticker: 'BBCA',
    companyName: 'PT Bank Central Asia Tbk',
    category: 'CORPORATE_ACTION',
    materiality: 'CRITICAL',
    title: 'Jadwal dan Tata Cara Pembagian Dividen Interim Tunai Tahun Buku 2024',
    summary: 'Direksi BBCA mengumumkan pembagian Dividen Interim sebesar Rp 50 per lembar saham (total Rp 6,16 Triliun). Cum dividen di Pasar Reguler ditetapkan 28 Oktober 2024, Pembayaran 20 November 2024.',
    timestampWIB: '2024-10-25 07:14:22',
    dateStr: '2024-10-25',
    timeStr: '07:14:22',
    isPreMarket: true,
    officialRefNo: '089/BBCA/CS/X/2024',
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-e910f5bb89a24ec0b1c93f0b4d45c11d2',
    tags: ['Dividen Interim', 'Cash Dividend', 'Rp 50/Share', 'Banking'],
    pdfMetadata: {
      companyName: 'PT Bank Central Asia Tbk',
      ticker: 'BBCA',
      isinCode: 'ID1000109507',
      sector: 'Financials',
      subSector: 'Banks',
      officialRegNo: '089/BBCA/CS/X/2024',
      submissionDateWIB: '2024-10-25 07:14:22 WIB',
      publishedDateWIB: '2024-10-25 07:15:00 WIB',
      isPreMarket: true,
      pdfFileName: 'BBCA_Pengumuman_Dividen_Interim_2024.pdf',
      pdfFileSizeKb: 482,
      pdfPages: 4,
      rawDisclaimersStripped: 18,
      keyMetrics: {
        'Nilai Dividen per Saham': 'Rp 50.00',
        'Total Estimasi Pembagian': 'Rp 6.162.748.750.000',
        'Cum Dividen Pasar Reguler': '28 Oktober 2024',
        'Ex Dividen Pasar Reguler': '29 Oktober 2024',
        'Recording Date (DPS)': '30 Oktober 2024 (16:00 WIB)',
        'Tanggal Pembayaran': '20 November 2024'
      },
      extractedSummary: 'Berdasarkan Keputusan Direksi yang telah disetujui Dewan Komisaris tertanggal 24 Oktober 2024, Perseroan akan melaksanakan pembagian dividen tunai interim untuk tahun buku yang berakhir pada tanggal 31 Desember 2024.',
      cleanedText: `RINGKASAN METADATA BERSIH (PARSED BY BEAUTIFULSOUP & PYPDF):
1. Subjek: Pembagian Dividen Tunai Interim Tahun Buku 2024.
2. Dividen per Saham: Rp 50,00 (lima puluh Rupiah).
3. Jadwal Pelaksanaan:
   - Cum Dividen di Pasar Reguler & Negosiasi: 28 Okt 2024
   - Ex Dividen di Pasar Reguler & Negosiasi: 29 Okt 2024
   - Cum Dividen di Pasar Tunai: 30 Okt 2024
   - Ex Dividen di Pasar Tunai: 31 Okt 2024
   - Tanggal Pencatatan (Recording Date): 30 Okt 2024
   - Tanggal Pembayaran Dividen Interim: 20 Nov 2024
4. Dasar Alokasi: Laba Bersih Q3 2024 sebesar Rp 41,1 Triliun (+12,8% YoY).`
    }
  },
  {
    id: 'idx-2024-10-002',
    ticker: 'CUAN',
    companyName: 'PT Petrindo Jaya Kreasi Tbk',
    category: 'SUSPENSION_UMA',
    materiality: 'CRITICAL',
    title: 'Pengumuman Penghentian Sementara Perdagangan Saham (Suspensi) & Penjelasan Volatilitas Transaksi',
    summary: 'Bursa Efek Indonesia memutuskan melakukan penghentian sementara (suspensi) perdagangan saham CUAN di Seluruh Pasar mulai Sesi I tanggal 25 Oktober 2024 sehubungan dengan peningkatan harga kumulatif yang signifikan.',
    timestampWIB: '2024-10-25 08:02:10',
    dateStr: '2024-10-25',
    timeStr: '08:02:10',
    isPreMarket: true,
    officialRefNo: 'Peng-SPT-00124/BEI.WAS/10-2024',
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
      officialRegNo: 'Peng-SPT-00124/BEI.WAS/10-2024',
      submissionDateWIB: '2024-10-25 08:02:10 WIB',
      publishedDateWIB: '2024-10-25 08:04:15 WIB',
      isPreMarket: true,
      pdfFileName: 'Peng-SPT-00124_BEI_WAS_CUAN.pdf',
      pdfFileSizeKb: 215,
      pdfPages: 2,
      rawDisclaimersStripped: 14,
      keyMetrics: {
        'Jenis Tindakan Bursa': 'Suspensi Perdagangan Efek',
        'Pasar Terdampak': 'Pasar Reguler & Pasar Tunai',
        'Mulai Berlaku': 'Sesi I Perdagangan 25 Oktober 2024',
        'Alasan Suspensi': 'Peningkatan Harga Kumulatif Signifikan (Cooling Down)',
        'Divisi Pengawas': 'Divisi Pengawasan Transaksi BEI'
      },
      extractedSummary: 'Merujuk pada pengumuman Bursa No. Peng-UMA-00089/BEI.WAS/10-2024, BEI memandang perlu melakukan suspensi saham CUAN untuk memberikan waktu memadai bagi pelaku pasar dalam mempertimbangkan keputusan investasi.',
      cleanedText: `METADATA RESMI BURSA EFEK INDONESIA:
Penghentian Sementara Perdagangan (Suspensi) Efek:
Nama Perusahaan: PT Petrindo Jaya Kreasi Tbk (CUAN)
Mulai: Sesi I Perdagangan Hari Ini (Pukul 09.00 WIB)
Tujuan: Cooling down perdagangan dalam rangka perlindungan investor. Para pihak yang berkepentingan diharapkan selalu memperhatikan keterbukaan informasi yang disampaikan perseroan.`
    }
  },
  {
    id: 'idx-2024-10-003',
    ticker: 'BREN',
    companyName: 'PT Barito Renewables Energy Tbk',
    category: 'MATERIAL_INFORMATION',
    materiality: 'HIGH',
    title: 'Penjelasan atas Pemberitaan Media & Realisasi Penambahan Kapasitas Pembangkit Panas Bumi Salak Unit 7 & 8',
    summary: 'BREN melalui anak usahanya Star Energy Geothermal mengumumkan finalisasi ekspansi kapasitas 104 MW dengan estimasi Capex USD 346 Juta. Target COD dipercepat menjadi Q4 2025.',
    timestampWIB: '2024-10-25 07:32:45',
    dateStr: '2024-10-25',
    timeStr: '07:32:45',
    isPreMarket: true,
    officialRefNo: '042/BREN-CORPSEC/X/2024',
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
      officialRegNo: '042/BREN-CORPSEC/X/2024',
      submissionDateWIB: '2024-10-25 07:32:45 WIB',
      publishedDateWIB: '2024-10-25 07:35:10 WIB',
      isPreMarket: true,
      pdfFileName: 'BREN_Keterbukaan_Informasi_Ekspansi_PanasBumi.pdf',
      pdfFileSizeKb: 620,
      pdfPages: 6,
      rawDisclaimersStripped: 22,
      keyMetrics: {
        'Kapasitas Tambahan': '104 Megawatt (MW)',
        'Estimasi Total Capex': 'USD 346.000.000',
        'Target Commercial Operation (COD)': 'Q4 2025',
        'Entitas Pelaksana': 'Star Energy Geothermal Salak Pratama Ltd.',
        'PPA dengan PLN': 'Amandemen Kontrak ESC Jangka Panjang 30 Tahun'
      },
      extractedSummary: 'Perseroan menyampaikan penjelasan resmi mengenai penandatanganan kontrak Engineering, Procurement and Construction (EPC) untuk pengembangan PLTP Salak Unit 7 dan Unit 8.',
      cleanedText: `METADATA TEKNIS & FINANSIAL:
- Proyek: Salak Binary & Wayang Windu Optimization
- Potensi EBITDA Incremental: USD 52 Juta per tahun pasca operasional
- Pembiayaan: 70% Green Loan Facility dari sindikasi perbankan internasional, 30% Kas Internal.`
    }
  },
  {
    id: 'idx-2024-10-004',
    ticker: 'BBRI',
    companyName: 'PT Bank Rakyat Indonesia (Persero) Tbk',
    category: 'CORPORATE_ACTION',
    materiality: 'HIGH',
    title: 'Keterbukaan Informasi: Realisasi Pelaksanaan Pembelian Kembali Saham (Buyback) Tahap II',
    summary: 'BBRI telah merealisasikan buyback sebanyak 312,5 Juta lembar saham dengan total serapan dana Rp 1,58 Triliun (harga rata-rata Rp 5.056/saham) yang dialokasikan untuk program insentif kepemilikan saham pekerja.',
    timestampWIB: '2024-10-25 06:48:19',
    dateStr: '2024-10-25',
    timeStr: '06:48:19',
    isPreMarket: true,
    officialRefNo: 'B.102-DIR/CSC/10/2024',
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
      officialRegNo: 'B.102-DIR/CSC/10/2024',
      submissionDateWIB: '2024-10-25 06:48:19 WIB',
      publishedDateWIB: '2024-10-25 06:50:00 WIB',
      isPreMarket: true,
      pdfFileName: 'BBRI_Laporan_Realisasi_Buyback_Saham.pdf',
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
      extractedSummary: 'Laporan realisasi pembelian kembali saham perseroan yang dilakukan sesuai persetujuan RUPST tanggal 13 Maret 2024 dalam rangka pemberian insentif berkesinambungan.',
      cleanedText: `METADATA BUYBACK PERSEROAN:
- Periode Pembelian: 1 Oktober s.d. 24 Oktober 2024
- Broker Pelaksana: PT BRI Danareksa Sekuritas (Broker Code: OD)
- Dampak terhadap Likuiditas & CAR: Modal perseroan tetap kuat dengan Capital Adequacy Ratio (CAR) di atas 26,5%, sangat memadai untuk mitigasi risiko kredit.`
    }
  },
  {
    id: 'idx-2024-10-005',
    ticker: 'TLKM',
    companyName: 'PT Telkom Indonesia (Persero) Tbk',
    category: 'MATERIAL_INFORMATION',
    materiality: 'MEDIUM',
    title: 'Keterbukaan Informasi Transaksi Afiliasi Konsolidasi Aset Pusat Data (Data Center) ke PT Telkom Data Ekosistem',
    summary: 'TLKM menuntaskan pengalihan hyperscale data center senilai Rp 1,94 Triliun ke NeutraDC sebagai langkah strategis mendahului rencana kemitraan strategis (strategic partnership) global.',
    timestampWIB: '2024-10-25 07:55:04',
    dateStr: '2024-10-25',
    timeStr: '07:55:04',
    isPreMarket: true,
    officialRefNo: 'TEL.88/PR.000/DCI-00/2024',
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
      officialRegNo: 'TEL.88/PR.000/DCI-00/2024',
      submissionDateWIB: '2024-10-25 07:55:04 WIB',
      publishedDateWIB: '2024-10-25 07:58:30 WIB',
      isPreMarket: true,
      pdfFileName: 'TLKM_Keterbukaan_Informasi_Konsolidasi_DataCenter.pdf',
      pdfFileSizeKb: 890,
      pdfPages: 8,
      rawDisclaimersStripped: 31,
      keyMetrics: {
        'Nilai Transaksi': 'Rp 1.942.300.000.000',
        'Kapasitas Terkonsolidasi': '42 Megawatt IT Load',
        'Lokasi Fasilitas': 'Cikarang, Batam, Serpong Hyperscale DC',
        'Valuasi Saham NeutraDC': 'Menggunakan KJPP Rinaldi, Alberth, Baroto & Rekan',
        'Kategori Regulasi': 'Transaksi Afiliasi (POJK 42/POJK.04/2020)'
      },
      extractedSummary: 'Konsolidasi data center merupakan milestone kunci dalam strategi Five Bold Moves TLKM untuk membuka nilai (unlock value) bisnis infrastruktur digital dan menarik mitra teknologi skala dunia.',
      cleanedText: `RINGKASAN AKSI KORPORASI DATA CENTER:
- Transaksi tidak mengandung benturan kepentingan (Conflict of Interest).
- Pendapatan segmen enterprise data center diproyeksikan bertumbuh 22% CAGR dalam 3 tahun ke depan.`
    }
  },
  {
    id: 'idx-2024-10-006',
    ticker: 'AMMN',
    companyName: 'PT Amman Mineral Internasional Tbk',
    category: 'MATERIAL_INFORMATION',
    materiality: 'HIGH',
    title: 'Perkembangan Uji Coba Komersial (Commissioning) Smelter Tembaga dan Pemenuhan Rekomendasi Ekspor Konsentrat',
    summary: 'Smelter tembang AMMN di Sumbawa Barat telah mencapai 96,8% kesiapan operasional dengan produksi katoda tembaga perdana dijadwalkan November 2024. Telah memperoleh persetujuan perpanjangan izin ekspor.',
    timestampWIB: '2024-10-25 06:15:30',
    dateStr: '2024-10-25',
    timeStr: '06:15:30',
    isPreMarket: true,
    officialRefNo: 'AMMN-EXT/CORP-SEC/24/10/019',
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-55fa110022ef44acb1c93f0b4d45c11d2',
    tags: ['Smelter Sumbawa', 'Copper Cathode', 'Export License', 'Mining'],
    pdfMetadata: {
      companyName: 'PT Amman Mineral Internasional Tbk',
      ticker: 'AMMN',
      isinCode: 'ID1000170103',
      sector: 'Basic Materials',
      subSector: 'Metals & Mining',
      officialRegNo: 'AMMN-EXT/CORP-SEC/24/10/019',
      submissionDateWIB: '2024-10-25 06:15:30 WIB',
      publishedDateWIB: '2024-10-25 06:18:00 WIB',
      isPreMarket: true,
      pdfFileName: 'AMMN_Update_Commissioning_Smelter.pdf',
      pdfFileSizeKb: 512,
      pdfPages: 5,
      rawDisclaimersStripped: 20,
      keyMetrics: {
        'Progres Fisik Smelter': '96,8%',
        'Kapasitas Input Konsentrat': '900.000 ton per tahun',
        'Output Katoda Tembaga': '222.000 ton per tahun',
        'Produksi Emas/Perak Murni (PMR)': '18 ton emas, 55 ton perak per tahun',
        'Status Rekomendasi Ekspor': 'Disetujui Kementerian ESDM & Kemendag'
      },
      extractedSummary: 'Fasilitas PMR (Precious Metals Refinery) dan Smelter Flash Smelting Furnace telah memasuki tahap hot commissioning dengan pasokan konsentrat dari Tambang Batu Hijau.',
      cleanedText: `CATATAN TEKNIS KOMISI SMELTER:
- Fasilitas oxygen plant dan sulfuric acid plant telah beroperasi penuh dan siap menyerap gas buang SO2 menjadi pupuk & bahan kimia industri.`
    }
  },
  {
    id: 'idx-2024-10-007',
    ticker: 'GOTO',
    companyName: 'PT GoTo Gojek Tokopedia Tbk',
    category: 'FINANCIAL_REPORT',
    materiality: 'MEDIUM',
    title: 'Laporan Perkembangan Penggunaan Kas, Posisi Likuiditas & EBITDA Grup yang Disesuaikan (Adjusted EBITDA)',
    summary: 'GOTO melaporkan posisi kas dan setara kas per September 2024 tetap kuat sebesar Rp 21,2 Triliun tanpa utang berbunga jangka panjang. Pertumbuhan GTV On-Demand Services dan Financial Services melampaui estimasi konsensus.',
    timestampWIB: '2024-10-24 19:42:15',
    dateStr: '2024-10-24',
    timeStr: '19:42:15',
    isPreMarket: false,
    officialRefNo: 'GOTO/CORPSEC/2024/10-044',
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-990a4411eeac1122b1c93f0b4d45c11d2',
    tags: ['Cash Rp 21.2T', 'Adjusted EBITDA', 'Tech', 'Fintech'],
    pdfMetadata: {
      companyName: 'PT GoTo Gojek Tokopedia Tbk',
      ticker: 'GOTO',
      isinCode: 'ID1000166200',
      sector: 'Technology',
      subSector: 'Software & IT Services',
      officialRegNo: 'GOTO/CORPSEC/2024/10-044',
      submissionDateWIB: '2024-10-24 19:42:15 WIB',
      publishedDateWIB: '2024-10-24 19:45:00 WIB',
      isPreMarket: false,
      pdfFileName: 'GOTO_Keterbukaan_Posisi_Kas_Q3_2024.pdf',
      pdfFileSizeKb: 750,
      pdfPages: 7,
      rawDisclaimersStripped: 25,
      keyMetrics: {
        'Kas & Setara Kas': 'Rp 21.200.000.000.000',
        'Utang Berbunga Jangka Panjang': 'Rp 0',
        'Pertumbuhan Pinjaman GoTo Financial': '+145% YoY',
        'E-Commerce Service Fee (Tokopedia)': 'Rp 172 Miliar per kuartal'
      },
      extractedSummary: 'Perseroan berada di jalur yang tepat untuk mempertahankan titik impas (breakeven) Adjusted EBITDA sepanjang tahun buku 2024.',
      cleanedText: `RINGKASAN POSISI KEUANGAN GOTO:
- Tidak ada kebutuhan penambahan modal ekuitas dalam 12 bulan mendatang.
- Tingkat burn-rate operasional terus ditekan berkat efisiensi integrasi aplikasi dengan ekosistem ShopTokopedia.`
    }
  },
  {
    id: 'idx-2024-10-008',
    ticker: 'ASII',
    companyName: 'PT Astra International Tbk',
    category: 'MATERIAL_INFORMATION',
    materiality: 'MEDIUM',
    title: 'Laporan Penjualan Kendaraan Bermotor Roda Empat (4W) & Perkembangan Pangsa Pasar (Market Share) Bulanan',
    summary: 'Astra mencatatkan penjualan mobil domestik sebanyak 44.120 unit pada bulan lalu dengan pangsa pasar mencapai 56%. Penjualan lini kendaraan ramah lingkungan (HEV/BEV) naik 42% YoY.',
    timestampWIB: '2024-10-25 08:18:40',
    dateStr: '2024-10-25',
    timeStr: '08:18:40',
    isPreMarket: true,
    officialRefNo: 'ASII-CS/IDX/X/2024/149',
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-77881100aaee44acb1c93f0b4d45c11d2',
    tags: ['Automotive Sales', 'Market Share 56%', 'HEV/BEV', 'Conglomerate'],
    pdfMetadata: {
      companyName: 'PT Astra International Tbk',
      ticker: 'ASII',
      isinCode: 'ID1000109804',
      sector: 'Industrials',
      subSector: 'Automotive & Components',
      officialRegNo: 'ASII-CS/IDX/X/2024/149',
      submissionDateWIB: '2024-10-25 08:18:40 WIB',
      publishedDateWIB: '2024-10-25 08:20:00 WIB',
      isPreMarket: true,
      pdfFileName: 'ASII_Laporan_Penjualan_Mobil_Bulanan.pdf',
      pdfFileSizeKb: 310,
      pdfPages: 2,
      rawDisclaimersStripped: 12,
      keyMetrics: {
        'Total Penjualan Astra 4W': '44.120 unit',
        'Pangsa Pasar (Market Share)': '56,1%',
        'Penjualan Toyota & Lexus': '25.980 unit',
        'Penjualan Daihatsu': '14.230 unit',
        'Penjualan EV & Hybrid': '3.410 unit (+42% YoY)'
      },
      extractedSummary: 'Data penjualan mengacu pada laporan Gabungan Industri Kendaraan Bermotor Indonesia (Gaikindo) yang disampaikan secara berkala kepada Otoritas Jasa Keuangan (OJK) dan BEI.',
      cleanedText: `STATISTIK BULANAN OTOMOTIF ASTRA:
- Permintaan model Hybrid (Innova Zenix & Yaris Cross) menjadi pendorong utama kestabilan pangsa pasar di tengah persaingan merk baru.`
    }
  },
  {
    id: 'idx-2024-10-009',
    ticker: 'PTBA',
    companyName: 'PT Bukit Asam Tbk',
    category: 'CORPORATE_ACTION',
    materiality: 'MEDIUM',
    title: 'Keterbukaan Informasi Rencana Pembangunan PLTS Pasca Tambang & Kerja Sama Pengangkutan Kereta Api Sumatra',
    summary: 'PTBA dan PT Kereta Api Indonesia (KAI) menyepakati peningkatan kapasitas angkut batubara relasi Tanjung Enim - Tarahan menjadi 32 Juta ton per tahun mulai Q1 2025.',
    timestampWIB: '2024-10-24 17:15:10',
    dateStr: '2024-10-24',
    timeStr: '17:15:10',
    isPreMarket: false,
    officialRefNo: '021/EXT-CORPSEC/PTBA/X/2024',
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-44bb11cc99881ec3900b12df93f0b4d45',
    tags: ['Coal Logistics', 'PT KAI', 'PLTS Pasca Tambang', 'Mining'],
    pdfMetadata: {
      companyName: 'PT Bukit Asam Tbk',
      ticker: 'PTBA',
      isinCode: 'ID1000094006',
      sector: 'Energy',
      subSector: 'Coal',
      officialRegNo: '021/EXT-CORPSEC/PTBA/X/2024',
      submissionDateWIB: '2024-10-24 17:15:10 WIB',
      publishedDateWIB: '2024-10-24 17:18:00 WIB',
      isPreMarket: false,
      pdfFileName: 'PTBA_Kerjasama_Logistik_Batubara_KAI.pdf',
      pdfFileSizeKb: 430,
      pdfPages: 4,
      rawDisclaimersStripped: 15,
      keyMetrics: {
        'Kapasitas Angkut Baru': '32 Juta Ton/Tahun',
        'Rute Utama': 'Tanjung Enim ke Pelabuhan Tarahan Lampung',
        'Investasi Jalur Rel Ganda': 'Dikelola oleh PT KAI',
        'Estimasi Efisiensi Biaya': 'Penghematan freight cost 6,5% per ton'
      },
      extractedSummary: 'Sinergi BUMN antara PTBA dan KAI untuk mengamankan pasokan batubara bagi Pembangkit Listrik PLN dan pasar ekspor premium Asia Timur.',
      cleanedText: `RINGKASAN OPERASIONAL:
- Mengurangi hambatan bottleneck jalur transportasi darat di Sumatra Selatan.
- Menjamin pencapaian target produksi batubara tahun 2025 di kisaran 43-45 juta ton.`
    }
  },
  {
    id: 'idx-2024-10-010',
    ticker: 'BMRI',
    companyName: 'PT Bank Mandiri (Persero) Tbk',
    category: 'RUPS_PUBLIC_EXPOSE',
    materiality: 'INFORMATIONAL',
    title: 'Materi Paparan Publik Terbuka (Public Expose Live) & Paparan Kinerja Triwulan III 2024',
    summary: 'Bank Mandiri merilis materi paparan publik yang memproyeksikan pertumbuhan kredit konsolidasi di rentang 16-18% YoY dengan rasio NPL gross terkendali di bawah 1,02%.',
    timestampWIB: '2024-10-25 08:31:05',
    dateStr: '2024-10-25',
    timeStr: '08:31:05',
    isPreMarket: true,
    officialRefNo: 'CORP.SEC/PUBEX/BMRI/10/24',
    idxUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
    crossCheckVerified: true,
    idxHash: 'sha256-33aa99bb11eeac1122b1c93f0b4d45c11d2',
    tags: ['Public Expose', 'Credit Growth 16-18%', 'NPL 1.02%', 'Banking'],
    pdfMetadata: {
      companyName: 'PT Bank Mandiri (Persero) Tbk',
      ticker: 'BMRI',
      isinCode: 'ID1000095003',
      sector: 'Financials',
      subSector: 'Banks',
      officialRegNo: 'CORP.SEC/PUBEX/BMRI/10/24',
      submissionDateWIB: '2024-10-25 08:31:05 WIB',
      publishedDateWIB: '2024-10-25 08:33:00 WIB',
      isPreMarket: true,
      pdfFileName: 'BMRI_Materi_Public_Expose_Live_Q3_2024.pdf',
      pdfFileSizeKb: 2450,
      pdfPages: 28,
      rawDisclaimersStripped: 42,
      keyMetrics: {
        'Pertumbuhan Kredit Konsolidasi': '16,3% YoY',
        'NPL Gross Konsolidasi': '1,01%',
        'NIM (Net Interest Margin)': '5,25%',
        'CASA Ratio': '79,4%',
        'Pengguna Livin by Mandiri': '27,6 Juta User'
      },
      extractedSummary: 'Paparan lengkap capaian operasional dan strategi digital banking Livin dan Kopra by Mandiri dalam mendukung profitabilitas berkelanjutan.',
      cleanedText: `RINGKASAN PAPARAN EKSEKUTIF:
- Penyaluran kredit korporasi dan komersial terus menjadi motor utama.
- Pencadangan NPL coverage mencapai 320%, salah satu yang tertinggi di industri perbankan ASEAN.`
    }
  }
];

export const DEFAULT_ALERT_PREFERENCES: AlertPreferences = {
  frequency: 'PRE_MARKET_DIGEST_0830',
  enableMobilePush: true,
  enableBrowserNotifications: true,
  enableTelegramWebhook: false,
  telegramChatId: '@idx_investor_preopen',
  fcmDeviceToken: 'fcm_token_samsung_s24_ultra_id_89412',
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
