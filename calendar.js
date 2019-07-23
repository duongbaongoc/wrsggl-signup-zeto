const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var apiUrl = 'http://localhost:5000';

var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
    
var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };

//This function highlights today's cells
function highlight_today(in_month, in_year)
{
	//get today's info	
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = today.getMonth();
	var month = monthNames[mm]
	var yyyy = today.getFullYear();
	
	//highlight today's date
	if (in_month == month && in_year == yyyy)
	{
		document.getElementById('cal-frame').querySelectorAll("td").forEach(function(el)
		{
			if (el.innerHTML == dd)
			{
				el.style.border = "thick dotted gold";
			}
		});
	}
}

//This function initializes the calendar
function init_cal ()
{
	// get the calendar element
	cal = document.getElementById("cal");
	
	//get today's info	
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = today.getMonth();
	var month = monthNames[mm]
	var yyyy = today.getFullYear();
	
	//get current month and year
	cal.querySelector('.month-year').innerHTML = month + " " + yyyy;

	//set the cal-frame correctly for today's month and year
	set_cal_frame(mm, yyyy);
	
	highlight_today(month, yyyy);
	
	add_circles();
	
	show_reservations();
}

//This function adds circles to each cell of the calendar
//Each circle represents a sign-up/plate name
function add_circles()
{
	document.getElementById('cal-frame').querySelectorAll("td").forEach(function(el)
		{
			for (var i = 0; i <= 15; i++)
			{
				var dot = document.createElement("span");
				dot.className += "dot";
				dot.style.height = "15px";
				dot.style.width = "15px";
				dot.style.cssFloat = "right";
				dot.style.borderRadius = "50%";
				dot.style.margin = "2px 2px 2px 2px";
				
				if (i % 4 == 0)
				{
					dot.style.clear = "right";
				}
				
				el.appendChild(dot);
			}
			
			
		});
}

//This function is to set the correct cal-frame content
function set_cal_frame(mm, yyyy)
{
	var first_day = String(new Date(yyyy, mm, 1)).split(" ")[0];
	var num_days = new Date(yyyy, mm + 1, 0).getDate();
	
	//get the cal-frame correctly for today's month-year
	var before_first_date = true;
	var day_count = 1;
	document.getElementById('cal-frame').querySelectorAll("td").forEach(function(el)
	{
		//before the first date
		if (el.className == first_day)
		{
			before_first_date = false;
		}
		
		//set class = 'nil' before the first_day
		if (before_first_date == true)
		{
			el.className = "nil";
			el.innerHTML = "";
		}
		
		//set legit dates
		else if (day_count <= num_days)
		{
			el.innerHTML = day_count;
			day_count += 1;
		}
		
		//set class = 'nil' after last date
		else
		{
			el.className = "nil";
			el.innerHTML = "";
		}
	});
}

//This function resets classnames of all cells
function reset_cell_classnames()
{
	document.getElementById('cal-frame').querySelectorAll("tr").forEach(function(row)
	{
		row.querySelectorAll("td")[0].className = "Sun";
		row.querySelectorAll("td")[1].className = "Mon";
		row.querySelectorAll("td")[2].className = "Tue";
		row.querySelectorAll("td")[3].className = "Wed";
		row.querySelectorAll("td")[4].className = "Thu";
		row.querySelectorAll("td")[5].className = "Fri";
		row.querySelectorAll("td")[6].className = "Sat";
	});
}

//This function sets cell hover effects
function cell_hover_css()
{
	$(".curr td").hover(function(){
		if ($(this).attr('class') != 'nil')
		{
			$(this).css("background", "wheat");
		}
	}, function() {
		$(this).css("background", "honeydew");
	});
}

