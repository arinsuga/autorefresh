import react from 'react';

//Interfaces
import ICheckpointHistory from '@/interfaces/ICheckpointHistory';

const AttendHistory = async (data: ICheckpointHistory[]) => {
    
    let templateResult = '';
    let templateItems = ``;
    let name = '';

    if (!data) {
        return templateResult;
    }

    if (data.length <= 0) {
        return templateResult;
    }

    name = data[0].name;
    data.map((item) => {
        templateItems += `
            <tr>
                <td style="border: 1px solid black;">${item.checkin_date ? item.checkin_date : ''}</td>
                <td style="border: 1px solid black;">
                    ${item.checkin_date ? 'Tanggal '+item.checkin_date: ''} ${item.checkin_time ? 'Jam '+item.checkin_time+'<br>' : ''}
                    ${item.checkin_description ? '<strong>'+item.checkin_description+'</strong><br>' : ''}
                    ${item.checkin_address ? item.checkin_address : ''}
                </td>
                <td style="border: 1px solid black;">
                    ${item.checkout_date ? 'Tanggal '+item.checkout_date : ''} ${item.checkout_time ? 'Jam '+item.checkout_time+'<br>' : ''}
                    ${item.checkout_description ? '<strong>'+item.checkout_description+'</strong><br>' : ''}
                    ${item.checkout_address ? item.checkout_address : ''}
                </td>
                <td style="border: 1px solid black;">${item.time_elapse ? item.time_elapse : ''}</td>
            </tr>
        `
    });

    templateResult = `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body>
            <table style="width: 95%; font-size: 8px; border-collapse: collapse;">
                <thead>
                    <tr style="text-align: center;">
                        <td colspan="4" style="border: 1px solid black;">
                            <strong>${name ? name : ''}</strong>
                        </td>
                    </tr>

                    <tr>
                        <th style="width: 15%; border: 1px solid black;">Tanggal</th>
                        <th style="width: 40%; border: 1px solid black;">Checkin</th>
                        <th style="width: 40%; border: 1px solid black;">Checkout</th>
                        <th style="width: 5%; border: 1px solid black;"><div>Lama</div><div>Kerja</div></th>
                    </tr>
                </thead>

                <tbody>${templateItems}</tbody>
            </table>


        </body>
        </html>
    `;
    

    return templateResult;
}

export default AttendHistory;    