import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import { ITransaction } from '@/interfaces/ITransaction';

const ReportExportService = {
    generatePDF: async (data: any[], filters: any) => {
        const title = `Laporan ${filters.reportType} - ${filters.branch?.branch_name || 'Semua Cabang'}`;
        const period = `${filters.dateFrom} s/d ${filters.dateTo}`;
        
        let tableHeader = '';
        let tableRows = '';
        let totalRevenue = 0;

        if (filters.reportType === 'Summary') {
            tableHeader = `
                <tr>
                    <th>No</th>
                    <th>Cabang</th>
                    <th>Kendaraan</th>
                    <th>Metode Bayar</th>
                    <th>Tanggal</th>
                    <th style="text-align: center;">Jumlah Trx</th>
                    <th style="text-align: right;">Total Bersih (Rp)</th>
                </tr>
            `;
            data.forEach((item, index) => {
                totalRevenue += Number(item.total_net);
                tableRows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.branch_name}</td>
                        <td>${item.vehicle_type_name}</td>
                        <td>${item.payment_method_name}</td>
                        <td>${item.transaction_dt}</td>
                        <td style="text-align: center;">${item.total_transactions}</td>
                        <td style="text-align: right;">${Number(item.total_net).toLocaleString('id-ID')}</td>
                    </tr>
                `;
            });
        } else {
            tableHeader = `
                <tr>
                    <th>No</th>
                    <th>No. Trx</th>
                    <th>Tanggal</th>
                    <th>No. Polisi</th>
                    <th>Kendaraan</th>
                    <th>Layanan</th>
                    <th>Bayar</th>
                    <th style="text-align: right;">Total Bersih (Rp)</th>
                </tr>
            `;
            data.forEach((trx: ITransaction, index) => {
                totalRevenue += trx.net_total;
                const services = trx.transaction_services?.map(s => s.service_type?.service_type_name).join(', ') || '-';
                
                tableRows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${trx.transaction_number}</td>
                        <td>${trx.transaction_dt}</td>
                        <td>${trx.plate_number}</td>
                        <td>${trx.vehicle_type?.vehicle_type_name}</td>
                        <td>${services}</td>
                        <td>${trx.payment_method?.payment_method_name}</td>
                        <td style="text-align: right;">${trx.net_total.toLocaleString('id-ID')}</td>
                    </tr>
                `;
            });
        }

        const html = `
            <html>
            <head>
                <style>
                    @page { size: letter; margin: 20mm; }
                    body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 20px; color: #333; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #D16224; padding-bottom: 10px; }
                    .header h1 { margin: 0; color: #D16224; text-transform: uppercase; }
                    .header p { margin: 5px 0; font-size: 14px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
                    th { background-color: #f2f2f2; border: 1px solid #ddd; padding: 10px; text-align: left; }
                    td { border: 1px solid #ddd; padding: 8px; }
                    .footer { margin-top: 30px; text-align: right; }
                    .total { font-weight: bold; font-size: 14px; color: #D16224; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${title}</h1>
                    <p>Periode: ${period}</p>
                    <p>Dicetak pada: ${moment().format('DD/MM/YYYY HH:mm:ss')}</p>
                </div>
                <table>
                    <thead>
                        ${tableHeader}
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <div class="footer">
                    <p class="total">Total Bersih Keseluruhan: Rp ${totalRevenue.toLocaleString('id-ID')}</p>
                    <p>Jumlah Baris: ${data.length}</p>
                </div>
            </body>
            </html>
        `;

        try {
            const { uri } = await Print.printToFileAsync({ 
                html,
                base64: false
            });
            
            const fileName = `Laporan_${filters.reportType === 'Summary' ? 'Ringkasan' : 'Rincian'}_${moment().format('YYYYMMDD_HHmmss')}.pdf`;
            const newPath = `${FileSystem.cacheDirectory}${fileName}`;
            
            await FileSystem.moveAsync({
                from: uri,
                to: newPath
            });

            await Sharing.shareAsync(newPath, {
                mimeType: 'application/pdf',
                dialogTitle: `Bagikan Laporan ${filters.reportType === 'Summary' ? 'Ringkasan' : 'Rincian'} (PDF)`,
                UTI: 'com.adobe.pdf'
            });
        } catch (error) {
            console.error('Error generating PDF', error);
            throw error;
        }
    },

    generateCSV: async (data: any[], filters: any) => {
        let header = '';
        let rows = '';

        if (filters.reportType === 'Summary') {
            header = 'No,Cabang,Kendaraan,Metode Bayar,Tanggal,Jumlah Trx,Total Bersih (Rp)\n';
            rows = data.map((item, index) => {
                return `${index + 1},${item.branch_name},${item.vehicle_type_name},${item.payment_method_name},${item.transaction_dt},${item.total_transactions},${item.total_net}`;
            }).join('\n');
        } else {
            header = 'No,No. Trx,Tanggal,No. Polisi,Kendaraan,Layanan,Metode Bayar,Total Bersih (Rp)\n';
            rows = data.map((trx: ITransaction, index) => {
                const services = trx.transaction_services?.map(s => s.service_type?.service_type_name).join(' | ') || '-';
                return `${index + 1},${trx.transaction_number},${trx.transaction_dt},${trx.plate_number},${trx.vehicle_type?.vehicle_type_name},"${services}",${trx.payment_method?.payment_method_name},${trx.net_total}`;
            }).join('\n');
        }

        const csvContent = header + rows;
        const fileName = `Laporan_${filters.reportType === 'Summary' ? 'Ringkasan' : 'Rincian'}_${moment().format('YYYYMMDD_HHmmss')}.csv`;
        const path = `${FileSystem.cacheDirectory}${fileName}`;

        try {
            await FileSystem.writeAsStringAsync(path, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
            await Sharing.shareAsync(path, {
                mimeType: 'text/csv',
                dialogTitle: `Bagikan Laporan ${filters.reportType === 'Summary' ? 'Ringkasan' : 'Rincian'} (CSV)`,
                UTI: 'public.comma-separated-values-text'
            });
        } catch (error) {
            console.error('Error generating CSV', error);
            throw error;
        }
    }
};

export default ReportExportService;