//This function is to move to previous month in the calendar
function goback()
{
	reset_cell_classnames();
	
	var today = new Date();
	//current time
	var cur_month_year = document.querySelector('.month-year').innerHTML;
	var cur_month = cur_month_year.split(" ")[0];
	var cur_year = cur_month_year.split(" ")[1];
	
	//get previous month
	var cur_ind = monthNames.indexOf(cur_month);
	if (cur_ind == 0)
	{
		var prev_month = "December";
		var prev_year = String(parseInt(cur_year,10) - 1);
	}
	else
	{
		var prev_month = monthNames[cur_ind - 1];
		var prev_year = cur_year;
	}
	
	//cancel hightlight today
	document.getElementById('cal-frame').querySelectorAll("td").forEach(function(el)
	{
		el.style.border = "1px solid #e6e6e6";
		
	});
	
	//update previous month and year on the webpage
	document.querySelector('.month-year').innerHTML = prev_month + " " + prev_year;
	
	//set the cal-frame correctly for today's month and year
	var mm = monthNames.indexOf(prev_month);
	var yyyy = prev_year;
	set_cal_frame(mm, yyyy);
	
	//cell_hover_css();
	
	highlight_today(prev_month, prev_year);
}

//This function is to move to previous month in the calendar
function goforward()
{
	reset_cell_classnames();
	
	//cancel hightlight today
	document.getElementById('cal-frame').querySelectorAll("td").forEach(function(el)
	{
		el.style.border = "1px solid #e6e6e6";
		
	});
	
	//current time
	var cur_month_year = document.querySelector('.month-year').innerHTML;
	var cur_month = cur_month_year.split(" ")[0];
	var cur_year = cur_month_year.split(" ")[1];
	
	//get next month
	var cur_ind = monthNames.indexOf(cur_month);
	if (cur_ind == 11)
	{
		var next_month = "January";
		var next_year = String(parseInt(cur_year,10) + 1);
	}
	else
	{
		var next_month = monthNames[cur_ind + 1];
		var next_year = cur_year;
	}
	
	//update next month and year on the webpage
	document.querySelector('.month-year').innerHTML = next_month + " " + next_year;
	
	//set the cal-frame correctly for today's month and year
	var mm = monthNames.indexOf(next_month);
	var yyyy = next_year;
	set_cal_frame(mm, yyyy);
	
	//cell_hover_css();
	
	highlight_today(next_month, next_year);
}

