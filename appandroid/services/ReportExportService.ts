import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import { ITransaction } from '@/interfaces/ITransaction';

const ReportExportService = {
    generatePDF: async (data: any[], filters: any) => {
        const reportTypeName = filters.reportType === 'Summary' ? 'Ringkasan' : 'Rincian';
        let title = `Laporan ${reportTypeName}`;
        const isAllBranches = !filters.branch || filters.branch.id === 'all' || filters.branch.id === 0;

        if (!isAllBranches && filters.branch?.branch_name) {
            title += ` - ${filters.branch.branch_name}`;
        }

        const period = `${filters.dateFrom} s/d ${filters.dateTo}`;
        
        let tableHeader = '';
        let tableRows = '';
        let totalRevenue = 0;

        if (filters.reportType === 'Summary') {
            // Grouping logic for Summary: Branch -> Vehicle Type
            const groupedByBranch: any = {};
            data.forEach(item => {
                const bName = item.branch_name || 'Lainnya';
                const vName = item.vehicle_type_name || 'Lainnya';
                if (!groupedByBranch[bName]) groupedByBranch[bName] = {};
                if (!groupedByBranch[bName][vName]) {
                    groupedByBranch[bName][vName] = { trx: 0, total: 0 };
                }
                groupedByBranch[bName][vName].trx += Number(item.total_transactions || 0);
                groupedByBranch[bName][vName].total += Number(item.total_net || 0);
            });

            tableHeader = `
                <tr>
                    <th style="width: 40px; text-align: center;">No</th>
                    <th>Kendaraan</th>
                    <th style="text-align: center; width: 100px;">Jumlah Trx</th>
                    <th style="text-align: right; width: 150px;">Total (Rp)</th>
                </tr>
            `;

            if (!isAllBranches) {
                // Specific branch
                const bName = filters.branch.branch_name;
                const vehicles = groupedByBranch[bName] || {};
                Object.keys(vehicles).sort().forEach((vName, idx) => {
                    const info = vehicles[vName];
                    totalRevenue += info.total;
                    tableRows += `
                        <tr>
                            <td style="text-align: center;">${idx + 1}</td>
                            <td>${vName}</td>
                            <td style="text-align: center;">${info.trx}</td>
                            <td style="text-align: right;">${info.total.toLocaleString('id-ID')}</td>
                        </tr>
                    `;
                });
            } else {
                // All branches: Group by branch subtitle
                Object.keys(groupedByBranch).sort().forEach((bName) => {
                    tableRows += `
                        <tr style="background-color: #f9f9f9;">
                            <td colspan="4" style="font-weight: bold; padding: 10px; color: #D16224; border-top: 1px solid #ddd;">Cabang: ${bName}</td>
                        </tr>
                    `;
                    const vehicles = groupedByBranch[bName];
                    let branchTrx = 0;
                    let branchTotal = 0;
                    Object.keys(vehicles).sort().forEach((vName, idx) => {
                        const info = vehicles[vName];
                        branchTrx += info.trx;
                        branchTotal += info.total;
                        totalRevenue += info.total;
                        tableRows += `
                            <tr>
                                <td style="text-align: center;">${idx + 1}</td>
                                <td>${vName}</td>
                                <td style="text-align: center;">${info.trx}</td>
                                <td style="text-align: right;">${info.total.toLocaleString('id-ID')}</td>
                            </tr>
                        `;
                    });
                    tableRows += `
                        <tr style="font-weight: bold; background-color: #f0f0f0;">
                            <td colspan="2" style="text-align: right; padding: 8px;">Subtotal ${bName}</td>
                            <td style="text-align: center;">${branchTrx}</td>
                            <td style="text-align: right;">${branchTotal.toLocaleString('id-ID')}</td>
                        </tr>
                    `;
                });
            }
        } else {
            // Detail Report (Rincian)
            tableHeader = `
                <tr>
                    <th style="width: 30px; text-align: center;">No</th>
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
                totalRevenue += Number(trx.net_total || 0);
                const services = trx.transaction_services?.map(s => s.service_type?.service_type_name).join(', ') || '-';
                
                tableRows += `
                    <tr>
                        <td style="text-align: center;">${index + 1}</td>
                        <td>${trx.transaction_number}</td>
                        <td>${trx.transaction_dt}</td>
                        <td>${trx.plate_number}</td>
                        <td>${trx.vehicle_type?.vehicle_type_name}</td>
                        <td>${services}</td>
                        <td>${trx.payment_method?.payment_method_name}</td>
                        <td style="text-align: right;">${Number(trx.net_total || 0).toLocaleString('id-ID')}</td>
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
            // Apply similar grouping logic for CSV
            const groupedByBranch: any = {};
            data.forEach(item => {
                const bName = item.branch_name || 'Lainnya';
                const vName = item.vehicle_type_name || 'Lainnya';
                if (!groupedByBranch[bName]) groupedByBranch[bName] = {};
                if (!groupedByBranch[bName][vName]) {
                    groupedByBranch[bName][vName] = { trx: 0, total: 0 };
                }
                groupedByBranch[bName][vName].trx += Number(item.total_transactions || 0);
                groupedByBranch[bName][vName].total += Number(item.total_net || 0);
            });

            header = 'No,Cabang,Kendaraan,Jumlah Trx,Total (Rp)\n';
            let csvRows: string[] = [];
            let globalIndex = 1;
            let totalRevenue = 0;

            Object.keys(groupedByBranch).sort().forEach(bName => {
                const vehicles = groupedByBranch[bName];
                Object.keys(vehicles).sort().forEach(vName => {
                    const info = vehicles[vName];
                    totalRevenue += Number(info.total || 0);
                    csvRows.push(`${globalIndex++},${bName},${vName},${info.trx},${info.total}`);
                });
            });
            rows = csvRows.join('\n');
            rows += `\n,,,Total Bersih Keseluruhan,${totalRevenue}`;
        } else {
            header = 'No,No. Trx,Tanggal,No. Polisi,Kendaraan,Layanan,Metode Bayar,Total Bersih (Rp)\n';
            let totalRevenue = 0;
            rows = data.map((trx: ITransaction, index) => {
                const val = Number(trx.net_total || 0);
                totalRevenue += val;
                const services = trx.transaction_services?.map(s => s.service_type?.service_type_name).join(' | ') || '-';
                return `${index + 1},${trx.transaction_number},${trx.transaction_dt},${trx.plate_number},${trx.vehicle_type?.vehicle_type_name},"${services}",${trx.payment_method?.payment_method_name},${val}`;
            }).join('\n');
            rows += `\n,,,,,,Total Bersih Keseluruhan,${totalRevenue}`;
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
