import axios from 'axios';
import React, { useState, useRef } from 'react'
import Plot from "react-plotly.js";
import { useReactToPrint } from 'react-to-print';


const Form = () => {
  const [model,setModel] = useState("");
  const [result,setResult] = useState([{}]);
  const [month, setMonth] = useState({});
  const [sugg, setSugg] = useState();
  const componentRef = useRef();

  
  const showdata = async (e) => {
    e.preventDefault();
    console.log(model);
    //fetching result
    try{
        const res = await axios.post('/linear_regrsin', {'content': model });
        setResult(res.data);
    }catch(err){
        console.log(err);
    }
    //display month array
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
    setMonth(monthArr);
  }

  const spaces =(s)=>{
    const value = s.target.value.toUpperCase();
    var input = value.trim().split(/ +/).join(' ');
    setModel(input);
  }
  
  //fetching vehicle models
  const func = async(e) => {
    console.log(e.target.value);
    try{
        const getVehicleModel = await axios.get('/vehicle_modelNames');
        setSugg(getVehicleModel.data.model)
        console.log('data.model', getVehicleModel.data.model);
    }catch(err){
        console.log(err);
    }
  }

  //reset the popup output as empty
  const click = ()=>{
    result.result = "empty";
    result.Err = "";
  }

  //report print
  const generatePDF = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'spareResult'
  });


  return (
    <div className='LinearRegression'>
        <div className='container'>
            <h2>Forecast your vehicle's next year sales</h2>
            <div className='w-50 m-auto mt-auto pt-5'>
                <div className='card cardOfLinear'>
                <form onSubmit={showdata}>
                    <input type="search" id="vehicle_model" onClick={func} onChange={spaces} list="list-vehicle_model" name="vehiclename" required/><br />
                    <label id='vehicleInput'>Enter vehicle model</label>
                    <datalist id="list-vehicle_model">
                        {sugg && sugg.map((value, i)=>(
                            <option key={i} id='option'>{value}</option>
                        ))}
                    </datalist>
                    <input type="submit" data-bs-toggle="modal" data-bs-target="#click" className="btn btn-primary" id="enter" value="Submit"/><br />
                </form>
                </div>
            </div>

            <div className="modal" id="click">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <img id='download' onClick={generatePDF} alt='pic' src='https://www.nicepng.com/png/full/72-720482_download-from-cloud-comments-download-from-cloud-icon.png'></img>
                            <p id='save_Dwnd'>Download & Print</p>
                            <button type="button" onClick={click} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body fullYear" ref={componentRef}>
                            { model.length === 0 ? <p id='error'>Please enter the vehicle model</p> : result.result === "empty" ? 
                            ( <img id='loading' alt='pic' src='https://i.pinimg.com/originals/49/23/29/492329d446c422b0483677d0318ab4fa.gif'></img> )
                             : (result.Err === 'Item_matched') ? 
                             ( <div className='row'>
                                        <div>
                                            <table>
                                                <tr>
                                                    <th id='headingLinearTable'>Forecasted values for current year</th>
                                                </tr>
                                            </table>
                                        </div>
                                        {(
                                            result.result.map((member, i)=>(
                                                <div className='linearTable'><p key={i} id='linearVal'><p id='mon'>{month[i]}</p> { Math.round(member) }</p></div>
                                            ))

                                        )}
                                    <Plot className='plotlyChart'
                                    data={[
                                        {
                                            x: [1,2,3,4,5,6,7,8,9,10,11,12],
                                            y: result.result,
                                            type: 'scatter',
                                            mode: 'lines+markers',
                                            name: 'Best fit Line',
                                            marker: {color: 'red'},
                                        },{
                                            x:[1,2,3,4,5,6,7,8,9,10,11,12],
                                            y:result.sales,
                                            type: 'scatter',
                                            name: 'Actual sales',
                                            mode: 'markers',
                                            marker: {color: 'green'},
                                        }]}
                                        layout={ {autosize: true, title: 'Linear Regression'} }
                                        />
                                </div>) : 
                                (result.Err === 'Item_does_not_matched!') ?
                                <>
                                <img id='errImg' alt='pic' src='https://i.pinimg.com/originals/ea/ef/0f/eaef0f0758dd7e532c87227153a6bf6f.jpg'></img>
                                <p id='error'>Please check the spelling or whitespaces!</p>
                                </> : 
                                (<img id='loading' alt='pic' src='https://i.pinimg.com/originals/49/23/29/492329d446c422b0483677d0318ab4fa.gif'></img> ) }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={click} data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id='linear-content-1'>
                <h3>Linear Regression</h3>
                <p>Linear regression analysis is used to predict the value of a variable based on the value of another variable. The variable you want to predict is called the dependent variable. The variable you are using to predict the other variable's value is called the independent variable.</p>
                <p>For Example : The table below shows some data from the early days of the Italian clothing company Benetton. Each row in the table shows Benetton’s sales for a year and the amount spent on advertising that year. In this case, our outcome of interest is sales—it is what we want to predict. If we use advertising as the predictor variable, linear regression estimates that Sales = 168 + 23 Advertising. That is, if advertising expenditure is increased by one million Euro, then sales will be expected to increase by 23 million Euros, and if there was no advertising we would expect sales of 168 million Euros.</p>
                <img alt='pic' src='https://cdn-dfnaj.nitrocdn.com/xxeFXDnBIOflfPsgwjDLywIQwPChAOzV/assets/static/optimized/rev-a7a8c30/wp-content/uploads/2018/04/Example-of-simple-regression.png'></img>
                <p>Linear regression is a basic and commonly used type of predictive analysis.  The overall idea of regression is to examine two things: (1) does a set of predictor variables do a good job in predicting an outcome (dependent) variable?  (2) Which variables in particular are significant predictors of the outcome variable, and in what way do they–indicated by the magnitude and sign of the beta estimates–impact the outcome variable?  These regression estimates are used to explain the relationship between one dependent variable and one or more independent variables.  The simplest form of the regression equation with one dependent and one independent variable is defined by the formula y = c + b*x, where y = estimated dependent variable score, c = constant, b = regression coefficient, and x = score on the independent variable.</p>
            </div>
        </div>
        <div className='footer-2'><p>© ₱しひㅜㅇ৲  2022. All Rights Reserved.</p></div>
    </div>
  )
}

export default Form;