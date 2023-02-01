from flask import Flask,request,json
import numpy as np
import os 
import pandas as pd
from flask_mysqldb import MySQL
import MySQLdb.cursors
from datetime import date,datetime
from dateutil.relativedelta import relativedelta
from sklearn.linear_model import LinearRegression

from sympy import symbols, Eq, solve


api = Flask(__name__)

api.config['MYSQL_HOST'] = 'localhost'
api.config['MYSQL_USER'] = 'root'
api.config['MYSQL_PASSWORD'] = '#Hackhack07'
api.config['MYSQL_DB'] = 'Demand_Forecasting'

mysql = MySQL(api)


#least square regression
@api.route('/least_square_regression', methods=['POST'])
def l_regression():
    try:
        # print('request_data ==>', request.data)
        reqdata_data = json.loads(request.data)
        x = int(reqdata_data['forecast'])
        mon=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
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
        # eqn1 = f'{sigmaY} = a*{n} + b*{sigmaX}'
        # eqn2 = f'{sigmaXY} = a*{sigmaX} + b*{sigmaX_square}'
        # eqn1 = f'{sigmaX*n}*a + {sigmaX*sigmaX}*b - ({sigmaX*sigmaY})'
        # eqn2 = f'{n*sigmaX}*a + {n*(sigmaX_square)}*b - ({n*sigmaXY})'
        
        print()
        a, b = symbols('a b')
        eq1 = Eq((sigmaX*n)*a + (sigmaX*sigmaX)*b - sigmaX*sigmaY)
        eq2 = Eq((n*sigmaX)*a + (n*(sigmaX_square))*b - n*sigmaXY)
        # eq1 = Eq(936*a + 6084*b - (30810))
        # eq2 = Eq(936*a + 7800*b - (31176))

        sol_dict = solve((eq1,eq2), (a, b))
        a = float(sol_dict[a])
        b = float(sol_dict[b])
        forecastedValue = a + (b * x)
        forecastedValue = round(forecastedValue)
        # print('forecastedValue ',forecastedValue)
        x = np.linspace(1, 12, 12)
        y = a + b*x
        y = list(y)
        # print(eqn1 - eqn2)
        return {'forecastedValue':forecastedValue, 'yvalues': y, 'sales': dependentVariable}
        
        
    except:
        print('Error occured')
        return {'error1' : "Enter a valid input"}
      



if(__name__) == '__main__':
    api.run(debug=True)