//This function is to sign up for a slot
function signup()
{
	/***********verify inputs***********/
	//Date
	var date = document.getElementById("signup_date").value;
	if (!date)
	{
		 alertify.alert("Missing a sign up date");
		 return;
	}
	
	//Date must be later today or in the future
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = today.getMonth();
	var month = monthNames[mm]
	var yyyy = today.getFullYear();
	
	var correct_mm = String(parseInt(mm) + 1);
	if (correct_mm.length == 1)
	{
		correct_mm = "0" + correct_mm;
	}
	
	if (Date.parse(yyyy + "-" + correct_mm + "-" + dd) > Date.parse(date))
	{
		 alertify.alert("Can not choose a date in the past");
		 return;
	}
	
	//User
	var user = document.getElementById("signup_username");
	if (!user || user.value == "")
	{
		 alertify.alert("Missing an user name");
		 return;
	}
	
	//Number of markers
	var n_markers = document.getElementById("markers");
	if (!n_markers || n_markers.value == "")
	{
		 alertify.alert("Missing number of markers");
		 return;
	}
	
	//Principle investigator
	var PI = document.getElementById("PI");
	if (!PI || PI.value == "")
	{
		 alertify.alert("Missing Principle Investigator");
		 return;
	}
	
	//Plate name
	var plateName = document.getElementById("plateName");
	if (!plateName || plateName.value == "")
	{
		 alertify.alert("Missing plate name");
		 return;
	} 
	
	//Plate name must be unique for this day
	
	//Email
	var email = document.getElementById("email");
	if (!email || email.value == "")
	{
		 alertify.alert("Missing email");
		 return;
	} 
	
	//New password
	var pw1 = document.getElementById("password1");
	if (!pw1 || pw1.value == "")
	{
		 alertify.alert("Missing new password");
		 return;
	} 
	
	//Retype password
	var pw2 = document.getElementById("password2");
	if (!pw2 || pw2.value == "")
	{
		 alertify.alert("Retype the password");
		 return;
	} 
	
	//lab name
	var lab = document.getElementById("labname");
	if (!lab || lab.value == "")
	{
		 alertify.alert("Missing abbreviation lab name");
		 return;
	} 
	
	/***********verify password***********/
	if (pw1.value != pw2.value)
	{
		alertify.alert("'New Password' and 'Retype Password' do not match");
		return;
	}
	
	/***********verify lab name***********/
	if (lab.value.toUpperCase() != "WRSGGL")
	{
		alertify.alert("Incorrect lab name");
		return;
	}
	
	/***********get the rest fields***********/
	var all_ladder = document.getElementById("ladder").getElementsByTagName("input");
	for (var i = 0, num = all_ladder.length; i < num; i++)
	{
		if (all_ladder[i].checked)
		{
			var selected_ladder = all_ladder[i].value;
		}
	}
	
	var selected_fluors = "";
	var all_fluors = document.getElementById("fluor").getElementsByTagName("input");
	for (i = 0, num = all_fluors.length; i < num; i++)
	{
		if (all_fluors[i].checked)
		{
			selected_fluors += all_fluors[i].value + ",";
		}
	} 
	
	var all_platetype = document.getElementById("platetype").getElementsByTagName("input");
	for (i = 0, num = all_platetype.length; i < num; i++)
	{
		if (all_platetype[i].checked)
		{
			var selected_platetype = all_platetype[i].value;
		}
	} 
	
	/***********verify availability***********/
	//check if anyone ever signed up for this date (Availability table -> CheckAvailabilityTableDate)
	var available = true;
	
	//have a variable for each plate type
	var Num96PlatesAvail = 0;
	var Num384PlatesAvail = 0;
	if (selected_platetype == "96")
	{
		Num96PlatesAvail += 1;
	}
	else
	{
		Num384PlatesAvail += 1;
	}
	
	//reservation entry to create
	var reservation_entry = {
        ThisDate: date,
		User: user.value,
		Markers: n_markers.value,
		Ladder: selected_ladder,
		Flour: selected_fluors,
		PlateType: selected_platetype,
		PI: PI.value,
		PlateName: plateName.value,
		Email: email.value,
		Password: pw1.value
    };
	
	//Availability entry, used only when create new Availability entry (the date does not exist yet)
	var availability_entry = { 
		ThisDate: date,
		Num96PlatesAvail: Num96PlatesAvail,
		Num384PlatesAvail: Num384PlatesAvail
	};
	
	//handle to create an entry in the Availability table
	var onSuccess_make_availability = function (data) {
		console.log("Successfully created an entry for the Availability table.");
	};	
	var onFailure_make_availability = function () {
		alertify.alert("Failed to sign up due to backend error. Please contact the lab.");
		return;
	};
	
	//entry to update Availability
	var update_entry = {
		date: date,
		plateType: selected_platetype
	}
	
	//handle to update Availability
	var onSuccess_update_availability = function(data){
	};
	var onFailure_update_availability= function(){
		alertify.alert("Failed to sign up due to backend error. Please contact the lab.");
		return;
	};
	
	//handle to check if a date in the Availability table exists
	var onSuccess_avail_exist = function (data) {
		if (data.status == 1)//if exists => update the table
		{
			makePostRequest("/api/add_to_availability", update_entry, onSuccess_update_availability, onFailure_update_availability);
		}
		else//if does not exist => create a new entry
		{
			makePostRequest("/api/availability", availability_entry, onSuccess_make_availability, onFailure_make_availability);
		}
	};	
	var onFailure_avail_exist = function () {
		alertify.alert("Failed to sign up due to backend error. Please contact the lab.");
		return;
	};
		
	//handle to add a reservation entry and availability entry to the tables
	var onSuccess_make_reservation = function (data) {
		//check if the date exists in the Availability table
		makeGetRequest("/api/check-avail-table-date?yyyy_mm_dd=" + date, onSuccess_avail_exist, onFailure_avail_exist);
		alertify.alert("You have successfully signed up for " + date);
	};
	var onFailure_make_reservation = function () {
		alertify.alert("Failed to sign up due to backend error. Please contact the lab.");
		return;
	};
	
	//call to add entries
	if (available == true) //add this reservation to the Availability and Reservation table (backend)
	{
		makePostRequest("/api/reservation", reservation_entry, onSuccess_make_reservation, onFailure_make_reservation);
	}
	
	//if noone => sign up
	//else => check if enough room for this plate
	
	//save info in the web server
	
	//load info of this month to the front end

	
	
}

