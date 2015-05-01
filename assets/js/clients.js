var allClients;
var start_angle_1;
var start_angle_2;

//entire data format the page needs
map = {};
//hard-coded on year -- change if needed 
var years= ["2013","2014"];
var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

//reason categories -- changed and added if needed
var reason_catogories = {"0" : ["0","10","18","38"], "1" :["1","2","9","11","13","19","26","29","30","33","39"],
                            "2":["5","31","35"], "3":["3","6","7","15","16","24","27","46","49"], "4":["4","12","14","20","25","28","40","43","44","50","53"],
                            "5":["8","45"], "6":["17","21","23","36","37","41","42","48"], "7":["32"], "8":["22","34","47","51"]};

//main function to draw all parts of visualization
$.ajax({
    url: '/view/getClients',
    type: 'GET',
    dataType: 'json'
}).done(function(data){
    allClients = data.clients;
    //generateDefaultReasonInfo();
    generateDefaultMapInfo(function(isSuccess){
        if(isSuccess) {
            generateDefaultMap(map['school_chart']);
            generateDefaultSchoolInfo(function(isSuccess,school_data){
                if(isSuccess) {
                    generateDefaultSchoolChart(school_data);
                    generateDefaultTimeInfo(function(isSuccess, time_data){
                        if(isSuccess) {
                            generateDefaultGenderInfo(function(isSuccess, gender_data){
                                if(isSuccess) {
                                    generateDefaultTimeChart(time_data);
                                    generateDefaultGenderChart(gender_data);
                                    //generateDefaultSubReasonInfo();
                                    generateDefaultReasonChart(null);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}).fail(function(){
    console.log('error on getting all clients');
});

/********************************************************
            Data Format generation start
*********************************************************/

//generate state-client information
function generateDefaultMapInfo(callback) {
    var states = "^(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$";
    var all_states = states.substring(2,states.length-2).split("|");
    var pattern = new RegExp(states);
    school = {};
    for(var i=0;i<allClients.length;i++) {
        var client = allClients[i];
        if(!client.state || client.state === 'KI')
            continue;
        if(pattern.test(client.state)) {
            if(!(client.state in school)) {
                school[client.state] = [];
            }
            school[client.state].push(client);
        } else {
            var state_split = client.state.trim().split(" ")[1];
            if(pattern.test(state_split)) {
                if(!(state_split in school)) {
                    school[state_split] = [];
                }
                school[state_split].push(client);
            }
        }
    }
    //make the map containing 50 states
    for(var i=0;i<all_states.length;i++) {
        if(!(all_states[i] in school)) {
            school[all_states[i]] = [];
        }
    }
    map['school_chart'] = school;
    callback(true);
}

//generate default school chart data
function generateDefaultSchoolInfo(callback) {
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
        university_object.name = university;
        university_object.value = universities[university];
        top_universities.push(university_object);
    }
    top_universities.sort(function(a,b) {
        return b.value-a.value;
    });
    //show top 5 universities 
    top_universities = top_universities.splice(0, 5);
    var total_count = 0;
    for(var i=0;i<top_universities.length;i++) {
        total_count += top_universities[i].value;
    }
    for(var i=0;i<top_universities.length;i++) {
        top_universities[i].percentage = top_universities[i].value/total_count*100;
    }
    callback(true,top_universities);
}

//generate default time chart data
function generateDefaultTimeInfo(callback) {
    //hard coded on year -- change if needed
    var default_data=[];
    var year_month_map = {};
    var year_map = {};
    var year_percentage_map = {};
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
        var default_row = {month: months[i], year_2013: Math.round(year_2013_count/year_map["2013"]*10000)/100, year_2014: Math.round(year_2014_count/year_map["2014"]*10000)/100};
        default_data.push(default_row);
    }
    var month_percentage_2013 = [];
    var month_percentage_2014 = [];
    for(var i=0;i<default_data.length;i++) {
        month_percentage_2013.push(default_data[i].year_2013);
        month_percentage_2014.push(default_data[i].year_2014);
    }
    year_percentage_map["2013"] = month_percentage_2013;
    year_percentage_map["2014"] = month_percentage_2014;
    callback(true,year_percentage_map);
}

//format the date in the raw dataset
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

function generateGenderChart(selected_month, selected_year) {
    console.log(selected_month);
    console.log(selected_year);
}

//generate gender data for chart by default
function generateDefaultGenderInfo(callback) {
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
    var data = {male_count: Math.round(male_count/total_count*10000)/100, female_count: Math.round(female_count/total_count*10000)/100};
    callback(true,data);
}


/********************************************************
            Data Format generation end
*********************************************************/


/********************************************************
            Visualization generation start
*********************************************************/

//map chart generation
function generateDefaultMap(state_map) {
    var state_data = [];
    for(var state in state_map) {
        var obj = {code: state, value : Math.round(state_map[state].length/allClients.length*10000)/100};
        state_data.push(obj);
    }
    $('#mapchart').highcharts('Map', {
        title : {
            margin:5,
            text : 'US Client Distribution'
        },
        legend : {
            enabled: false
        },
        colorAxis: {
            min: 0,
            type: 'linear',
            minColor: '#99CCFF',
            maxColor: '#00223E',
            stops: [
                [0, '#99CCFF'],
                [0.5, '#053A6C'],
                [1, '#00223E']
            ]
        },
        series : [{
            animation: {
                duration: 1000
            },
            data : state_data,
            mapData: Highcharts.maps['countries/us/us-all'],
            joinBy: ['postal-code', 'code'],
            dataLabels: {
                enabled: true,
                color: 'white',
                format: '{point.code}'
            },
            name: 'Client Percentage',
            tooltip: {
                pointFormat: '{point.code}: {point.value}',
                valueSuffix:"%"
            }
        }]
    });
}

//school piechart generation
function generateDefaultSchoolChart(school_data) {
    var data_format =[];
    for(var i=0;i<school_data.length;i++) {
        var element = [];
        element.push(school_data[i].name);
        element.push(school_data[i].percentage);
        data_format.push(element);
    }
    $('#schoolchart').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            margin:5,
            text: "Clients' Universities in US States"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name : 'Percentage',
            innerSize : '60%',
            size : '80%',
            data: data_format
        }]
    });
}

function generateDefaultTimeChart(time_data) {
    $('#timechart').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Monthly Average Clients Number'
        },
        
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Clients Number Percentage'
            },
            min :0
        },
        labels: {
            items: [{
                html: 'Gender Ratio',
                style: {
                    left: '40px',
                    top: '3px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        tooltip: {
            shared: true,
            crosshairs: true,
            valueSuffix : "%"
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        plotOptions : {
            series: {
                animation: {
                    duration :1500
                }                
            }
        },
        series: [{
            type: 'spline',
            name: 'Year 2013',
            allowPointSelect : true,
            cursor : 'pointer',
            events : {
                click : function(event){
                    generateGenderChart(event.point.category, this.name);
                }
            },
            data: time_data["2013"]
        }, {
            type: 'spline',
            name: 'Year 2014',
            allowPointSelect : true,
            cursor : 'pointer',
            events : {
                click : function(event){
                    generateGenderChart(event.point.category, this.name);
                }
            },
            data: time_data["2014"]
        }]
    });
}

//generate default gender chart
function generateDefaultGenderChart(gender_data) {
    var time_chart = $('#timechart').highcharts();
    time_chart.addSeries({
        type: 'pie',
        name : 'Gender Ratio',
        allowPointSelect : true,
        tooltip : {
        valueSuffix : "%"
        },
        data: [{
            name: 'Female',
            y: gender_data['female_count'],
            color: Highcharts.getOptions().colors[2] // female's color
        }, {
            name: 'Male',
            y: gender_data['male_count'],
            color: Highcharts.getOptions().colors[6] // male's color
        }],
        center: [60, 40],
        size: 70,
        distance :1,
        connectorPadding:2,
        dataLabels: {
            formatter: function(data) {
                return this.point.name + " : <br>" + this.y + "%";
            }
        }
    });
}

//generate default reason chart
function generateDefaultReasonChart(reason_data) {

    var colors = Highcharts.getOptions().colors,
        categories = ['Poor Academic <br>Performance', 'Low Attendance', 'Violation of Academic<br> Integrity Policy','Misbehavior', 'Others'],
        data = [{
            y: 57.56,
            color: colors[0],
            drilldown: {
                name: 'Poor Academic Performance',
                categories: ['Learning Capability', 'Learning <br>Attitude', 'Illness', 'Maladaptation of <br>Teaching Style','Psychological status',
                            'Family Issue','Suspension', 'Out-of Campus Work','Maladaptation of current school', 'Maladaptation of course','Change Major','Addicted to Games',
                            'Pressure under different Major','Bad English Skill','Bad Accomandation','Dual Major Pressure'],
                data: [19.62, 10.07, 7.23, 6.19, 4.39, 2.33, 1.55, 1.29,1.28, 0.78,0.77,0.77,0.52, 0.26,0.25,0.25],
                color: colors[0]
            }
        }, {
            y: 9.67,
            color: colors[1],
            
        }, {
            y: 22.98,
            color: colors[2],
            drilldown: {
                name: 'Academic Dishonesty',
                categories: ['Cheating', 'Plagiarism', 'Assist Cheating', 'Ask Others to Substitute', 'Falsify Result'],
                data: [14.97, 5.57, 1.05,1.04,0.35],
                color: colors[2]
            }
        },{
            y: 3.87,
            color: colors[5]
        }, {
            y: 5.92,
            color: colors[4]
        }],
        reason_data = [],
        subreason_data = [],
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness;
    // Build the data arrays
    for (i = 0; i < dataLen; i++) {
        reason_data.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });
        if(data[i].drilldown) {
            drillDataLen = data[i].drilldown.data.length;
            for (j = 0; j < drillDataLen; j++) {
                brightness = 0.2 - (j / drillDataLen) / 5;
                subreason_data.push({
                    name: data[i].drilldown.categories[j],
                    y: data[i].drilldown.data[j],
                    color: Highcharts.Color(data[i].color).brighten(brightness).get()
                });
            }
        }
    }
    //draw the chart
    $('#reasonchart').highcharts({
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Percentage on Reasons of Dismissal'
        },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '43%']
            }
        },
        series: [{
            type:'pie',
            name: 'Percentage',
            data: reason_data,
            animation : {
                duration:1000
            },
            size: '50%',
            dataLabels: {
                color: 'white',
                distance: -30,
                formatter: function () {
                    return this.y >3 ? this.point.name : null;
                }
            }
        }, {
            type:'pie',
            name: 'Percentage',
            animation :{
                duration:1000,
            },
            allowPointSelect: true,
            data: subreason_data.splice(0,16),
            startAngle :0,
            endAngle : reason_data[0].y*360/100,
            size: '85%',
            innerSize: '70%',
            dataLabels: {
                formatter: function () {
                    return this.y >1.5 ? this.point.name + ':<br> ' + this.y + '%' : null;
                }
            }
        } , {
            type:'pie',
            name: 'Percentage',
            animation :{
                duration:1000,
            },
            allowPointSelect: true,
            data: subreason_data.splice(0,5),
            startAngle :(reason_data[0].y+reason_data[1].y)*360/100,
            endAngle : (reason_data[0].y+reason_data[1].y + reason_data[2].y)*360/100,
            size: '85%',
            innerSize: '70%',
            dataLabels: {
                formatter: function () {
                    return this.point.name + ':<br> ' + this.y + '%';
                }
            }
        }]
    });
}


/********************************************************
            Visualization generation end
*********************************************************/

