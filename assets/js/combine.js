//blue series
var mainStartColor = '#F6FBFE';
var mainSecondColor = '#55ACEE';
var mainMiddleColor = '#053A6C'
var mainEndColor = '#00223E';

//hard-coded on year -- change if needed 
var years= ["2013","2014"];
var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

var select_state;

var width = 640, 
    height = 300,
    path_piechart,
    radius = Math.max(width, height)/8;

//define margin
var margin = {top: 30, right: 80, bottom:30, left: 40},
    w = 430 - margin.left - margin.right,
    h = 290 - margin.top - margin.bottom,
    x = d3.time.scale().range([0, w]),
    y = d3.scale.linear().range([h, 0]);
//initialization
var time_chart = d3.select("#timechart")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // define the x axis and its class, append it to svg 
var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.time.format("%b"))
    .orient("bottom");
time_chart.append("svg:g")
    .attr("class", "x axis");

// define the y axis and its class, append it to svg
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
time_chart.append("svg:g")
    .attr("class", "y axis")
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("clients number(%)");
    

var line = d3.svg.line()
    .interpolate("basis")
   .x(function(d) { return x(d.month); })
    .y(function(d) { return y(d.count); });


//store all the information that the charts need 
var map = {};

var svg_piechart = d3.select("#piechart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width /2 + "," + height / 2 + ")");
svg_piechart.append("g")
    .attr("class","slices");
svg_piechart.append("g")
    .attr("class","labels");
svg_piechart.append("g")
    .attr("class","lines");

var pie = d3.layout.pie()
    .value(function(d) { 
        return d.value; 
    })
    .sort(null);

var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.5);

var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9); 

//read file build map and chart
d3.json("../../data/us.json", function(err, state){
    //console.log(data);
    generateSchoolInfo(function(isSchoolInfoSuccess){
        generateTimeInfo(function(isTimeInfoSuccess){
            generateLiquidInfoBaseOnState(function(isGenderInfoSuccess){
                if(isSchoolInfoSuccess && isTimeInfoSuccess && isGenderInfoSuccess) {
                    generateDefaultPieChart();
                    generateMap(state); 
                    generateDefaultTimeChart(); 
                    generateDefaultGenderChart();          
                }
            });
        }); 
    });
});


function generateColorFn(start, end, max) {
    var colors = d3.scale.linear()
        .domain([0,max*(1/3),max*(2/3),max]).range([start,mainSecondColor,mainMiddleColor,end]);
    return colors;
}

function generateMap(state) {
    //get the largest length in school_chart
    var max_clients=0;
    for(var key in map['school_chart']) {
        if(map['school_chart'][key]) {
            max_clients = Math.max(max_clients,map['school_chart'][key].length);
        }
    }
    //draw map with blue color series
    var colors = generateColorFn(mainStartColor, mainEndColor, max_clients);

    var svg_map = d3.select("#map")
    .append("svg")   
    .attr("width", width)
    .attr("height", height);

    var projection = d3.geo.albersUsa() 
        .scale(600)
        .translate([width / 3, height / 2])
        .precision(.1);

    var path_map = d3.geo.path()  
        .projection(projection); 

    svg_map.selectAll(".state")   
        .data(topojson.feature(state, state.objects.usStates).features)  
        .enter().append("path") 
        .attr("fill", function(d){
            if(!map['school_chart'][d.properties.STATE_ABBR]) {
                return colors(0);
            }
                return colors(map['school_chart'][d.properties.STATE_ABBR].length);
            }) 
        .attr("d", path_map)
        .on("mouseout",function(){
            d3.select(this).transition().duration(500).style("opacity",1);
        })
        .on("mouseover", function(){
            d3.select(this).append("title")
            .text(function(data){
                return data.properties.STATE_ABBR;
            });
            d3.select(this).transition().duration(500).style("opacity",.7);
        })
        .on("click", function(data) {
            //d3.select(this).transition().attr("fill", "red");
            changeMapBaseOnClick(data.properties.STATE_ABBR);
            getStateBaseOnClick(data.properties.STATE_ABBR, function(err, state){
                if(err){
                    console.log('error on getting back state information');
                } else {
                    changeTimeChart();
                }
            });
            changeGenderBaseOnClick(data.properties.STATE_ABBR);
        });

        
}

