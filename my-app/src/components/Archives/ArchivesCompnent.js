import { useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import FormatDate from "../../Utilities/FormatDate";
import { Spinner } from "react-bootstrap";

export default function ArchivesCompnent() {

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState(null);
  const[isLoading,setIsLoading]=useState(false);

  const onKeyEnter = (event)=>{
    if( event.key == "Enter"){
      search();
    
    }
 }
  const search = async () => {
    const data = {
      from,
      to,
      type: searchType,
      value: searchValue
    }
if(searchType == ""){
  return toast.error("من فضلك اختر نوع البحث");
} 
//-----------------------------------------------
//   const from_date = new Date(from);  // Convert 'from' to a Date object
// const to_date = new Date(to);      // Convert 'to' to a Date object
const from_date = new Date(new Date(from).getFullYear(), new Date(from).getMonth(), new Date(from).getDate()); 

      const to_date = new Date(new Date(to).getFullYear(), new Date(to).getMonth(), new Date(to).getDate()); 

      //const myNowNoTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());



if (
    from_date > to_date ||                         // Check if from_date is after to_date
    from == "" ||
    to == ""                               // Check if from_date is before the current date
){
  return toast.error("تم ادخال التاريخ بشكل غير دقيق");
} 
if(!searchValue){
  return toast.error("من فضلك اكتب ما تريد البحث عنه");
}
//------------------------------------------------
    console.log('data', data);
    console.log('searchType', searchType, "searchValue", searchValue);

    // getArcheives
    setIsLoading(true);
    let results = await window?.electron?.getArcheives(data);
    setIsLoading(false);

    setResults(results.results);

     console.log("results",results);

  }

  console.log('results', results);

  let columns = [];

  if(searchType == 'roomNumber'){
    columns = [
      {
        name: 'الاسم',
        selector: row => row?.userID?.fullName,
        sortable: true,
      },
      {
        name: 'رقم البطاقة',
        selector: row => row?.userID?.cardNumber,
        sortable: true,
      },
      {
        name: 'رقم امر الدفع',
        selector: row => row?.serialNumber,
        sortable: true,
      },
      {
        name: 'من الفترة',
        selector: row => FormatDate(row?.from),
        sortable: true,
      },
      {
        name: 'الي الفترة',
        selector: row => FormatDate(row?.to),
        sortable: true,
      },
      {
        name: 'نوع الفاتورة',
        selector: row => row?.status,
        sortable: true,
      },
      // {
      //   name: 'نوع الفاتورة',
      //   selector: row => {
      //     if(row?.type=='army') return 'قوات مسلحة';
      //     if(row?.type=='darMember') return 'عضو دار';
      //     if(row?.type=='madany') return 'مدني';
      //   },
      //   sortable: true,
      // },
    ]
  }

  if(searchType=='cardNumber' || searchType=='userName'){
    columns = [
      {
        name: 'الاسم',
        selector: row => row?.userID?.fullName,
        sortable: true,
      },
      {
        name: 'رقم الغرفة',
        selector: row => row?.roomID?.room_number,
        sortable: true,
      },
      {
        name: 'رقم امر الدفع',
        selector: row => row?.serialNumber,
        sortable: true,
      },
      {
        name: 'من الفترة',
        selector: row => FormatDate(row?.from),
        sortable: true,
      },
      {
        name: 'الي الفترة',
        selector: row => FormatDate(row?.to),
        sortable: true,
      },
      {
        name: 'نوع الفاتورة',
        selector: row => row?.status,
        sortable: true,
      },
      // {
      //   name: 'نوع الفاتورة',
      //   selector: row => {
      //     if(row?.type=='army') return 'قوات مسلحة';
      //     if(row?.type=='darMember') return 'عضو دار';
      //     if(row?.type=='madany') return 'مدني';
      //   },
      //   sortable: true,
      // },
    ]
  }

  return (
    <div className='w-100 h-100'>
      <h1> الارشيف </h1>
      <div className="d-flex gap-3 justify-content-center my-3">

        <div className="d-flex gap-2 form-group">

          <div>
            <label className="my-2" style={{ visibility: 'hidden' }}> .... </label>
            <select required value={searchType} onKeyPress={onKeyEnter} onChange={(e) => setSearchType(e.target.value)} className='form-control'>
              <option value={0}> اختر نوع البحث </option>
              <option value={'cardNumber'}> رقم تحقيق الشخصية </option>
              <option value={'userName'}> الاسم </option>
              <option value={'roomNumber'}> رقم الغرفة </option>
            </select>
          </div>

          <div>
            <label className="my-2" style={{ visibility: 'hidden' }}> .... </label>

            <input
              value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
              type="text" className="form-control"
              placeholder="ابحث هنا"
              onKeyPress={onKeyEnter}
              />
          </div>

        </div>

        <div className="form-group">
          <label className="my-2">من </label>
          <input value={from} data-date-format="DD MMMM YYYY" onKeyPress={onKeyEnter} onChange={(e) => setFrom(e.target.value)} type="date" className="form-control" />
        </div>

        <div className="form-group">
          <label className="my-2">الي  </label>
          <input value={to} onKeyPress={onKeyEnter} onChange={(e) => setTo(e.target.value)} type="date" className="form-control" />
        </div>

        <div className="form-group d-flex flex-column justify-content-end" style={{ width: '10%' }}>
          <button onClick={() => search()} className="btn btn-success"> بحث </button>
        </div>

        <div>
        {isLoading&&<Spinner />}
        </div>
      </div>

      <div>
        { results &&
          <DataTable
            columns={columns}
            data={results}
            filter={true}
            filterPlaceholder={'ابحث هنا'}
            pagination
            noDataComponent="لا توجد سجلات للعرض"
          />
          // <div className="invoice-table my-5">
          //   <table className="table">
          //     <thead>
          //       <tr>
          //         <th className='text-center'> <h5>   الاسم </h5> </th>
          //         <th className='text-center'> <h5>   رقم البطاقة </h5> </th>
          //         <th className='text-center'> <h5>   رقم امر الدفع </h5> </th>
          //       </tr>
          //     </thead>
          //     <tbody>
          //       {
          //         results?.map((el, i) =>
          //           <tr key={i}>
          //             <td>{el?.userID?.fullName}</td>
          //             <td>{el?.userID?.cardNumber}</td>
          //             <td>{el?.serialNumber}</td>
          //           </tr>
          //         )
          //       }

          //       {/* <tr>
          //              <td className='text-center' >  مبلغ الاستكمال </td>
          //              <td className='text-center' >
          //                  {location?.state?.completePrice} L.E
          //              </td>
          //          </tr>

          //          <tr>
          //              <td className='text-center' >   المبلغ المدفوع </td>
          //              <td className='text-center' >
          //                  {location?.state?.paidPrice} L.E
          //              </td>
          //          </tr>

          //          {
          //              location?.state?.isTransferred && <tr>
          //                  <td className='text-center' >  مبلغ فرق الحجز </td>
          //                  <td className='text-center' >
          //                      {location?.state?.transferPrice} L.E
          //                  </td>
          //              </tr>
          //          }

          //          <tr>
          //              <td className='text-center' >   رسوم اضافية </td>
          //              <td className='text-center' > {location?.state?.extraPrice} L.E </td>
          //          </tr>

          //          <tr>
          //              <td className='text-center' > مبلغ التأمين </td>
          //              <td className='text-center' > {location?.state?.ensurancePrice} L.E </td>
          //          </tr>
          //          <tr>
          //              <td className='text-center'> المبلغ النهائي </td>
          //              <td className='text-center'>{location?.state?.finalPrice} L.E </td>
          //          </tr>

          //          <tr >
          //              <th className="text-center items-center"> موظف الاستقبال </th>
          //              <td className="text-center table-row">{location?.state?.bookerName} </td>
          //          </tr> */}
          //     </tbody>
          //   </table>
          // </div>
        }
        {/* {  results?.length == 0 && 
          <div>لا توجد بيانات لهذا التوقيت</div>
        } */}
      </div>

    </div>
  )
}
