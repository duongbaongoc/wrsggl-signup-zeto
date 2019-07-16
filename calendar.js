const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
	console.log(today);
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
	
	cell_hover_css();
	
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
	
	cell_hover_css();
	
	highlight_today(next_month, next_year);
}

//This function is to sign up for a slot
function signup()
{
	///////////verify inputs
	//Date
	var date = document.getElementById("signup_date").value;
	if (!date)
	{
		 alertify.alert("Missing a sign up date");
		 return;
	}
	
	//User
	user = document.getElementById("signup_username");
	if (!user || user.value == "")
	{
		 alertify.alert("Missing an user name");
		 return;
	}
	
	//Number of markers
	n_markers = document.getElementById("markers");
	if (!n_markers || n_markers.value == "")
	{
		 alertify.alert("Missing number of markers");
		 return;
	}
	
	document.getElementById('cal-frame').querySelectorAll("td").forEach(function(el)
	{
		el.style.backgroundColor = "gainsboro";
		
	});
}