//This function is to remove a slot
function remove()
{
	/***********verify inputs***********/
	//Date
	/*var date = document.getElementById("remove_date").value;
	if (!date)
	{
		 alertify.alert("Missing a remove date");
		 return;
	}
	
	//User name
	var name = document.getElementById("platename2").value;
	if (!name || name.value == "")
	{
		 alertify.alert("Missing a plate name");
		 return;
	}
	
	//Password
	var pw3 = document.getElementById("pw3");
	if (!pw3 || pw3.value == "")
	{
		 alertify.alert("Missing password to remove");
		 return;
	} 
	
	//make sure the date is in the future
	//make sure there is this plate name on that date
	//make sure the password is correct
	*/
	//////////to test post requests
}


//show all reservations of the month that is currently shown in the calendar
function show_reservations()
{
	//get the current shown month and year
	var month_yyyy = document.getElementById("label").innerHTML;
	var mm = String(monthNames.indexOf(month_yyyy.split(" ")[0]) + 1);
	if (mm.length == 1)
	{
		mm = "0" + mm;
	}
	var yyyy_mm = month_yyyy.split(" ")[1] + "-" + mm;
	
	//make all dates of this month available for now
	document.getElementById('cal-frame').querySelectorAll("td").forEach(function(el)
	{
		if (el.className != "nil")
		{
			el.innerHTML = "<span class='cyan' style='border-radius: 50%;padding:3px;' >" + el.innerHTML + "</span>";
		}
		
		//hide all user circles
		var child_list = el.childNodes[0].getElementsByClassName("dot");
		if (child_list.length > 0)
		{
			for (var child of child_list)
			{
				child.style.boxShadow = "none";
				child.style.background = "transparent";
			}
		}
	});
		
	//get the available days of this month and their availability (how many plates available on each day)
	var onSuccess_available = function (data) {
        var date_list = data.availability;
		date_list.forEach(function(date){
			avail_status = date_available(date.Num96PlatesAvail, date.Num384PlatesAvail);
			if (avail_status["status"] == "unavail")
			{
				var date = date.ThisDate.split("-")[2];
				var cell = date_get_cell(date);
				var ind = cell.innerHTML.indexOf(date, 0);
				cell.innerHTML = "<span class='lightsalmon' style='border-radius: 50%;padding:3px;'>" + cell.innerHTML.substring(ind, cell.innerHTML.length);
			}
		});
    };
    var onFailure_available = function () {
        alertify.alert("Failed to sign up due to backend error. Please contact the lab.");
    };
    makeGetRequest("/api/month_availability?yyyy_mm=" + yyyy_mm, onSuccess_available, onFailure_available); 
	
	//get all reservations for this month
	var onSuccess_reservation = function (data) {
        var reservation_list = data.entries;
		
		//show them in the calendar
		reservation_list.forEach(function(el) {
			var date = el.ThisDate.split("-")[2]; //date of month
			var cell = date_get_cell(date);//get the cell on the calendar of this date
			
			//get the next user circle
			var circle_list = cell.childNodes[0].getElementsByClassName("dot");
			
			for (var child of circle_list)
			{
				if (child.style.background == "transparent")
				{
					child.style.boxShadow = "1px 2px 1px rgba(0,0,0,.5)";
					child.style.background = "lightskyblue";
					child.className = "tooltip";
					var span = document.createElement("span");
					span.className += "tooltiptext";
					span.innerHTML = el.User;
					span.style.marginLeft = "20px";
					child.appendChild(span);
					child.onclick = function() {
						var panel = document.getElementById("reservation_info");
						var message = "<span style='margin-left:45px;'>SIGN-UP INFO</span><br><br>";
						message += "USER:<span style='margin-left:115px;'>" + el.User + "<br>";
						message += "PLATE NAME:<span style='margin-left:60px;'>" + el.PlateName + "<br>";
						message += "Date:<span style='margin-left:126px;'>" + el.ThisDate + "<br>";
						message += "Number of Markers:<span style='margin-left:23px;'>" + el.Markers + "<br>";
						message += "Ladders:<span style='margin-left:102px;'>" + el.Ladder + "<br>";
						message += "Fluors:<span style='margin-left:116px;'>" + el.Flour + "<br>";
						message += "Plate Type:<span style='margin-left:85px;'>" + el.PlateType + "<br>"; 
						message += "Principle Investigator:<span style='margin-left:12px;'>" + el.PI + "<br>"; 
						message += "Email:<span style='margin-left:121px;'>" + el.Email + "<br>";
						panel.innerHTML = message;
					};
					break;
				}
			}
		});
    };
    var onFailure_reservation = function () {
        alertify.alert("Failed to sign up due to backend error. Please contact the lab.");
    };
    makeGetRequest("/api/month_reservations?yyyy-mm=" + yyyy_mm, onSuccess_reservation, onFailure_reservation);
	
	
	//for each cell in the calendar 
	//{
		//if date of the cell is not in the list of reservation => green, move on to next cell
		//else =>  
		
	//remove content of "nil" cells
	document.getElementById('cal-frame').querySelectorAll("td").forEach(function(c){
		if (c.className == "nil")
		{
			while (c.firstChild)
			{
				c.removeChild(c.firstChild);
			}
		}
	});
}

