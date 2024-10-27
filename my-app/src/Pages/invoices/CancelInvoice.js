import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './invoice.css'; // Import the CSS file
import logo from "../../images/logo.jpeg";
import { useLocation, useNavigate } from 'react-router-dom';
import FormatDate from '../../Utilities/FormatDate';

export default function CancelInvoice() {
    const location=useLocation();
    const navigate = useNavigate();

    const handleDownload = async () => {

        const element = document.getElementById('invoice');
        const buttons = document.querySelectorAll('.invoice-actions');

        // Temporarily hide the buttons
        buttons.forEach(button => button.style.display = 'none');

        // Capture the element as a canvas
        const canvas = await html2canvas(element, { scale: 2 }); // Increase scale for better quality
        const imgData = canvas.toDataURL(logo);

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm', // Use mm for precise dimension
            format: 'a4'
        });

        // const pdfWidth = 210;  // A4 width in mm
        // const pdfHeight = 297; // A4 height in mm
        // const imgWidth = canvas.width * 0.264583;  // Convert px to mm
        // const imgHeight = canvas.height * 0.264583;

        const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm
        const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm
        const imgWidth = canvas.width * 0.75; // Convert px to mm (1 px = 0.75 mm)
        const imgHeight = canvas.height * 0.75; // Convert px to mm

        // Calculate the scaling factor to fit image in PDF page
        const widthRatio = pdfWidth / imgWidth;
        const heightRatio = pdfHeight / imgHeight;
        const ratio = Math.min(widthRatio, heightRatio); // Scale to fit within the page

        const imgScaledWidth = imgWidth * ratio;
        const imgScaledHeight = imgHeight * ratio;

        // Center the image on the page
        const xOffset = (pdfWidth - imgScaledWidth) / 2;
        const yOffset = (pdfHeight - imgScaledHeight) / 2;

        // Add image to PDF
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgScaledWidth, imgScaledHeight);

        //   doc.save(`فاتورة-رقم-${result?.serialNumber}-حجز جديد.pdf`);

        // Save PDF
        pdf.save(`فاتورة-رقم-${location?.state?.serialNumber}-الغاء-الحجز .pdf`);

        // Show the buttons again
        buttons.forEach(button => button.style.display = 'flex'); // Use 'flex' to match default layout or use any display property as required
    };

      let type = '';
      if (location?.state?.type == 'madany') type = 'مدني';
      if (location?.state?.type == 'darMember') type = 'عضو دار';
      if (location?.state?.type == 'army') type = 'قوات مسلحة';

      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: false
      };

    //   let to=new Date(location?.state?.to);
      
    //   if(location?.state?.print) to=to.setDate(to.getDate());
    //   else to=to.setDate(to.getDate()+1);

    //   to=  to=  FormatDate(new Date(location?.state?.to)) ;//new Date(to).toISOString().split('T')[0];
    let to = new Date(location?.state?.to);
    
    // if(location?.state?.print) to=to.setDate(to.getDate());
    // else to=to.setDate(to.getDate()+1);

    to =   to=  FormatDate(new Date(location?.state?.to)) ;//new Date(to).toISOString().split('T')[0];





      return (
        <div className="app-container">
            <section id="invoice" className="invoice-section">
                <div className="invoice-container">
                    <div className="invoice-header">
                    <div>
                        <h2 className="invoice-title">  رقم امر الدفع : {location?.state?.serialNumber} </h2>
                        <h2 className="invoice-title"> نوع الفاتورة : {location?.state?.status} </h2>
                    </div>
                        <img src={logo} alt="Logo" className="invoice-logo" />
                    </div>
                    <div className="invoice-body">
                   
                        <div className="invoice-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th colSpan={2} className='text-center'> <h4>  بيانات العميل </h4> </th>
                                        {/* <th className='text-center'> المبلغ </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='text-center' >  اسم العميل </td>
                                        <td className='text-center' > {location?.state?.userID?.fullName} </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center' >  رقم تحقيق الشخصية </td>
                                        <td className='text-center' >
                                        {location?.state?.userID?.cardNumber}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center' > رقم التليفون </td>
                                        <td className='text-center' > {location?.state?.userID?.mobile} </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center'>  تصنيف العميل </td>
                                        <td className='text-center'>{type} </td>
                                    </tr>

                                    <tr>
                                        <td className='text-center'>  تاريخ الحجز </td>                                        
                                        <td className='text-center'>{FormatDate( new Date(location?.state?.bookDate))} </td>
                                    </tr>
                                    
                                    <tr>
                                        <td className='text-center'>  تاريخ الغاء حجز الغرفة </td>
                                        <td className='text-center'>{FormatDate( new Date(location?.state?.cancelDate))} </td>
                                    </tr>

                                    <tr>
                                        <td className='text-center'>  تاريخ اصدار الفاتورة </td>
                                        <td className='text-center'>{FormatDate( new Date())} </td>
                                    </tr>

                                    <tr>
                                        <td className='text-center'> توقيت اصدار الفاتورة </td>
                                        <td className='text-center'>{new Date(Date.now()).toLocaleString('en-US', options).split('at')[1]} </td>
                                    </tr>

                               </tbody>
                            </table>
                        </div>


                        <div className="invoice-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th colSpan={2} className='text-center'> <h4>  بيانات الحجز </h4> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* <tr>
                                        <td className='text-center' > حالة الحجز </td>
                                        <td className='text-center' > {location?.state?.status} </td>
                                    </tr> */}
                                    <tr>
                                        <td className='text-center' >  الفترة </td>
                                        <td className='d-flex justify-content-between px-4' >
                                            <span> من : {FormatDate(new Date(location?.state?.from))} </span>
                                            <span> الي : {to} </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center' > رقم الغرفة </td>
                                        <td className='text-center' > {location?.state?.roomID?.room_number} </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center'> سعر الليلة </td>
                                        <td className='text-center'>{location?.state?.roomPrice} L.E </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center'> عدد الايام </td>
                                        <td className='text-center'>{location?.state?.numberOfDays} days </td>
                                    </tr>

                                    <tr className='notes' >
                                        <th  className="text-center items-center"> ملاحظات </th>
                                        <td className="text-center table-row">{location?.state?.notes}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="invoice-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th colSpan={2} className='text-center'> <h4>   التفاصيل المالية </h4> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='text-center' style={{fontWeight:'bolder'}} >   اجمالي المبلغ المدفوع </td>
                                        <td className='text-center' style={{fontWeight:'bolder'}} > {location?.state?.paidPrice} L.E </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center' >  مبلغ الاستكمال </td>
                                        <td className='text-center' >
                                        {location?.state?.completePrice} L.E
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center' > المبلغ المسترد في حالة الغاء الحجز  </td>
                                        <td className='text-center' > 
                                            {location?.state?.cancelPrice =='' ? 0 : location?.state?.cancelPrice} L.E </td>
                                    </tr>

                                    <tr>
                                        <td className='text-center' >   رسوم اضافية </td>
                                        <td className='text-center' > {location?.state?.extraPrice} L.E </td>
                                    </tr>
 
                                    <tr>
                                        <td className='text-center' > مبلغ التأمين </td>
                                        <td className='text-center' > {location?.state?.ensurancePrice} L.E </td>
                                    </tr>

                                    <tr>
                                        <td className='text-center' >  المبلغ المستقطع من التأمين </td>
                                        <td className='text-center' > {location?.state?.subEnsurancePrice} L.E </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center' >  المبلغ المسترد من التأمين </td>
                                        <td className='text-center' > {Number(location?.state?.ensurancePrice) - Number(location?.state?.subEnsurancePrice)} L.E </td>
                                    </tr>

                                    <tr>
                                        <td className='text-center'> المبلغ النهائي </td>
                                        <td className='text-center'>{location?.state?.finalPrice} L.E </td>
                                    </tr>

                                    <tr >
                                        <th className="text-center items-center"> موظف الاستقبال </th>
                                        <td className="text-center table-row">{location?.state?.bookerName} </td>
                                    </tr>

                                  

                                    
                                </tbody>
                            </table>
                        </div>

                        <div className="invoice-actions">
                            <button type="button" className="btn btn-primary" onClick={handleDownload}> تنزيل </button>
                            <button onClick={() => navigate(-1)} className="btn btn-danger"> رجوع </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

}
