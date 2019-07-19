from flask import Flask, jsonify, request
from flask import redirect, url_for
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy
import flask
import datetime

############################################################################
#########CONNECT TO THE DATABASE############################################

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///App.db'
db = sqlalchemy.SQLAlchemy(app)

base_url = '/api/'

############################################################################
#########EACH CLASS IS FOR ONE TABLE OF THE DATABASE########################

class Date(db.Model): #dates that are not in the table are available
    Date = db.Column(db.Date, unique = True, primary_key = True)
    Num96PlatesAvail = db.Column(db.Integer, nullable = False)
    Num384PlatesAvail = db.Column(db.Integer, nullable = False)
    
class Reservation(db.Model):
    id = db.Column(db.Integer, nullable = False, primary_key=True, unique = True)
    Date = db.Column(db.Date, nullable = False)
    User = db.Column(db.String(50), nullable = False)
    Markers = db.Column(db.Integer, nullable = False)
    Ladder = db.Column(db.Integer, nullable = False)
    Flour = db.Column(db.String(5), nullable = False)
    PlateType = db.Column(db.Integer, nullable = False)
    PI = db.Column(db.String(50), nullable = False)
    PlateName = db.Column(db.String(50), nullable = False)
    Email = db.Column(db.String(70), nullable = False)
    Password = db.Column(db.String(50), nullable = False)

class Recycle(db.Model):
    id = db.Column(db.Integer, nullable = False, primary_key=True, unique = True)
    Date = db.Column(db.Date, nullable = False)
    User = db.Column(db.String(50), nullable = False)
    Markers = db.Column(db.Integer, nullable = False)
    Ladder = db.Column(db.Integer, nullable = False)
    Flour = db.Column(db.String(5), nullable = False)
    PlateType = db.Column(db.Integer, nullable = False)
    PI = db.Column(db.String(50), nullable = False)
    PlateName = db.Column(db.String(50), nullable = False)
    Email = db.Column(db.String(70), nullable = False)
    Password = db.Column(db.String(50), nullable = False)

############################################################################
#########REQUEST: CREATE A NEW DATA ENTRY###################################

#Create an entry in the Date table
@app.route(base_url + 'date', methods=['POST'])
def DateCreate(): 
    row = Date(**request.json)
    db.session.add(row)
    db.session.commit()
    db.session.refresh(row)

    return jsonify({"status": 1, "Date": Date_row_to_obj(row)}), 200

#Create an entry in the Reservation table
@app.route(base_url + 'reservation', methods=['POST'])
def ReservationCreate(): 
    row = Reservation(**request.json)
    db.session.add(row)
    db.session.commit()
    db.session.refresh(row)

    return jsonify({"status": 1, "Reservation": Reservation_row_to_obj(row)}), 200

#Create an entry in the Recycle table
@app.route(base_url + 'recycle', methods=['POST'])
def RecycleCreate(): 
    row = Recycle(**request.json)
    db.session.add(row)
    db.session.commit()
    db.session.refresh(row)

    return jsonify({"status": 1, "Recycle": Recycle_row_to_obj(row)}), 200

############################################################################
#########REQUESTS: CHECK IF A VALUE ALREADY EXISTS##########################

#Date table
#Check if a Date already exists in the table
#Return a JSON object whose status is 1 if it does and 0 otherwise
@app.route(base_url + 'check-date-table-date', methods=["GET"])
def CheckDateTableDate():
    date = request.args.get('date')
    dateExist = Date.query.filter(Date.Date==date).first()
    if (emailExist != None):
        return jsonify({"status": 1,"Date":date}), 200
    else:
        return jsonify({"status": 0}), 200

############################################################################
######### REQUEST: RETURN ENTRIES (JSON) OF A TABLE WITH PARAM #############

#Date table
#Return the entry (JSON) of a given date. If the date is not in the table, return "available"
#Example route: /api/date-availability?date=2019-?????????????????????????????????????????????????????????
@app.route(base_url + 'date-availability', methods=["GET"])
def DateAvailability():
    date = request.args.get('date', None)
    if (date is None):
        return jsonify({"status":0,"availability": "no date is given"}), 500
		
    entry = Date.query.filter(Date.Date==date).first()
    
    return jsonify({"status":1,"availability": Date_row_to_obj(entry)}), 200

    

############################################################################
#########REQUEST: UPDATE CHANGES TO TABLES##################################

############################################################################
#########REQUESTS: REMOVE A RECORD FROM A TABLE#############################

############################################################################
#########CONVERT A QUERY ROW TO A JSON OBJECT###############################

#Date row
def Date_to_row_obj(row):
    row = {
            "Date": row.Date,
            "Num96PlatesAvail": row.Num96PlatesAvail,
            "Num384PlatesAvail": row.Num384PlatesAvail
        }
    return row

#Reservation
def Reservation_to_row_obj(row):
    row = {
            "id": row.id,
            "Date": row.Date,
            "User": row.User,
            "Markers": row.Markers,
            "Ladder": row.Ladder,
            "Flour": row.Flour,
            "PlateType": row.PlateType,
            "PI": row.PI,
            "PlateName": row.PlateName,
            "Email": row.Email,
            "Password": row.Password
        }
    return row

#Recycle
def Recycle_to_row_obj(row):
    row = {
            "id": row.id,
            "Date": row.Date,
            "User": row.User,
            "Markers": row.Markers,
            "Ladder": row.Ladder,
            "Flour": row.Flour,
            "PlateType": row.PlateType,
            "PI": row.PI,
            "PlateName": row.PlateName,
            "Email": row.Email,
            "Password": row.Password
        }
    return row

############################################################################
#########CREATE TABLES AND RUN FLASK APPLICATIONS###########################

if __name__ == '__main__':
    db.create_all()
    app.run()
