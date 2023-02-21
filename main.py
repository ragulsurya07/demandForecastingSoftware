from flask import Flask,request,json
import numpy as np
import os 
import pandas as pandas
from flask_mysqldb import MySQL
import MySQLdb.cursors
from datetime import date,datetime
from dateutil.relativedelta import relativedelta
from sklearn.linear_model import LinearRegression

from sympy import symbols, Eq, solve


api = Flask(__name__)

api.config['MYSQL_HOST'] = 'localhost'
api.config['MYSQL_USER'] = 'root'
api.config['MYSQL_PASSWORD'] = '--your--password--'
api.config['MYSQL_DB'] = 'Demand_Forecasting'

mysql = MySQL(api)


#least square regression
@api.route('/least_square_regression', methods=['POST'])
def l_regression():
    try:
        reqdata_data = json.loads(request.data)
        x = int(reqdata_data['selectMonth'])
        mon = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
        inDependentVariable = [1,2,3,4,5,6,7,8,9,10,11,12]
        dependentVariable = []
        # print("reqdata_data['content']--->", reqdata_data['content'])
        for i in range(len(reqdata_data['content'])):
            dependentVariable.append(int(reqdata_data['content'][mon[i]]))
        print('print--->y', dependentVariable)
        n = len(inDependentVariable)
        sigmaX = 0
        sigmaY = 0
        findingSigmaXY = []
        findingSigmaX_square = []
        for itm1, itm2 in zip(inDependentVariable, dependentVariable):
            sigmaX += itm1
            sigmaY += itm2
            xSquare = itm1**2
            findingSigmaX_square.append(xSquare)
            XY = itm1 * itm2
            findingSigmaXY.append(XY)
        sigmaXY = 0
        sigmaX_square = 0
        for itm1,itm2 in zip(findingSigmaXY,findingSigmaX_square):
            sigmaXY += itm1
            sigmaX_square += itm2
        print(f'\nsigmaX --> {sigmaX} \nsigmaY --> {sigmaY} \nsigmaXY --> {sigmaXY} \nsigmaX_square --> {sigmaX_square} ' )
        print()
        
        #Formula
        print(f'{sigmaY} = a*{n} + b*{sigmaX}')
        print(f'{sigmaXY} = a*{sigmaX} + b*{sigmaX_square}')
        
        # eqn1 = f'{sigmaX*n}*a + {sigmaX*sigmaX}*b - ({sigmaX*sigmaY})'
        # eqn2 = f'{n*sigmaX}*a + {n*(sigmaX_square)}*b - ({n*sigmaXY})'
        
        print()
        a, b = symbols('a b')
        eq1 = Eq((sigmaX*n)*a + (sigmaX*sigmaX)*b - sigmaX*sigmaY)
        eq2 = Eq((n*sigmaX)*a + (n*(sigmaX_square))*b - n*sigmaXY)

        sol_dict = solve((eq1,eq2), (a, b))
        print('------------------> ', sol_dict[a],' , ',sol_dict[a])
        a = float(sol_dict[a])
        b = float(sol_dict[b])
        forecastedValue = a + (b * x) # here the x is used
        forecastedValue = round(forecastedValue)
        # print('forecastedValue ',forecastedValue)
        x = np.linspace(1, 12, 12)
        print('linspace ---> ', x)
        y = a + b*x
        y = list(y)
        print('linspace ---> ', y)
        # print(eqn1 - eqn2)
        return {'forecastedValue':forecastedValue, 'yvalues': y, 'sales': dependentVariable}
    except:
        print('Error occured')
        return {'error1' : "Enter a valid input"}
    
    

#linear regression
@api.route('/linear_regrsin', methods=['POST'])
def datafrmfrntend():
    req_data = json.loads(request.data)
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    vehicle=req_data['content'] 
    print('vehicle==>',vehicle)
    frontErr = func(vehicle)  # checking the item is match (or) mismatch
    print(frontErr)
    #  yearCalculation
    dates=[]
    endpoint = date.today() + relativedelta(months=-13)
    print('----------------------')
    print('endpoint', endpoint)
    print('----------------------')
    for mon in range(12):
        endpoint += relativedelta(months=+1)
        # print('endpoint------------> ',endpoint)
        dates.append(str(endpoint.month)+"/"+str(endpoint.year))
    print('dates====>', dates)
    # calculate total sales
    def datafetching():
        actualSales=[]
        Tmonths=dates
        for month in Tmonths:
            date="%"+month+"%"
            datas=[date,vehicle]
            sql='select * from finaldata where date LIKE %s and model=%s'
            cursor.execute(sql,datas)
            sales = list(cursor.fetchall())
            # print('sales ::::::> ',sales)
            Tsales=0
            for sale in range(len(sales)):
                Tsales += sales[sale]['count']
            # print('Tsales---------------------> ',Tsales)
            actualSales.append(Tsales)
        print('actualSales : ', actualSales)
        return(actualSales)
    def l_regression():
        x = np.array([1,2,3,4,5,6,7,8,9,10,11,12]).reshape((-1, 1))
        y = np.array(datafetching())
        model = LinearRegression().fit(x, y)
        y_pred = model.predict(x)
        print('y_pred', y_pred)
        return(y_pred)
    result=list(l_regression())
    asales=datafetching()
    cursor.close()
    return {'result':result, 'sales':asales, 'Err': frontErr}