//This function checks if a an existing date is still available to schedule plates
//param n_96: int - number of 96 plates
//param n_384: int - number of 384 plates
//return "avail" or "unavail", and how many avail plates of each plate type
function date_available(n_96, n_384){
	var total_wells = 1536;
	var unavail_wells = n_96*96 + n_384*384;
	var avail_wells = total_wells - unavail_wells;
	
	if (avail_wells <= 0)
	{
		return {"status": "unavail", "96": 0, "384": 0};
	}
	else
	{
		return {"status": "avail", "96": Math.floor(avail_wells / 96), "384": Math.floor(avail_wells / 384)};
	}
}

//This function takes a date (i.e. 23rd) and returns a calendar cell of that date
//param dd : String type, i.e. "23"
function date_get_cell(dd)
{
	for (var el of document.getElementById('cal-frame').querySelectorAll("td"))
	{
		if (el.className != "nil")
		{
			var date = el.innerHTML.split(">")[1].split("<")[0];
			if (date == dd)
			{
				return el;
			}
		}
	}
}

//This function displays availability info of a date when clicked
function show_avail(cell)
{
	//current time
	var cur_month_year = document.querySelector('.month-year').innerHTML;
	var cur_month = cur_month_year.split(" ")[0];
	var cur_year = cur_month_year.split(" ")[1];
	var mm = String(monthNames.indexOf(cur_month) + 1);
	if (mm.length == 1)
	{
		mm = "0" + mm;
	}
	var dd = cell.innerHTML.split(">")[1].split("<")[0];
	
	var message = "<span style='margin-left:45px;'>AVAILABILITY</span><br><br>";
	message += "Date:<span style='margin-left:123px;'>" + cur_month + dd + cur_year + "</span><br>";
	
	//get cell info from backend
	var onSuccess_available = function (data) {
		if (data.status == 0) //date is not in Availability table => available
		{
			message +=  "Number of 96-plates  :<span style='margin-left:9px;'>16 plates</span><br><span style='margin-left:45px;'>OR</span><br>Number of 384-plates:<span style='margin-left:5px;'>4 plates</span><br>";
		}
		else //check Availability
		{
			var avail_status = date_available(data.Availability.Num96PlatesAvail, data.Availability.Num384PlatesAvail);
			message +=  "Number of 96-plates  :<span style='margin-left:9px;'>" + avail_status["96"] + " plates</span><br><span style='margin-left:45px;'>OR</span><br>Number of 384-plates:<span style='margin-left:5px;'>" + avail_status["384"] + " plates</span><br>";
		}
       
		document.getElementById("avail_info").innerHTML = message;
    };
    var onFailure_available = function () {
        alertify.alert("Failed to sign up due to backend error. Please contact the lab.");
    };
    makeGetRequest("/api/date_availability?yyyy_mm_dd=" + cur_year + "-" + mm + "-" + dd, onSuccess_available, onFailure_available); 
}