from flask import Flask, jsonify, request
from flask import redirect, url_for
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy
import flask
from sqlalchemy import literal
import datetime

#All dates are String type of format: yyyy-mm-dd

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
    
class Availability(db.Model): #dates that are not in the table are available
    ThisDate = db.Column(db.String(10), nullable = False, unique= True, primary_key = True)
    Num96PlatesRegistered = db.Column(db.Integer, nullable = False) #number of plates used/signed up for
    Num384PlatesRegistered = db.Column(db.Integer, nullable = False) #number of plates used/signed up for
    
class Reservation(db.Model):
    id = db.Column(db.Integer, nullable = False, primary_key=True, unique = True)
    ThisDate = db.Column(db.String(10), nullable = False)
    User = db.Column(db.String(50), nullable = False)
    Markers = db.Column(db.Integer, nullable = False)
    Ladder = db.Column(db.Integer, nullable = False)
    Flour = db.Column(db.String(20), nullable = False) #i.e. "FAM,VIC,NED,"
    PlateType = db.Column(db.Integer, nullable = False)
    PI = db.Column(db.String(50), nullable = False)
    PlateName = db.Column(db.String(50), nullable = False)
    Email = db.Column(db.String(70), nullable = False)
    Password = db.Column(db.String(50), nullable = False)

class Recycle(db.Model):
    id = db.Column(db.Integer, nullable = False, primary_key=True, unique = True)
    ThisDate = db.Column(db.String(10), nullable = False)
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

#Create an entry in the Availability table
@app.route(base_url + 'availability', methods=['POST'])
def AvailabilityCreate(): 
    row = Availability(**request.json)
    db.session.add(row)
    db.session.commit()
    db.session.refresh(row)

    return jsonify({"status": 1, "Availability": Availability_to_row_obj(row)}), 200

#Create an entry in the Reservation table
@app.route(base_url + 'reservation', methods=['POST'])
def ReservationCreate(): 
    row = Reservation(**request.json)
    db.session.add(row)
    db.session.commit()
    db.session.refresh(row)

    return jsonify({"status": 1, "Reservation": Reservation_to_row_obj(row)}), 200

#Create an entry in the Recycle table
@app.route(base_url + 'recycle', methods=['POST'])
def RecycleCreate(): 
    row = Recycle(**request.json)
    db.session.add(row)
    db.session.commit()
    db.session.refresh(row)

    return jsonify({"status": 1, "Recycle": Recycle_to_row_obj(row)}), 200

############################################################################
#########REQUESTS: CHECK IF A VALUE ALREADY EXISTS##########################

#Availability table
#Check if a date already exists in the table
#Return a JSON object whose status is 1 if it does and 0 otherwise
@app.route(base_url + 'check-avail-table-date', methods=["GET"])
def CheckAvailabilityTableDate():
    date = request.args.get('yyyy_mm_dd')
    dateExist = Availability.query.filter(Availability.ThisDate==date).first()
    if (dateExist != None):
        return jsonify({"status": 1,"date":date}), 200
    else:
        return jsonify({"status": 0}), 200


############################################################################
######### REQUEST: RETURN ENTRIES (JSON) OF A TABLE WITH PARAM #############

#Availability table
#Return the entry of a date
@app.route(base_url + "date_availability", methods=["GET"])
def DateAvailability():
    date = request.args.get('yyyy_mm_dd', None)
    dateExist = Availability.query.filter(Availability.ThisDate==date).first()
    if (dateExist != None):
        return jsonify({"status": 1,"Availability":Availability_to_row_obj(dateExist)}), 200
    else:
        return jsonify({"status": 0}), 200 
    
#Availability table
#Return all entries (JSON) of a month
#Example route: /api/month_availability?yyyy_mm=2019-07
@app.route(base_url + 'month_availability', methods=["GET"])
def MonthAvailability():
    month = request.args.get('yyyy_mm', None)
    if (month is None):
        return jsonify({"status":0,"availability": "no month is given"}), 500
		
    entries = Availability.query.filter(Availability.ThisDate.contains(month))
    
    result = []
    for row in entries:
        result.append(Availability_to_row_obj(row))
    
    return jsonify({"status":1,"availability": result}), 200   

#Reservation table
#Return all entries of a month
@app.route(base_url + 'month_reservations', methods=["GET"])
def MonthReservations():
    yyyy_mm = request.args.get('yyyy-mm', None)
    if (yyyy_mm is None):
        return jsonify({"status":0,"entries": "no month is given"}), 500
		
    entries = Reservation.query.filter(Reservation.ThisDate.contains(yyyy_mm))

    result = []
    for row in entries:
        result.append(Reservation_to_row_obj(row))
    
    return jsonify({"status":1,"entries": result}), 200

#Reservation table
#Return an entry for a given date and plate name
@app.route(base_url + 'date_platename_entry', methods=["GET"])
def DatePlateNameEntry():
    date = request.args.get('yyyy_mm_dd', None)
    name = request.args.get('plate_name', None)
    
    if (date is None):
        return jsonify({"status":0,"entry": "no date is given"}), 500

    if (name is None):
        return jsonify({"status":0,"entry": "no plate name is given"}), 500
		
    entry = Reservation.query.filter(Reservation.ThisDate==date,Reservation.PlateName==name).first()

    if not entry:
        return jsonify({"status":0,"entry": "not found"}), 200
    
    return jsonify({"status":1,"entry":Reservation_to_row_obj(entry)}), 200
    

############################################################################
#########REQUEST: UPDATE CHANGES TO TABLES##################################

#Availability table
#Increament Num96PlatesRegistered or Num384PlatesRegistered by 1 depending on the param
@app.route(base_url + 'add_to_availability', methods=["POST"])
def AddToAvail():
    info = request.json #i.e. {date: "2019-07-19", plateType: "96"}
    date = info["date"]
    plateType = info["plateType"]
    entry = Availability.query.filter(Availability.ThisDate == date).first()
    if (plateType == "96"):
        entry.Num96PlatesRegistered += 1
    else:
        entry.Num384PlatesRegistered += 1
  
    db.session.commit()

    return jsonify({"status": 1, "Availability": Availability_to_row_obj(entry)}), 200

############################################################################
#########REQUESTS: REMOVE A RECORD FROM A TABLE#############################

#Reservation table
#Given a date and a plate name, remove the entry (plate name is unique for each date)
@app.route(base_url + 'remove-application', methods=["DELETE"])
def RemoveReservation():
    date = request.args.get('yyyy_mm_dd', None)
    name = request.args.get('plate_name', None)
    
    if (date is None):
        return jsonify({"status":0,"entry": "no date is given"}), 500

    if (name is None):
        return jsonify({"status":0,"entry": "no plate name is given"}), 500
		
    entry = Reservation.query.filter(Reservation.ThisDate==date,Reservation.PlateName==name)

    entry.delete()
    db.session.commit()
    return jsonify({"status": 1}), 200

############################################################################
#########CONVERT A QUERY ROW TO A JSON OBJECT###############################

#Availability row
def Availability_to_row_obj(row):
    row = {
            "ThisDate": row.ThisDate,
            "Num96PlatesRegistered": row.Num96PlatesRegistered,
            "Num384PlatesRegistered": row.Num384PlatesRegistered
        }
    return row

#Reservation
def Reservation_to_row_obj(row):
    row = {
            "id": row.id,
            "ThisDate": row.ThisDate,
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
            "ThisDate": row.ThisDate,
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
