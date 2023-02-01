import React from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import Plot from "react-plotly.js";
import pic from '../Screenshot from 2022-12-22 18-07-09.png';
import { useReactToPrint } from 'react-to-print';


function Uploadfile() {
  const [result,setResult] = useState([])
  const [month, setMonth] = useState([]);
  const componentRef = useRef();
  
  let uploadInput;
  const handleUpload = async(e) =>{
    e.preventDefault()
    const data = new FormData();
    data.append('file', uploadInput.files[0])
    console.log(data);

    try {
      const res = await axios.post('/upload',data)
      setResult(res.data);
      // console.log('res.data', res.data);
    } catch(error) {
      console.log(error);
    }


    const monthArr = [
      'January',
      'Feburary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    setMonth((monthArr));

  }

  //report print
  const generatePDF = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'spareResult'
  });

  console.log('result--> ', typeof(result.data));

  return (
    <form onSubmit={(e)=>{handleUpload(e)}}>
      <div className='CSV'>
        <p> (or) </p>
        <div className='w-50 m-auto pt-5'>
          <div className='card cardOfFileUpload'>
            <input ref={(e) => {uploadInput = e}}  type="file" />
            <button data-bs-toggle="modal" data-bs-target="#CSVfileUpload" value="submit">Upload</button>
          </div>
        </div>
        <h5><span>Note : </span>Once check your file format before uploading, because this only accept .CSV format.</h5>
        <h3>The file's structure must be in 2-coloumns first one is month & second one is sales. (or) If you have any doubt see the below figure.</h3>
        <img alt='screenshot' src={pic}></img>
      </div>

      <div className="modal" id="CSVfileUpload">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <img id='download' onClick={generatePDF} alt='pic' src='https://www.nicepng.com/png/full/72-720482_download-from-cloud-comments-download-from-cloud-icon.png'></img>
              <p id='save_Dwnd'>Save & Downoad</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body" ref={componentRef}>
            {result.data && result.data.map((map,i)=>(
              <div id='CSVmonth'><p key={i} id='CSVvalue'> <p id='mon'>{month[i]}</p> { Math.round(map) }</p></div>
            ))}
            { result.data === undefined ? 
            <>
            <img alt='img' id='errorsImg' src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Caution_sign_used_on_roads_pn.svg/2458px-Caution_sign_used_on_roads_pn.svg.png'></img>
            <p id='errors'>Oops! please check the file format or file's structure</p>
            </>  
            :
            <div className='graph'>
            <Plot className='plotlyChart'
              data={[
                {
                    x: [1,2,3,4,5,6,7,8,9,10,11,12],
                    y: result.data,
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Best fit Line',
                    marker: {color: 'red'},
                }, {
                  x: [1,2,3,4,5,6,7,8,9,10,11,12],
                  y: result.yvalues,
                  type: 'scatter',
                  mode: 'markers',
                  name: 'Actual Sales',
                  marker: {color: 'green'},
                }]}
                layout={ {autosize: true, title: 'Sales Comparison'} }
            />
            </div> }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Uploadfile;