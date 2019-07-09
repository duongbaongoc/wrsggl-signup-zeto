var CALENDAR = function () { 
	    var wrap, label,  
	            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
 
	    function init(newWrap) { 
			wrap     = $(newWrap || "#cal"); 
			label    = wrap.find("#label"); 
			wrap.find("#prev").bind("click.calendar", function () { switchMonth(false); }); 
			wrap.find("#next").bind("click.calendar", function () { switchMonth(true);  }); 
			label.bind("click", function () { switchMonth(null, new Date().getMonth(), new Date().getFullYear()); });        
			label.click();
	    } 
 
	    function switchMonth(next, month, year) { 
			var curr = label.text().trim().split(" "), calendar, tempYear =  parseInt(curr[1], 10); 
			month = month || ((next) ? ( (curr[0] === "December") ? 0 : months.indexOf(curr[0]) + 1 ) : ( (curr[0] === "January") ? 11 : months.indexOf(curr[0]) - 1 )); 
			year = year || ((next && month === 0) ? tempYear + 1 : (!next && month === 11)
			calendar =  createCal(year, month); 
	        $("#cal-frame", wrap) 
	            .find(".curr") 
	                .removeClass("curr") 
	                .addClass("temp") 
	            .end() 
	            .prepend(calendar.calendar()) 
	            .find(".temp") 
	                .fadeOut("slow", function () { $(this).remove(); }); 
 
	        $('#label').text(calendar.label);
	    } 
 
	    function createCal(year, month) { 
			var day = 1, i, j, haveDays = true,  
	        startDay = new Date(year, month, day).getDay(), 
	        daysInMonths = [31, (((year%4==0)&&(year%100!=0))||(year%400==0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], 
	        calendar = [];
	    } 
	    createCal.cache = {}; 
	    return { 
	        init : init, 
	        switchMonth : switchMonth, 
	        createCal   : createCal 
	    }; 
	};