def func(vehicle):
    try:
        for itms in my_profile()['model']:
            if itms == vehicle:
                match = 'Item_matched'
                return match
        else:
            notMatch = 'Item_does_not_matched!'
            return notMatch
    except:
        print('=====> Error occured! <=====')
        return {'error2' : "Please check the correct spelling!"}
    


#fetching bike models
@api.route('/vehicle_modelNames')
def my_profile():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    sql = 'select model from modelname'
    cursor.execute(sql)
    rslt = list(cursor.fetchall())
    model = []
    for i in range(len(rslt)):
        model.append(rslt[i]['model'])
    return {'model':model}


#file upload
@api.route('/upload', methods = ['GET', 'POST'])
def uploader_file():
    try:
        f = request.files['file']
        filesname=f.filename
        print('filesname-------------------> ',filesname)
        f.save(os.path.join("/home/akitra/Training_files/Demand Forecasting 3/UploadFiles",filesname))
        car=pandas.read_csv("/home/akitra/Training_files/Demand Forecasting 3/UploadFiles/"+filesname)
        df = pandas.DataFrame(car)
        print('filesname-------------------> ',df)
        x = np.array([1,2,3,4,5,6,7,8,9,10,11,12]).reshape((-1, 1))
        y = np.array(df['sale'])
        print(y)
        model = LinearRegression().fit(x, y)
        y_pred = model.predict(x)
        prediction = list(y_pred)
        yvalues = list(df['sale'])
        return { 'data':prediction, 'yvalues': yvalues }
    except:
        return 'Enter the correct format'


#final output of spare parts production
@api.route('/produceSpareParts',methods=['POST'])
def spare():
    try:
        spare_data=json.loads(request.data)
        vehicle = []
        vehicle.append(spare_data['data'])
        spare = spare_data['spare']
        month = spare_data['month']
        year = str(date.today().year)
        year = month+"-01-"+year
        print(year)
        date_object = datetime.strptime(year, '%m-%d-%Y').date()
        print('date_object',date_object)
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        # this will produce the expire date product
        def expiry():
            sql='select expire from dummy where spare_model = %s'
            data = [spare]
            cursor.execute(sql,data)
            rslt = cursor.fetchall()
            print('rslt ----> ', rslt) #it returns product expire month 
            exp = rslt[0]['expire']
            print('exp --> ', exp)
            return(exp)
        def calculation():
            expry = int(expiry())
            endpoint = date_object + relativedelta(months=-expry)
            print('endpoint ---> ',endpoint)
            date=str(endpoint)
            queryDate='%'+date[5:7]+'/'+date[:4]+'%'
            print(queryDate)
            vehicle.append(queryDate)
            vehicle[0],vehicle[1]=vehicle[1],vehicle[0]
            print('vehicle---> ', vehicle)
            sql='select * from finaldata where date LIKE %s and model=%s'
            cursor.execute(sql,vehicle)
            sales=cursor.fetchall()
            sales=list(sales)   
            # print('sales----------> ',sales)
            Tsales=0
            for idx in range(len(sales)):
                Tsales += sales[idx]['count']
            print('Tsales',Tsales)
            return(Tsales)
        predict=calculation()
        return{'forecast':predict}
    except:
        print("========> An exception occurred - ValueError <========")
        return {'error' : "Please fill all of the fields!"}


#fetching spare_parts models
@api.route('/sparePartsModel',methods=['POST'])
def spareparts():
    # print('request_data ==>', request.data)
    spare_data=json.loads(request.data)
    vehicle = []
    vehicle.append(spare_data['data'])
    print(type(spare_data['data']))
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    sql='select spare_model from dummy'
    cursor.execute(sql)
    part=list(cursor.fetchall())
    print(part)
    model = []
    for i in range(len(part)):
        model.append(part[i]['spare_model'])
    print('sparemodels -------->',model)
    return{'sparemodels':model}



if(__name__) == '__main__':
    api.run(debug=True)