function changeMapBaseOnClick(state) {
    var clients = map['school_chart'][state];
    var universities ={};
    //used for drawing piechart
    var data =[];
    if(!clients) {
        alert('No clients found. choose another state');
        return;
    }
    for(var i=0;i<clients.length;i++) {
        if(clients[i].ori_sch.length >0) {
            if(!(clients[i].ori_sch in universities)) {
                universities[clients[i].ori_sch] = 1;
            } else {
                universities[clients[i].ori_sch] = universities[clients[i].ori_sch] +1;
            }
        }
    }
    for(key in universities) {
        university = {};
        university.label = key;
        university.value = universities[key].toString();
        data.push(university);
    }
    if(data.length > 10) {
        data = data.splice(0,10);
    }
    changePieChart(data);
}


function mergeWithFirstEqualZero(first, second){
    var secondSet = d3.set(); second.forEach(function(d) { secondSet.add(d.label); });

    var onlyFirst = first
        .filter(function(d){ return !secondSet.has(d.label) })
        .map(function(d) { return {label: d.label, value: 0}; });
    return d3.merge([ second, onlyFirst ])
        .sort(function(a,b) {
            return d3.ascending(a.label, b.label);
        });
};

function changePieChart(data) {
    //console.log(data);
    var key = function(d){ return d.data.label; };

    var color = d3.scale.category20();

    var data0 = svg_piechart.select(".slices").selectAll("path.slice")
        .data().map(function(d) { return d.data });
    if (data0.length == 0) data0 = data;
    var was = mergeWithFirstEqualZero(data, data0);
    var is = mergeWithFirstEqualZero(data0, data);
    /* ------- PIE SLICES -------*/
    //console.log(pie(was) + ' key : ' + key);
    var slice = svg_piechart.select(".slices").selectAll("path.slice")
                .data(pie(was), key);

    slice.enter()
        .insert("path")
        .attr("class", "slice")
        .style("fill", function(d) { return color(d.data.label); })
        .each(function(d) {
            this._current = d;
        });

    slice = svg_piechart.select(".slices").selectAll("path.slice")
        .data(pie(is), key);

    slice.
        append("title")
        .text(function(data){
            return "Clients number: " + data.value;
        });

    slice       
        .transition().duration(1000)
        .attrTween("d", function(d) {
            var interpolate = d3.interpolate(this._current, d);
            var _this = this;
            return function(t) {
                _this._current = interpolate(t);
                return arc(_this._current);
            };
        });

    slice = svg_piechart.select(".slices").selectAll("path.slice")
        .data(pie(data), key);

    slice
        .exit()
        .remove();

    /* ------- TEXT LABELS -------*/

    var text = svg_piechart.select(".labels").selectAll("text")
        .data(pie(was), key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .style("opacity", 0)
        .style("font-size","10px")
        .text(function(d) {
            return d.data.label;
        })
        .each(function(d) {
            this._current = d;
        });
    
    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text = svg_piechart.select(".labels").selectAll("text")
        .data(pie(is), key);

    text.transition().duration(1000)
        .style("opacity", function(d) {
            return d.data.value == 0 ? 0 : 1;
        })
        .attrTween("transform", function(d) {
            var interpolate = d3.interpolate(this._current, d);
            var _this = this;
            return function(t) {
                var d2 = interpolate(t);
                _this._current = d2;
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            var interpolate = d3.interpolate(this._current, d);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        });
    
    text = svg_piechart.select(".labels").selectAll("text")
        .data(pie(data), key);

    text
        .exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg_piechart.select(".lines").selectAll("polyline")
        .data(pie(was), key);
    
    polyline.enter()
        .append("polyline")
        .style("opacity", 0)
        .each(function(d) {
            this._current = d;
        });

    polyline = svg_piechart.select(".lines").selectAll("polyline")
        .data(pie(is), key);
    
    polyline.transition().duration(1000)
        .style("opacity", function(d) {
            return d.data.value == 0 ? 0 : .5;
        })
        .attrTween("points", function(d){
            this._current = this._current;
            var interpolate = d3.interpolate(this._current, d);
            var _this = this;
            return function(t) {
                var d2 = interpolate(t);
                _this._current = d2;
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.99 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };          
        });
    
    polyline = svg_piechart.select(".lines").selectAll("polyline")
        .data(pie(data), key);
    
    polyline
        .exit()
        .remove();
}

function generateSchoolInfo(callback) {
    var states = "^(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$";
    var pattern = new RegExp(states);
    school = {};
    for(var i=0;i<allClients.length;i++) {
        var client = allClients[i];
        //console.log('state: ' + client.state);
        if(!client.state || client.state === 'KI')
            continue;
        if(pattern.test(client.state)) {
            //console.log('only state: ' + client.state);
            if(!(client.state in school)) {
                school[client.state] = [];
            }
            //console.log('Array of schools 1: ' + school[client.state]);
            school[client.state].push(client);
            //console.log('only state: ' + client.state);
        } else {
            var state_split = client.state.trim().split(" ")[1];
            //console.log('city and state: ' + state_split);
            if(pattern.test(state_split)) {
                if(!(state_split in school)) {
                    school[state_split] = [];
                }
                school[state_split].push(client);
                //console.log('Array of schools 2: ' + school[state_split]);
            }
        }
    }
    map['school_chart'] = school;
    callback(true);
}

//date for time chart
function generateTimeInfo(callback) {
    var state_date_map = {};
    var school_state = map['school_chart'];
    for(var state in school_state) {
        var clients = school_state[state];
        for(var i=0;i<clients.length;i++) {
            var format_date = formateDate(clients[i].dismissal_time);
            var format_key = format_date + "-" + state;
            if(!(format_key in state_date_map)) {
                state_date_map[format_key] = 1;
            } else {
                state_date_map[format_key] = state_date_map[format_key] +1;
            }
        }
    }
    //generate data in case of missing data for the chart
    for(var i=0;i<years.length;i++) {
        for(var j=0;j<months.length;j++) {
            var year_month = years[i] + "-" + months[j];
            for(var state in school_state) {
                var year_month_state = year_month + "-" + state;
                if(!(year_month_state in state_date_map)) {
                    state_date_map[year_month_state] = 0;
                }
            }
        }
    }
    var year_state_map = {};
    for(var year_month_state in state_date_map) {
        var data_info = year_month_state.split("-");
        var year_state = data_info[0] + "-" + data_info[2];
        if(!(year_state in year_state_map)) {
            year_state_map[year_state] = state_date_map[year_month_state];
        } else {
            year_state_map[year_state] =  year_state_map[year_state]+ state_date_map[year_month_state];
        }
    }
    var state_month_map = {};
    for(var year_month_state in state_date_map) {
        var data_info = year_month_state.split("-");
        var month_state = data_info[1] + "-" + data_info[2];
        var year = data_info[0];
        if(!(month_state in state_month_map)) {
            state_month_map[month_state] = {};
            state_month_map[month_state][year] = state_date_map[year_month_state];
        } else {
            state_month_map[month_state][year] = state_date_map[year_month_state];
        } 
    } 
    var finalize_data = [];
    for(var month_state in state_month_map) {
        var date_info = month_state.split("-");
        var month = date_info[0];
        var state = date_info[1];
        var total_2013 = year_state_map["2013" + "-" + state];
        var total_2014 = year_state_map["2014" + "-" + state];
        if(total_2013 !=0) {
            var year_2013 = state_month_map[month_state]["2013"]/total_2013*100;
        } else {
            var year_2013 = 0;
        }
        if(total_2014 !=0) {
            var year_2014 = state_month_map[month_state]["2014"]/total_2014*100;
        } else {
            var year_2014 = 0;
        }
        var data_row = {month: month, state: state, year_2013: year_2013, year_2014: year_2014};   
        finalize_data.push(data_row);
    }
    finalize_data.sort(function(a,b){ return a.month-b.month});
    map['time_chart'] = finalize_data;
    callback(true);
}

function formateDate(dismissal_time) {
    var pattern1 = new RegExp("^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$");
    var pattern2 = new RegExp("^[0-9]{4}\.[0-9]{1,2}$");
    var pattern3 = new RegExp("^[0-9]{4}$");
    var date;
    if(dismissal_time) {
        date = dismissal_time.toString().trim();
        if(pattern1.test(date)) {
            var dates = date.split("/");
            if(dates[0].length !=2) {
                dates[0] = "0" + dates[0];
            }
            date = dates[2] + "-" + dates[0];
        } else if(pattern2.test(date)) {
            var dates = date.split(".");
            if(dates[1].length ==1) {
                dates[1] = "0" + dates[1];
            }
            date = dates[0] + "-" + dates[1];
        } else if(pattern3.test(date)) {
            date = date + "-" + "06";
        } 
    }
    return date;
}

function generateDefaultPieChart() {
    var state_clients = map['school_chart'];
    var universities = {};
    var top_universities =[];
    for(var state in state_clients) {
        var clients = state_clients[state];
        for(var i=0;i<clients.length;i++) {
            if(clients[i].ori_sch) {
                if(!(clients[i].ori_sch in universities)) {
                    universities[clients[i].ori_sch] = 1;
                } else {
                    universities[clients[i].ori_sch] = universities[clients[i].ori_sch]+1;
                }
            }
        }
    }
    for(var university in universities) {
        var university_object ={};
        university_object.label = university;
        university_object.value = universities[university];
        top_universities.push(university_object);
    }
    top_universities.sort(function(a,b) {
        return b.value-a.value;
    });
    //show top 5 universities 
    top_universities = top_universities.splice(0, 5);
    changePieChart(top_universities);

}


function generateDefaultTimeChart() {
    changeLineInTimeChart();
}

function getStateBaseOnClick(state, callback) {
    select_state = state;
    callback(null,select_state);
}

function changeTimeChart() {
    d3.transition().duration(1500).each(changeLineInTimeChart);
}

function changeLineInTimeChart() {
    //generate different color for each line
    var color = d3.scale.category10();
    var time_data=map['time_chart'];
    var nested = d3.nest().key(function(d){ return d.state}).map(time_data);  
    var data;
    if(select_state) {
        data = nested[select_state];
    } else {
        generateDefaultTimeInfo(function(err,default_data){
            data = default_data;
        });
    }
    //specify the key 
    var keyring = d3.keys(data[0]).filter(function(key){
        return (key != "month" && key !="state");
    });

    var transpose = keyring.map(function(name){
        return {
            name :name,
            values: data.map(function(d){
                return {month: d3.time.format("%m").parse(d.month), count: +d[name]};
            })
        };
    });
    // set the x and y domains as the max and min
    x.domain([
        d3.min(transpose, function(c) { return d3.min(c.values, function(v) { return v.month; }); }),
        d3.max(transpose, function(c) { return d3.max(c.values, function(v) { return v.month; }); })
    ]);

    y.domain([
        d3.min(transpose, function(c) { return d3.min(c.values, function(v) { return v.count; }); }),
        d3.max(transpose, function(c) { return d3.max(c.values, function(v) { return v.count; }); })
    ]);

    // announce to d3 that we will be using something called
    // "year" that makes use of the transposed data 
    var year = time_chart.selectAll(".year")
      .data(transpose);
     
    // create separate groups for each year
    // assign them a class and individual IDs (for styling) 
    var yearEnter = year.enter().append("g")
      .attr("class", "year")
      .attr("id", function(d) {return d.name; });
    
    // draw the lines and color them according to their names
    yearEnter.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

    // create lables for each year
    // set their position to that of the month and clientNum
    yearEnter.append("text")
     .attr("class", "names")
     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
     .attr("transform", function(d) { return "translate(" + x(d.value.month) + "," + y(d.value.count) + ")"; })
     .attr("x", 4)
     .attr("dy", ".35em")
     .text(function(d) { return d.name; });

    // set variable for updating visualization
    var yearUpdate = d3.transition(year);
    // change values of path to those of the new series
    yearUpdate.select("path")
      .attr("d", function(d) { return line(d.values); });
    
    // change position of text alongside the moving path  
    yearUpdate.select("text")
       .attr("transform", function(d) { return "translate(" + x(d.values[d.values.length - 1].month) + "," + y(d.values[d.values.length - 1].count) + ")"; });
  
  // update the axes, though only the y axis will change    
    d3.transition(time_chart).select(".y.axis")
        .call(yAxis);   
          
    d3.transition(time_chart).select(".x.axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

}

function generateDefaultTimeInfo(callback) {
    //hard coded on year -- change if needed
    var default_data=[];
    var year_month_map = {};
    var year_map = {};
    for(var i=0;i<allClients.length;i++) {
        if(allClients[i].dismissal_time) {
            var year_month = formateDate(allClients[i].dismissal_time);
            if(!(year_month in year_month_map)) {
                year_month_map[year_month] =1;
            } else {
                year_month_map[year_month] =year_month_map[year_month]+ 1;
            }
        }
    }
    for(var year_month in year_month_map) {
        var year = year_month.split("-")[0];
        if(!(year in year_map)) {
            year_map[year] = year_month_map[year_month];
        } else {
            year_map[year] = year_map[year] + year_month_map[year_month];
        }
    }
    for(var i=0;i<months.length;i++) {
        var year_2013_count=0;
        var year_2014_count=0;
        for(var year_month in year_month_map) {
            var month = year_month.split("-")[1];
            var year = year_month.split("-")[0];
            if(month == months[i] && year=="2013") {
                year_2013_count += year_month_map[year_month];
            } else if(month == months[i] && year=="2014") {
                year_2014_count += year_month_map[year_month];
            }
        }
        var default_row = {month: months[i], year_2013: year_2013_count/year_map["2013"]*100, year_2014: year_2014_count/year_map["2014"]*100};
        default_data.push(default_row);
    }
    console.log(default_data);
    callback(null,default_data);
}

function generateDefaultLiquidInfo(callback) {
    var male_count=0;
    var female_count=0;
    for(var i=0;i<allClients.length;i++) {
        if(allClients[i].sex.toString().length ==1) {
            var gender = allClients[i].sex.toString();
            if(gender =="1") {
                male_count++;
            } else if(gender == "0"){
                female_count++;
            }
        }
    }
    var total_count = male_count+female_count;
    var data = {male_count: male_count/total_count*100, female_count: female_count/total_count*100};
    callback(data);
}

function generateLiquidInfoBaseOnState(callback) {
    var state_map = map['school_chart'];
    var gender_map ={};
    for(var state in state_map) {
        var male_count=0;
        var female_count=0;
        var clients = state_map[state];
        for(var i=0;i<clients.length;i++) {
            if(clients[i].sex) {
                var gender = allClients[i].sex.toString();
                if(gender ==1) {
                    male_count++;
                } else {
                    female_count++;
                }
            }
        }
        var total_count =male_count + female_count;
        if(total_count !=0) {
            gender_map[state] = {male_count : male_count/total_count*100, female_count: female_count/total_count*100};
        } else {
            gender_map[state] = {male_count :0, female_count :0};
        }
    }
    map['gender_chart'] = gender_map;
    callback(true);
}

function generateDefaultGenderChart() {
    generateDefaultLiquidInfo(function(data){
        generateGenderChart(data);
    });  
}

function changeGenderBaseOnClick(state) {
    var gender_data = map['gender_chart'][state];
    $('#femalechart').html('');
    $('#malechart').html('');
    generateGenderChart(gender_data);
} 

function generateGenderChart(data) {
    loadLiquidFillGauge("femalechart",data.female_count);
    var male_config = liquidFillDefaultSettings();
    male_config.circleColor = "#178BCA";;
    male_config.textColor = "#045681";
    male_config.waveTextColor = "#A4DBf8";
    male_config.waveColor = "#35A9E8";
    loadLiquidFillGauge("malechart",data.male_count,male_config);
}


function liquidFillDefaultSettings(){
    return {
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.1, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#FF7777", // The color of the outer circle.
        waveHeight: 0.15, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 4000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: "#FFDDDD", // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .4, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: .7, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "#FF4444", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#FFAAAA" // The color of the value text when the wave overlaps it.
    };
}

function loadLiquidFillGauge(elementId, value, config) {
    if(config == null) 
        config = liquidFillDefaultSettings();

    var gauge = d3.select("#" + elementId);
    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/3;
    var locationX = parseInt(gauge.style("width"))/2 - radius;
    var locationY = parseInt(gauge.style("height"))/2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var waveHeightScale;
    if(config.waveHeightScaling){
        waveHeightScale = d3.scale.linear()
            .range([0,config.waveHeight,0])
            .domain([0,50,100]);
    } else {
        waveHeightScale = d3.scale.linear()
            .range([config.waveHeight,config.waveHeight])
            .domain([0,100]);
    }

    var textPixels = (config.textSize*radius/2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    var waveLength = fillCircleRadius*2/config.waveCount;
    var waveClipCount = 1+config.waveCount;
    var waveClipWidth = waveLength*waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Data for building the clip wave area.
    var data = [];
    for(var i = 0; i <= 40*waveClipCount; i++){
        data.push({x: i/(40*waveClipCount), y: (i/(40))});
    }

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scale.linear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will won't overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1]);
    var waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Text where the wave does not overlap.
    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // The clipping wave area.
    var clipArea = d3.svg.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
    var waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea);

    // The inner circle with the clipping wave attached.
    var fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");
    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    // Text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.waveTextColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // Make the value count up.
    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t)) + percentText; }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate) animateWave();

    function animateWave() {
        wave.transition()
            .duration(config.waveAnimateTime)
            .ease("linear")
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .each("end", function(){
                wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                animateWave(config.waveAnimateTime);
            });
    }
}


