import axios from 'axios';
import React, { useState } from 'react';


function Sparepart() {
    const [vehicle,setVehicle] = useState("");
    const [spare,setSpare] = useState("");
    const [models,setModels]=useState([]);
    const [sparts,setSparts]=useState([]);
    const [units, setUnits] = useState([]);
    const [month, setMonth] = useState([]);


    //final output
    const showData= async(e)=>{
        e.preventDefault()
        try{
          const res = await axios.post('/produceSpareParts', {'data': vehicle,spare,month});
          setUnits(res.data);
        }catch(err){
          console.log(err);
        }
    }

    //fetching spare_parts models
    const enterSparepartsModel= async(e)=>{
      e.preventDefault()
      try{
        const res = await axios.post('/sparePartsModel', {'data': vehicle});
        setSparts(res.data['sparemodels'])
        console.log(res);
      }catch(err){
        console.log(err);
      }
    }


    const spaces =(s)=>{
      const value = s.target.value.toUpperCase();
      var input = value.trim().split(/ +/).join(' ');
      setVehicle(input);
      // setEmptyMessage(input)
    }


    //fetching bike models
    const enterVehicleModel= async()=>{
      try{
        const getSpare = await axios.get('/vehicle_modelNames');
        setModels(getSpare.data.model)
        console.log('getSpare.data.s', getSpare.data.s);
      }catch(err){
        console.log(err);
      }
    }


  return (
    <div className='LinearRegression'>
        <div className='container'>
            <h2>Predict future demand for your vehicle's Spare Parts</h2>
            <div className='w-50 m-auto pt-5'>
              <div className='card cardOfLeast'>
                <form onSubmit={showData}>
                  <input type="text" id="vehicle_model"  onClick={enterVehicleModel} onChange={spaces} list="list-spareParts" name="vehiclename" required/><br />
                  <label id='vehicleInput'>Vehicle model</label>
                  <datalist id="list-spareParts">
                      {models && models.map((value, i)=>(
                          <option key={i} id='option'>{value}</option>
                      ))}
                  </datalist>
                  <input type="text" id="vehicle_model-1" onClick={enterSparepartsModel} onChange={(e)=>setSpare(e.target.value)}list="list-sparedata" name="partname" required/><br />
                  <label id='vehicleInput-1'>Vehicle's spare part name</label>
                  <datalist id="list-sparedata">
                      {sparts && sparts.map((value, i)=>(
                          <option key={i} id='option'>{value}</option>
                      ))}
                  </datalist>

                  <div className='getmonthfromuser'>
                    <label id='label1' htmlFor="months">choose a month for Forecast:</label>
                    <select name="months" onChange={(e)=> setMonth(e.target.value)} id="Month">
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
                
                  <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mainPopup" id='enter'>Submit</button>
                </form>
              </div>

                <div className="modal" id="mainPopup">
                <div className="modal-dialog">
                  <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className='unitDiv'>
                        { 
                        units.forecast ? <div className='spareResult'><p>Quantity of Production is </p> <span id='units'>{units.forecast}</span></div> 
                        : 
                        <p id='units'>{units.forecast===0 ? <><img alt='pic' id='spareImg' src='https://www.seo-analyse.com/wp-content/uploads/2022/03/like-scaled-e1647957129692.jpg'></img><p id='noneed'>Great! no need of production.</p></> 
                        : 
                        <p></p> }</p>
                        }
                        { units.error && <p id='spareErr'>{units.error}</p> }
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>

            </div>
            <div id='linear-content-1'>
              <h3>Benefits of Spare Parts Management</h3>
              <p>Spare parts management is an essential operation in the supply chain of many companies, owing to its strategic importance in supporting equipment availability and continuity of operations. In many supply chains, the demand of spare parts is inherently more uncertain compared to traditional fast-moving products. This is due to the fact that spare parts demand is highly intermittent, mostly observed with a long period between consecutive orders, where a no demand period is followed by a period of an order signal. As spare parts are critical to the continuity of operations, companies tend to stock more inventories to mitigate the risk of irregular demand pattern. Gerber Technology, a manufacturing company that sells industrial machines and the spare parts that support them, faces challenges in its spare parts demand forecast quality and inventory management. This challenge has recently been negatively impacting the company’s inventory costs and customer service level, where the actual inventory is consistently higher than the targeted level. Meanwhile, higher inventory levels are not being translated into higher service level to its customers. In summary, the company has seen increased costs with a lower service level. Therefore, the aim of this project was to improve the demand forecast accuracy and the spare parts service level of the company while optimizing inventory costs. For this purpose, we used SKU classification for demand categorization and inventory control. With these categorizations, we then allocate the recommended demand forecasting techniques and optimize the inventory levels of the company. By following these processes, we achieved an improvement between 7% to 14% in forecasting accuracy measured by the Root Mean Squared Error (RMSE). We could also gain up to 3% improvement in service level leading to $1.3M additional revenue opportunity.</p>
              <ul>
                <li>Optimization of the spare parts purchasing process.</li>
                <li>Reduction in costly equipment downtime.</li>
                <li>Elimination of redundancies and obsolete components.</li>
                <li>Cost-effective resource usage.</li>
              </ul>
            </div>
        </div>
        <div className='footer-3'><p>© ₱しひㅜㅇ৲  2022. All Rights Reserved.</p></div>
    </div>
  )
}
export default Sparepart;