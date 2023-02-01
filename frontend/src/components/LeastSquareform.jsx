import axios from 'axios';
import React, { useState, useRef } from 'react';
import Plot from "react-plotly.js";
import Uploadfile from './CSVFileupload'
import { useReactToPrint } from 'react-to-print';



function LeastSquareform() {
    const [selectMonth,setSelectMonth]=useState("");
    const [result,setResult] = useState([{}]);
    const [month, setMonth] = useState({});
    const componentRef = useRef();

const showsales = async (e) => {
    e.preventDefault();

    //alternate for e.target.value 
    var formData = new FormData(e.target);
    var data = Object.fromEntries(formData);
    console.log(formData);

    try {
      const res = await axios.post('/least_square_regression', {'content': data, selectMonth});
      setResult(res.data);
      // console.log('res', res.data);
    }catch(err){
      console.log(err);
    }


    }

  const out = (e)=>{
    setSelectMonth(e.target.value);
    const monthArr = {
      '1': 'January',
      '2': 'Feburary',
      '3': 'March',
      '4': 'April',
      '5': 'May',
      '6': 'June',
      '7': 'July',
      '8': 'August',
      '9': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December'
    }

      setMonth((monthArr[(e.target.value)]));
    }

    //report print
    const generatePDF = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'spareResult'
    });

    


  return (
    <div className='Sales'>
      <div className='container'>
        <div id='Sales'>
          <h2>Forecast your upcoming sales for any month</h2>
        </div>
        <div className='w-50 m-auto mt-auto pt-5'>
          <div className='card cardOfLeast'>
            <form className='dForm' onSubmit={showsales}>
              <p id='title'>ENTER THE <span>ACTUAL SALES DATA</span> OF PREVIOUS YEAR</p>
              <div className='scroll'>
                <label id='labelOfFormLSR' htmlFor="jan">January*</label>
                <input type="text" className='salesData' name='jan' required/><br />
                <label id='labelOfFormLSR' htmlFor="feb">Feburary*</label>
                <input type="text" className='salesData' name='feb' required/><br />
                <label id='labelOfFormLSR' htmlFor="mar">March*</label>
                <input type="text" className='salesData' name='mar' required/><br />
                <label id='labelOfFormLSR' htmlFor="apr">April*</label>
                <input type="text" className='salesData' name='apr' required/><br />
                <label id='labelOfFormLSR' htmlFor="may">May*</label>
                <input type="text" className='salesData' name='may' required/><br />
                <label id='labelOfFormLSR' htmlFor="jun">June*</label>
                <input type="text" className='salesData' name='jun' required/><br />
                <label id='labelOfFormLSR' htmlFor="jul">July*</label>
                <input type="text" className='salesData' name='jul' required/><br />
                <label id='labelOfFormLSR' htmlFor="aug">August*</label>
                <input type="text" className='salesData' name='aug' required/><br />
                <label id='labelOfFormLSR' htmlFor="sep">September*</label>
                <input type="text" className='salesData' name='sep' required/><br />
                <label id='labelOfFormLSR' htmlFor="oct">October*</label>
                <input type="text" className='salesData' name='oct' required/><br />
                <label id='labelOfFormLSR' htmlFor="nov">November*</label>
                <input type="text" className='salesData' name='nov' required/><br />
                <label id='labelOfFormLSR' htmlFor="dec">December*</label>
                <input type="text" className='salesData' name='dec' required/><br />
                
              </div>
              <input type="submit" id="submit" data-bs-toggle="modal" data-bs-target="#click" className='btn btn-dark' value="submit" />
            </form>
            <div className='getMonthFromUser'>
              <label id='label' htmlFor="months">choose a month for Forecast:</label>
              <select onChange={out} name="months" id="month">
                <option value="">---Select---</option>
                <option value="1">January</option>
                <option value="2">Feburary</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select> 
            </div>

            <div className="modal" id="click">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <img id='download' onClick={generatePDF} alt='pic' src='https://www.nicepng.com/png/full/72-720482_download-from-cloud-comments-download-from-cloud-icon.png'></img>
                    <p id='save_Dwnd'>Downoad & Print</p>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body finalResult" ref={componentRef}>

                      {(typeof result.forecastedValue === 'undefined') ? (

                          <>
                          <img id='errImg' alt='pic' src='https://i.pinimg.com/originals/ea/ef/0f/eaef0f0758dd7e532c87227153a6bf6f.jpg'></img>
                          <p id='err' style={{color: "red"}}>You must fill in all of the fields!</p>
                          </>
                      ):(
                          <>
                          <div>
                            <table>
                                <tr>
                                  <p id='the_forecasted_value_for'>The forecasted value for <span style={{color: "red"}}>{month}</span> is</p>
                                </tr>
                                <tr>
                                  <p id='result'>{ result.forecastedValue }</p> 
                                </tr>
                            </table>
                          </div>
                          <div id='Graph'>
                          <Plot className='plotlyChart'
                              data={[
                                {
                                    x: [1,2,3,4,5,6,7,8,9,10,11,12],
                                    y: result.yvalues,
                                    type: 'scatter',
                                    mode: 'lines+markers',
                                    name: 'Best fit line',
                                    marker: {color: 'red'},
                                },{
                                    x:[1,2,3,4,5,6,7,8,9,10,11,12],
                                    y:result.sales,
                                    type: 'scatter',
                                    name: 'Actual sales',
                                    mode: 'markers',
                                    marker: {color: 'green'},
                                  }]}
                                layout={ {autosize:true, title: 'Sales Comparison', font: {family: 'Courier New, monospace', size: 13, color: '#2E2E2E'}} }
                            />
                        </div>
                          </>
                      )}

                  </div>
                 
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

         </div>
        </div>

        <div className='Upload'>
          <Uploadfile/>
        </div>

        <div id='least-content-1'>
          <h3>Least Square Regression</h3>
          <p>If the data shows a leaner relationship between two variables, the line that best fits this linear relationship is known as a least-squares regression line, which minimizes the vertical distance from the data points to the regression line.</p>
          <p>The equation y = β1x + β0 specifying the least squares regression line is called the least squares regression equationThe equation y = β1x + β0 of the least squares regression line. Given a bivariate quantitative dataset the least square regression line, almost always abbreviated to LSRL, is the line for which the sum of the squares of the residuals is the smallest possible. The slope of the LSRL is given by m=rsysx, where r is the correlation coefficient of the dataset</p>
          <p>Positive Linear Correlation. There is a positive linear correlation when the variable on the x -axis increases as the variable on the y -axis increases. ...Negative Linear Correlation. ...Non-linear Correlation (known as curvilinear correlation) ...No Correlation.</p>
          <p>Formula for LSR : <br /> ∑y = an + b∑x <br /> ∑xy = a∑x + b∑x2</p>
          <p>A least-squares regression method is a form of regression analysis that establishes the relationship between the dependent and independent variables along a linear line. This line refers to the “line of best fit.”
            Regression analysis is a statistical method with the help of which one can estimate or predict the unknown values of one variable from the known values of another variable. The variable used to predict the variable interest is called the independent or explanatory variable, and the variable predicted is called the dependent or explained variable.
            Let us consider two variables, x and y. These are plotted on a graph with values of x on the x-axis and y on the y-axis. The dots represent these values in the below graph. A straight line is drawn through the dots – referred to as the line of best fit.</p>
        </div>
      </div>
        <div className='footer-2'><p>© ₱しひㅜㅇ৲  2022. All Rights Reserved.</p></div>
    </div>
  )
}


export default LeastSquareform;
