function doPost(e) {
  try {
    // **PENTING: Ganti 'Sheet1' dengan nama sheet Anda yang sebenarnya**
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('pembelian'); 

    // Periksa apakah sheet ditemukan
    if (!sheet) {
      throw new Error('Sheet "Sheet1" not found. Please ensure the sheet name in Apps Script matches your Google Sheet.');
    }

    // Parse data yang diterima dari request POST
    const data = JSON.parse(e.postData.contents);

    // Dapatkan metode pembayaran dari data yang dikirim oleh client
    // Jika tidak ada, default ke 'Transfer Bank'
    const paymentMethod = data.metode_pembayaran || 'Transfer Bank'; 
    
    // Tentukan status awal berdasarkan metode pembayaran
    let statusPesanan = "Menunggu Pembayaran"; // Default untuk Transfer Bank
    if (paymentMethod === "COD") {
      statusPesanan = "Pesanan Dikonfirmasi (COD)"; // Status berbeda untuk COD
    }

    // Siapkan data untuk ditulis ke sheet
    const timestamp = new Date();
    const rowData = [
      timestamp,                                // Kolom 1: Timestamp
      data.nama || '',                          // Kolom 2: Nama
      data.alamat || '',                        // Kolom 3: Alamat
      data.email || '',                         // Kolom 4: Email
      data.no_hp || '',                         // Kolom 5: No HP
      data.produk || '',                        // Kolom 6: Produk
      data.total || 0,                          // Kolom 7: Total (simpan sebagai angka, biarkan Google Sheets memformat mata uang)
      statusPesanan,                            // Kolom 8: Status (dinamis berdasarkan metode pembayaran)
      "PANG2 STORE",                            // Kolom 9: Pengirim
      paymentMethod                             // Kolom 10: Metode Pembayaran (dinamis dari client)
    ];

    // Tambahkan data ke baris baru di sheet
    sheet.appendRow(rowData);

    // Kirim respons sukses
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data berhasil disimpan',
      orderId: 'ORD-' + timestamp.getTime() // ID pesanan sederhana
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Tangani error dan kirim respons error
    Logger.log("Error in doPost: " + error.toString()); // Log error untuk debugging di Apps Script
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Terjadi kesalahan pada server: ' + error.message // Pesan error lebih spesifik
    })).setMimeType(ContentService.MimeType.JSON);
  }
}