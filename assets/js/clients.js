var allClients;
//entire data format the page needs
map = {};
//global boolean variables to show on multiple choices
var previous_selected_state;
// global variables for selected_time
var previous_selected_year_age;
var previous_selected_year;
var previous_selected_age;
//global variables for selected degree
var previous_selected_degree;
//global variables for selected major
var previous_selected_major;
//global array for selection indication
var array_picked = [false,false,false,false];
//hard-coded on year -- change if needed 
var years= ["2013","2014","2015"];

//reason categories -- changed and added if needed
var reason_catogories = {"0" : ["0","10","18","38"], "1" :["1","2","9","11","13","19","26","29","30","33","39"],
                            "2":["5","31","35"], "3":["3","6","7","15","16","24","27","46","49"], "4":["4","12","14","20","25","28","40","43","44","50","53"],
                            "5":["8","45"], "6":["17","21","23","36","37","41","42","48"], "7":["32"], "8":["22","34","47","51"]};
//month to number mapping
var month_map = {"Jan":"01", "Feb":"02", "Mar":"03", "Apr":"04", "May":"05", "Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12"};
//age ranges
var age_range = ["smaller than 18","18-22","23-25","larger than 25"];
//degree mapping
var degree_map = {"High School" :"1", "ESL":"2", "College":"3", "Bachelor":"4", "Master":"5", "Ph.D":"6", "Junior High School":"9"};
//major mapping
var major_map = {"0":"Science and Engineering","1":"Literature and History","2":"Economics and Business Administration","3":"Pre-course","4":"General Study","6":"Language","7":"Art","8":"Technology"};
//main function to draw all parts of visualization
$.ajax({
    url: '/view/getclients',
    type: 'GET',
    dataType: 'json'
}).done(function(data){
    allClients = data.clients;
    //generate client info based on state
    generateMapBaseInfo(function(isSuccess){
        if(isSuccess) {
            generateDefaultMap(map['school_chart']);
            generateDefaultSchoolInfo();
            generateDefaultReasonChart();
        }  
    });
    //genreate client info based on year and age and state-- which is a nested mapping data structure
    generateDefaultAgeInfo(function(isSuccess){
        if(isSuccess) {
            generateAgeStateBaseInfo(function(isSuccess){
                if(isSuccess) {
                    console.log("Loaded year_age_state data.")
                    generateDefaultGenderInfo();
                }
            });
            generateAgeDegreeBaseInfo(function(isSuccess){
                if(isSuccess) {
                    console.log("Loaded year_age_degree data.")
                }
            });
            generateAgeMajorBaseInfo(function(isSuccess){
                if(isSuccess) {
                    console.log("Loaded year_age_major data.")
                }
            });
        }
    });
    //generate client info based on degree
    generateDefaultDegreeInfo(function(isSuccess){
        if(isSuccess) {
            generateDegreeStateBaseInfo(function(isSuccess){
                if(isSuccess) {
                    console.log("Loaded degree_state data.");
                    generateDefaultDegree();
                }
            });
            generateDegreeMajorBaseInfo(function(isSuccess){
                if(isSuccess) {
                    console.log("Loaded degree_major data.");
                }
            });
        }
    });
    //generate client info based on major
    generateDefaultMajorInfo(function(isSuccess){
        if(isSuccess) {
            generateMajorStateBaseInfo(function(isSuccess){
                if(isSuccess) {
                    console.log("Loaded major_state data.");
                    generateDefaultMajor();
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

/***************************************
* Wrapping all Map functions starts
****************************************/

//generate client information with state as key in mapping 
function generateMapBaseInfo(callback) {
    generateMapBaseInfoHelper(allClients,function(school){
        map['school_chart'] = school;
        callback(true);
    }); 
}
//generate default map chart
function generateDefaultMapChart() {
    generateMapBaseInfoHelper(allClients,function(school){
        generateDefaultMap(school);
    });
}
//helper function to make the code scalable and used by other components
function generateMapBaseInfoHelper(clients,callback) {
    var states = "^(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$";
    var all_states = states.substring(2,states.length-2).split("|");
    var pattern = new RegExp(states);
    school = {};
    for(var i=0;i<clients.length;i++) {
        var client = clients[i];
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
    callback(school);
}
//generate state info based on age and year chart
function generateMapBaseOnAgeChart(year,age) {
    var total_clients = map['year_age_state_chart'];
    var age_state_map = total_clients[year];
    var state_map = age_state_map[age];
    generateDefaultMap(state_map);
}
//generate state info based on degree chart
function generateMapBaseOnDegreeChart(degree) {
    var total_clients = map['degree_state_chart'];
    var state_map = total_clients[degree];
    generateDefaultMap(state_map);
}
//generate state info based on major chart
function generateMapBaseOnMajorChart(major) {
    var total_clients = map['major_state_chart'];
    var state_map = total_clients[major];
    generateDefaultMap(state_map);
}
//generate state info based on year-age and degree chart
function generateMapBaseOnAgeDegreeChart(degree,year,age) {
    var total_clients = map['year_age_degree_chart'];
    var age_degree_map = total_clients[year];
    var degree_map = age_degree_map[age];
    var degree_clients = degree_map[degree];
    generateMapBaseInfoHelper(degree_clients,function(school){
        generateDefaultMap(school);
    });
}
//generate state info based on year-age and major chart
function generateMapBaseOnAgeMajorChart(major,year,age) {
    var total_clients = map['year_age_major_chart'];
    var age_major_map = total_clients[year];
    var major_map = age_major_map[age];
    var major_clients = major_map[major];
    generateMapBaseInfoHelper(major_clients,function(school){
        generateDefaultMap(school);
    });
}
//generate state info based on degree and major chart
function generateMapBaseOnDegreeMajorChart(degree,major) {
    var total_clients = map['degree_major_chart'];
    var degree_clients = total_clients[degree];
    var major_clients = degree_clients[major];
    generateMapBaseInfoHelper(major_clients,function(school){
        generateDefaultMap(school);
    });
}

/***************************************
* Wrapping all School Chart functions starts
****************************************/

//generate default school chart data
function generateDefaultSchoolInfo() {
    var state_clients = map['school_chart'];
    var universities = {};
    var top_universities =[];
    for(var state in state_clients) {
        var clients = state_clients[state];
        universities = generateSchoolInfoHelper1(universities,clients);
    }
    top_universities = generateSchoolInfoHelper2(universities);
    //show top 5 universities 
    top_universities = top_universities.splice(0, 15);
    generateDefaultSchoolChart(top_universities);
}
//helper function to handle with data with selected state
function generateSchoolInfoHelper1(universities,clients) {
    for(var i=0;i<clients.length;i++) {
        if(clients[i].ori_sch) {
            if(!(clients[i].ori_sch in universities)) {
                universities[clients[i].ori_sch] = 1;
            } else {
                universities[clients[i].ori_sch] = universities[clients[i].ori_sch]+1;
            }
        }
    }
    return universities;
}

function generateSchoolInfoHelper2(universities) {
    var top_universities =[];
    var total_count = 0;
    for(var university in universities) {
        var university_object ={};
        university_object.name = university;
        university_object.value = universities[university];
        top_universities.push(university_object);
    }
    top_universities.sort(function(a,b) {
        return b.value-a.value;
    });
    for(var i=0;i<top_universities.length;i++) {
        total_count += top_universities[i].value;
    }
    for(var i=0;i<top_universities.length;i++) {
        top_universities[i].percentage = top_universities[i].value/total_count*100;
    }
    return top_universities;
}
//generate school chart based only on state
function generateSchoolInfoBaseOnState(state) {
    var state_clients = map['school_chart'];
    var clients = state_clients[state];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,clients);
    var top_universities = generateSchoolInfoHelper2(universities);
    top_universities = top_universities.splice(0,15);
    generateDefaultSchoolChart(top_universities);
}
//generate school chart based only on time
function generateSchoolInfoBaseOnAge(year,age) {
    var total_clients = map['year_age_chart'];
    var age_clients = total_clients[year];
    var clients = age_clients[age];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,clients);
    var top_universities = generateSchoolInfoHelper2(universities);
    top_universities = top_universities.splice(0,15);
    generateDefaultSchoolChart(top_universities);
}
//generate school chart based only on degree
function generateSchoolInfoBaseOnDegree(degree) {
    var total_clients = map['degree_chart'];
    var clients = total_clients[degree];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,clients);
    var top_universities = generateSchoolInfoHelper2(universities);
    top_universities = top_universities.splice(0,15);
    generateDefaultSchoolChart(top_universities);
}
//generate school chart based only on major
function generateSchoolInfoBaseOnMajor(major) {
    var total_clients = map['major_chart'];
    var clients = total_clients[major];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,clients);
    var top_universities = generateSchoolInfoHelper2(universities);
    top_universities = top_universities.splice(0,15);
    generateDefaultSchoolChart(top_universities);
}
//generate school chart based on state and time
function generateSchoolInfoBaseOnAgeState(state,year,age) {
    var total_clients = map['year_age_state_chart'];
    var age_clients = total_clients[year];
    var state_clients = age_clients[age];
    var clients_state = state_clients[state];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,clients_state);
    var top_universities = generateSchoolInfoHelper2(universities);
    if(jQuery.isEmptyObject(top_universities)){
        return;
    } else {
        top_universities = top_universities.splice(0,15);
        generateDefaultSchoolChart(top_universities);
    }
}
//generate school chart based on state and degree
function generateSchoolInfoBaseOnDegreeState(state,degree) {
    var total_clients = map['degree_state_chart'];
    var state_clients = total_clients[degree];
    var clients_state = state_clients[state];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,clients_state);
    var top_universities = generateSchoolInfoHelper2(universities);
    if(jQuery.isEmptyObject(top_universities)){
        return;
    } else {
        top_universities = top_universities.splice(0,15);
        generateDefaultSchoolChart(top_universities);
    }
}
//generate school chart based on state and degree
function generateSchoolInfoBaseOnMajorState(state,major) {
    var total_clients = map['major_state_chart'];
    var state_clients = total_clients[major];
    var clients_state = state_clients[state];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,clients_state);
    var top_universities = generateSchoolInfoHelper2(universities);
    if(jQuery.isEmptyObject(top_universities)){
        return;
    } else {
        top_universities = top_universities.splice(0,15);
        generateDefaultSchoolChart(top_universities);
    }
}
//generate school chart based on year-age and degree
function generateSchoolInfoBaseOnAgeDegree(degree,year,age) {
    var total_clients = map['year_age_degree_chart'];
    var age_clients = total_clients[year];
    var degree_clients = age_clients[age];
    var clients_degree = degree_clients[degree];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,clients_degree);
    var top_universities = generateSchoolInfoHelper2(universities);
    if(jQuery.isEmptyObject(top_universities)){
        return;
    } else {
        top_universities = top_universities.splice(0,15);
        generateDefaultSchoolChart(top_universities);
    }
}
//generate school chart based on year-age and degree
function generateSchoolInfoBaseOnAgeMajor(major,year,age) {
    var total_clients = map['year_age_major_chart'];
    var age_clients = total_clients[year];
    var major_clients = age_clients[age];
    var clients_major = major_clients[major];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,clients_major);
    var top_universities = generateSchoolInfoHelper2(universities);
    if(jQuery.isEmptyObject(top_universities)){
        return;
    } else {
        top_universities = top_universities.splice(0,15);
        generateDefaultSchoolChart(top_universities);
    }
}
//generate school chart based on year-age and degree
function generateSchoolInfoBaseOnDegreeMajor(degree,major) {
    var total_clients = map['degree_major_chart'];
    var degree_clients = total_clients[degree];
    var major_clients = degree_clients[major];
    var universities = {};
    universities = generateSchoolInfoHelper1(universities,major_clients);
    var top_universities = generateSchoolInfoHelper2(universities);
    if(jQuery.isEmptyObject(top_universities)){
        return;
    } else {
        top_universities = top_universities.splice(0,15);
        generateDefaultSchoolChart(top_universities);
    }
}
/***************************************
* Wrapping all School Chart functions ends
****************************************/

/******************************************
* Wrapping all Gender Chart functions starts
*******************************************/
//generate gender chart based only on time
function generateGenderInfoBaseOnAge(year,age) {
    var total_clients = map['year_age_chart'];
    var year_clients = total_clients[year];
    var clients = year_clients[age];
    generateGenderInfoHelper(clients, function(gender_info){
        generateDefaultGenderChart(gender_info);
    });
}
//generate gender chart based only on state
function generateGenderInfoBaseOnState(state) {
    var state_clients = map['school_chart'];
    var clients = state_clients[state];
    generateGenderInfoHelper(clients, function(gender_info){
        generateDefaultGenderChart(gender_info);
    });
}
//generate gender chart based only on degree
function generateGenderInfoBaseOnDegree(degree) {
    var degree_clients = map['degree_chart'];
    var clients = degree_clients[degree];
    generateGenderInfoHelper(clients, function(gender_info){
        generateDefaultGenderChart(gender_info);
    });
}
//generate gender chart based only on degree
function generateGenderInfoBaseOnMajor(major) {
    var major_clients = map['major_chart'];
    var clients = major_clients[major];
    generateGenderInfoHelper(clients, function(gender_info){
        generateDefaultGenderChart(gender_info);
    });
}

//generate gender chart based on state and time
function generateGenderInfoBaseOnAgeState(state,year,age) {
    var total_clients = map['year_age_state_chart'];
    var age_clients =total_clients[year];
    var state_clients = age_clients[age];
    var clients_state = state_clients[state];
    generateGenderInfoHelper(clients_state, function(gender_info){
        if(!gender_info) {
            return;
        } else {
            generateDefaultGenderChart(gender_info);
        }
    });
}
//generate gender chart based on state and degree
function generateGenderInfoBaseOnDegreeState(state,degree) {
    var total_clients = map['degree_state_chart'];
    var state_clients = total_clients[degree];
    var clients_state = state_clients[state];
    generateGenderInfoHelper(clients_state, function(gender_info){
        if(!gender_info) {
            return;
        } else {
            generateDefaultGenderChart(gender_info);
        }
    });
}
//generate gender chart based on state and major
function generateGenderInfoBaseOnMajorState(state,major) {
    var total_clients = map['major_state_chart'];
    var state_clients = total_clients[major];
    var clients_state = state_clients[state];
    generateGenderInfoHelper(clients_state, function(gender_info){
        if(!gender_info) {
            return;
        } else {
            generateDefaultGenderChart(gender_info);
        }
    });
}
//generate gender chart based on state and major
function generateGenderInfoBaseOnAgeDegree(degree,year,age) {
    var total_clients = map['year_age_degree_chart'];
    var age_clients =total_clients[year];
    var degree_clients = age_clients[age];
    var clients_degree = degree_clients[degree];
    generateGenderInfoHelper(clients_degree, function(gender_info){
        if(!gender_info) {
            return;
        } else {
            generateDefaultGenderChart(gender_info);
        }
    });
}
//generate gender chart based on state and major
function generateGenderInfoBaseOnAgeMajor(major,year,age) {
    var total_clients = map['year_age_major_chart'];
    var age_clients =total_clients[year];
    var major_clients = age_clients[age];
    var clients_major = major_clients[major];
    generateGenderInfoHelper(clients_major, function(gender_info){
        if(!gender_info) {
            return;
        } else {
            generateDefaultGenderChart(gender_info);
        }
    });
}
//generate gender chart based on degree and major
function generateGenderInfoBaseOnDegreeMajor(degree,major) {
    var total_clients = map['degree_major_chart'];
    var degree_clients =total_clients[degree];
    var major_clients = degree_clients[major];
    generateGenderInfoHelper(major_clients, function(gender_info){
        if(!gender_info) {
            return;
        } else {
            generateDefaultGenderChart(gender_info);
        }
    });
}

//generate gender data for chart by default
function generateDefaultGenderInfo() {
    generateGenderInfoHelper(allClients,function(gender_info){
        generateDefaultGenderChart(gender_info);
    });
}

function generateGenderInfoHelper(clients,callback) {
    var male_count=0;
    var female_count=0;
    for(var i=0;i<clients.length;i++) {
        if(clients[i].sex.toString().length ==1) {
            var gender = clients[i].sex.toString();
            if(gender =="1") {
                male_count++;
            } else if(gender == "0"){
                female_count++;
            }
        }
    }
    var total_count = male_count+female_count;
    if(total_count ==0) {
        callback(null);
        return;
    }
    var gender_info = {male_count: Math.round(male_count/total_count*10000)/100, female_count: Math.round(female_count/total_count*10000)/100};
    callback(gender_info);
}

/******************************************
* Wrapping all Gender Chart functions ends
*******************************************/

/******************************************
* Wrapping all Age Chart functions starts
*******************************************/
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
//generate default age info
function generateDefaultAgeInfo(callback) {
    generateDefaultYearInfo(allClients,function(year_map){
        generateDefaultYearAgeInfo(year_map, function(year_age_map){
            generateDefaultAgePercentageInfo(year_age_map);
            map['year_age_chart'] = year_age_map;
            callback(true);
        });
    });
}
//generate year_age_state info
function generateAgeStateBaseInfo(callback) {
    var total_clients = map['year_age_chart'];
    var year_age_state_map = {};
    for(var year in total_clients) {
        var age_clients = total_clients[year];
        var age_state_map ={};
        for(var age in age_clients) {
            var clients = age_clients[age];
            generateMapBaseInfoHelper(clients, function(school){
                age_state_map[age] = school;
            });
        }
        year_age_state_map[year] = age_state_map; 
    }
    map['year_age_state_chart'] = year_age_state_map;
    callback(true);
}
//generate year_age_degree info
function generateAgeDegreeBaseInfo(callback) {
    var total_clients = map['year_age_chart'];
    var year_age_degree_map = {};
    for(var year in total_clients) {
        var age_clients = total_clients[year];
        var age_degree_map ={};
        for(var age in age_clients) {
            var clients = age_clients[age];
            generateDefaultDegreeInfoHelper(clients, function(degree_map){
                age_degree_map[age] = degree_map;
            });
        }
        year_age_degree_map[year] = age_degree_map; 
    }
    map['year_age_degree_chart'] = year_age_degree_map;
    callback(true);
}
//generate year_age_major info
function generateAgeMajorBaseInfo(callback) {
    var total_clients = map['year_age_chart'];
    var year_age_major_map = {};
    for(var year in total_clients) {
        var age_clients = total_clients[year];
        var age_major_map ={};
        for(var age in age_clients) {
            var clients = age_clients[age];
            generateDefaultMajorInfoHelper(allClients, function(major_map){
                age_major_map[age] = major_map;
            });
        }
        year_age_major_map[year] = age_major_map; 
    }
    map['year_age_major_chart'] = year_age_major_map;
    callback(true);
}
//default age year chart
function generateDefaultAgeChart() {
    generateDefaultYearInfo(allClients,function(year_map){
        generateDefaultYearAgeInfo(year_map, function(year_age_map){
            generateDefaultAgePercentageInfo(year_age_map);
            
        });
    });
}
//helper function to generate year map info
function generateDefaultYearInfo(clients, callback){
    var year_map ={};
    for(var i=0;i<clients.length;i++) {
        var dismissal_time = clients[i].dismissal_time
        if(dismissal_time) {
            var formatted_date = formateDate(dismissal_time);
            var formatted_year = formatted_date.split("-")[0];
            if(formatted_year != "2012") {
                if(!(formatted_year in year_map)) {
                    year_map[formatted_year] = [];
                } 
                year_map[formatted_year].push(allClients[i]);
            }
        } 
    }
    callback(year_map);
}
//helper function to generate info based on year and age
function generateDefaultYearAgeInfo(year_map,callback) {
    var year_age_map ={};
    for(var year in year_map) {
        var clients = year_map[year];
        var age_map ={"smaller than 18":[], "18-22" :[], "23-25":[], "larger than 25":[]};
        for(var i=0;i<clients.length;i++) {
            var current_age = clients[i].age;
            if(current_age) {
                if(current_age < 18) {
                    age_map["smaller than 18"].push(clients[i]);
                } else if(current_age >=18 && current_age <=22) {
                    age_map["18-22"].push(clients[i]);
                } else if(current_age >=23 && current_age<=25) {
                    age_map["23-25"].push(clients[i]);
                } else if(current_age >25) {
                    age_map["larger than 25"].push(clients[i]);
                }
            }
        }
        year_age_map[year] = age_map;
    }
    callback(year_age_map);
}
//helper function to calculate the percentage of each item
function generateDefaultAgePercentageInfo(year_age_map) {
    var year_age_percentage_map ={};
    var year_total_number =[0,0,0];
    var format_data=[];
    for(var year in year_age_map) {
        var age_ranges = year_age_map[year];
        for(var age in age_ranges) {
            year_total_number[year-2013] +=age_ranges[age].length;
        }
    }
    for(var year in year_age_map) {
        var age_ranges = year_age_map[year];
        var current_year_total = year_total_number[year-2013];
        var age_percentage_map ={};
        for(var age in age_ranges) {
            age_percentage_map[age] = Math.round(age_ranges[age].length/current_year_total*10000)/100;
        }
        year_age_percentage_map[year] = age_percentage_map;
    }
    for(var year in year_age_percentage_map) {
        var age_map=year_age_percentage_map[year];
        var series_obj = {};
        series_obj.name = year;
        series_obj.data =[];
        for(var age in age_map) {
            series_obj.data.push(age_map[age]);
        }
        format_data.push(series_obj);
    }
    generateDefaultYearAgeChart(format_data);
}

//generate age info based on state
function generateAgeInfoBaseOnState(state) {
    var state_clients = map['school_chart'];
    var clients = state_clients[state];
    generateDefaultYearInfo(clients, function(year_map){
        generateDefaultYearAgeInfo(year_map, function(year_age_map){
            generateDefaultAgePercentageInfo(year_age_map);
        });
    });
}
//generate age info based on degrees
function generateAgeInfoBaseOnDegree(degree) {
    var degree_clients = map['degree_chart'];
    var clients = degree_clients[degree];
    generateDefaultYearInfo(clients, function(year_map){
        generateDefaultYearAgeInfo(year_map, function(year_age_map){
            generateDefaultAgePercentageInfo(year_age_map);
        });
    });
}
//generate age info based on major
function generateAgeInfoBaseOnMajor(major) {
    var major_clients = map['major_chart'];
    var clients = major_clients[major];
    generateDefaultYearInfo(clients, function(year_map){
        generateDefaultYearAgeInfo(year_map, function(year_age_map){
            generateDefaultAgePercentageInfo(year_age_map);
        });
    });
}
//generate age info based on state and degree
function generateAgeInfoBaseOnDegreeState(state,degree) {
    var total_clients = map['degree_state_chart'];
    var state_clients = total_clients[degree];
    var clients_state = state_clients[state];
    generateDefaultYearInfo(clients_state, function(year_map){
        generateDefaultYearAgeInfo(year_map, function(year_age_map){
            generateDefaultAgePercentageInfo(year_age_map);
        });
    });
}
//generate age info based on state and major
function generateAgeInfoBaseOnMajorState(state,major) {
    var total_clients = map['major_state_chart'];
    var state_clients = total_clients[major];
    var clients_state = state_clients[state];
    generateDefaultYearInfo(clients_state, function(year_map){
        generateDefaultYearAgeInfo(year_map, function(year_age_map){
            generateDefaultAgePercentageInfo(year_age_map);
        });
    });
}
//generate age info based on major and degree
function generateAgeInfoBaseOnDegreeMajor(degree,major) {
    var total_clients = map['degree_major_chart'];
    var degree_clients = total_clients[degree];
    var major_clients = degree_clients[major];
    generateDefaultYearInfo(major_clients, function(year_map){
        generateDefaultYearAgeInfo(year_map, function(year_age_map){
            generateDefaultAgePercentageInfo(year_age_map);
        });
    });
}

/******************************************
* Wrapping all Age Chart functions end
*******************************************/

/******************************************
* Wrapping all Degree Chart functions starts
*******************************************/

function generateDefaultDegreeInfo(callback) {
    generateDefaultDegreeInfoHelper(allClients,function(degree_map){
        map['degree_chart'] = degree_map;
        callback(true);
    });
}

//generate degree_state info
function generateDegreeStateBaseInfo(callback) {
    var total_clients = map['degree_chart'];
    var degree_state_map = {};
    for(var degree in total_clients) {
        var clients = total_clients[degree];
        generateMapBaseInfoHelper(clients, function(school){
            degree_state_map[degree] = school;
        });
    }
    map['degree_state_chart'] = degree_state_map;
    callback(true);
}
//generate degree_major info
function generateDegreeMajorBaseInfo(callback) {
    var total_clients = map['degree_chart'];
    var degree_major_map = {};
    for(var degree in total_clients) {
        var clients = total_clients[degree];
        generateDefaultMajorInfoHelper(clients, function(major_map){
            degree_major_map[degree] = major_map;
        });
    }
    map['degree_major_chart'] = degree_major_map;
    callback(true);
}
//default degree chart
function generateDefaultDegree() {
    generateDefaultDegreeInfoHelper(allClients, function(degree_map){
        generateDefaultDegreePercentageInfo(degree_map,function(degree_percentage_map){
            generateDefaultDegreeChart(degree_percentage_map);
        });
    });
}

function generateDefaultDegreeInfoHelper(clients, callback) {
    var degree_map = {};
    for(var i=0;i<clients.length;i++) {
        var current_client_degree = clients[i].degree;
        if(current_client_degree) {
            if(!(current_client_degree in degree_map)) {
                degree_map[current_client_degree] = [];
            }
            degree_map[current_client_degree].push(clients[i]);
        }
    }
    callback(degree_map);
}
//calculate the percentage for each items in the chart
function generateDefaultDegreePercentageInfo(degree_map, callback) {
    var degree_percentage_map ={};
    var total_number =0;
    for(var degree in degree_map) {
        total_number += degree_map[degree].length;
    }
    for(var degree in degree_map) {
        degree_percentage_map[degree] = Math.round(degree_map[degree].length/total_number*10000)/100;
    }
    callback(degree_percentage_map);
}
//generate degree info based on state
function generateDegreeInfoBaseOnState(state) {
    var state_clients = map['school_chart'];
    var clients = state_clients[state];
    generateDefaultDegreeInfoHelper(clients, function(degree_map){
        generateDefaultDegreePercentageInfo(degree_map,function(degree_percentage_map){
            generateDefaultDegreeChart(degree_percentage_map);
        });
    });
}
//generate state info based on age and year chart
function generateDegreeInfoBaseOnAge(year,age) {
    var total_clients = map['year_age_chart'];
    var age_map = total_clients[year];
    var clients = age_map[age];
    generateDefaultDegreeInfoHelper(clients, function(degree_map){
        generateDefaultDegreePercentageInfo(degree_map,function(degree_percentage_map){
            generateDefaultDegreeChart(degree_percentage_map);
        });
    });
}
//generate state info based on major chart
function generateDegreeInfoBaseOnMajor(major) {
    var total_clients = map['major_chart'];
    var clients = total_clients[major];
    generateDefaultDegreeInfoHelper(clients, function(degree_map){
        generateDefaultDegreePercentageInfo(degree_map,function(degree_percentage_map){
            generateDefaultDegreeChart(degree_percentage_map);
        });
    });
}
//generate degree chart based on state and age,year
function generateDegreeInfoBaseOnAgeState(state,year,age) {
    var total_clients = map['year_age_state_chart'];
    var age_clients =total_clients[year];
    var state_clients = age_clients[age];
    var clients_state = state_clients[state];
    generateDefaultDegreeInfoHelper(clients_state, function(degree_map){
        generateDefaultDegreePercentageInfo(degree_map,function(degree_percentage_map){
            generateDefaultDegreeChart(degree_percentage_map);
        });
    });
}
//generate degree chart based on state and major
function generateDegreeInfoBaseOnMajorState(state,major) {
    var total_clients = map['major_state_chart'];
    var state_clients =total_clients[major];
    var clients_state = state_clients[state];
    generateDefaultDegreeInfoHelper(clients_state, function(degree_map){
        generateDefaultDegreePercentageInfo(degree_map,function(degree_percentage_map){
            generateDefaultDegreeChart(degree_percentage_map);
        });
    });
}
//generate degree chart based on state and major
function generateDegreeInfoBaseOnAgeMajor(major,year,age) {
    var total_clients = map['year_age_major_chart'];
    var age_clients =total_clients[year];
    var major_clients = age_clients[age];
    var clients_major = major_clients[major];
    generateDefaultDegreeInfoHelper(clients_major, function(degree_map){
        generateDefaultDegreePercentageInfo(degree_map,function(degree_percentage_map){
            generateDefaultDegreeChart(degree_percentage_map);
        });
    });
}

/******************************************
* Wrapping all Degree Chart functions ends
*******************************************/

/******************************************
* Wrapping all Major Chart functions starts
*******************************************/
//generate default major chart data
function generateDefaultMajorInfo(callback) {
    generateDefaultMajorInfoHelper(allClients,function(major_map){
        map['major_chart'] = major_map;
        callback(true);
    });
}

//generate degree_state info
function generateMajorStateBaseInfo(callback) {
    var total_clients = map['major_chart'];
    var major_state_map = {};
    for(var major in total_clients) {
        var clients = total_clients[major];
        generateMapBaseInfoHelper(clients, function(school){
            major_state_map[major] = school;
        });
    }
    map['major_state_chart'] = major_state_map;
    callback(true);
}
//default major chart
function generateDefaultMajor() {
    generateDefaultMajorInfoHelper(allClients, function(major_map){
        generateDefaultMajorPercentageInfo(major_map,function(major_percentage_map){
            generateDefaultMajorChart(major_percentage_map);
        });
    });
}

function generateDefaultMajorInfoHelper(clients, callback) {
    var major_map = {};
    for(var i=0;i<clients.length;i++) {
        var current_client_major = clients[i].major.toString().trim();
        if(current_client_major) {
            if(!(current_client_major in major_map)) {
                major_map[current_client_major] = [];
            }
            major_map[current_client_major].push(clients[i]);
        }
    }
    callback(major_map);
}
//calculate the percentage for each items in the chart
function generateDefaultMajorPercentageInfo(major_map, callback) {
    var major_percentage_map ={};
    var total_number =0;
    for(var major in major_map) {
        total_number += major_map[major].length;
    }
    for(var major in major_map) {
        major_percentage_map[major] = Math.round(major_map[major].length/total_number*10000)/100;
    }
    callback(major_percentage_map);
}
//generate major info based on state
function generateMajorInfoBaseOnState(state) {
    var state_clients = map['school_chart'];
    var clients = state_clients[state];
    generateDefaultMajorInfoHelper(clients, function(major_map){
        generateDefaultMajorPercentageInfo(major_map,function(major_percentage_map){
            generateDefaultMajorChart(major_percentage_map);
        });
    });
}
//generate major info based on age and year chart
function generateMajorInfoBaseOnAge(year,age) {
    var total_clients = map['year_age_chart'];
    var age_map = total_clients[year];
    var clients = age_map[age];
    generateDefaultMajorInfoHelper(clients, function(major_map){
        generateDefaultMajorPercentageInfo(major_map,function(major_percentage_map){
            generateDefaultMajorChart(major_percentage_map);
        });
    });
}
//generate major info based on degree
function generateMajorInfoBaseOnDegree(degree) {
    var total_clients = map['degree_chart'];
    var clients = total_clients[degree];
    generateDefaultMajorInfoHelper(clients, function(major_map){
        generateDefaultMajorPercentageInfo(major_map,function(major_percentage_map){
            generateDefaultMajorChart(major_percentage_map);
        });
    });
}
//generate major chart based on state and age,year
function generateMajorInfoBaseOnAgeState(state,year,age) {
    var total_clients = map['year_age_state_chart'];
    var age_clients =total_clients[year];
    var state_clients = age_clients[age];
    var clients_state = state_clients[state];
    generateDefaultMajorInfoHelper(clients_state, function(major_map){
        generateDefaultMajorPercentageInfo(major_map,function(major_percentage_map){
            generateDefaultMajorChart(major_percentage_map);
        });
    });
}
//generate major chart based on state and degree
function generateMajorInfoBaseOnDegreeState(state,degree) {
    var total_clients = map['degree_state_chart'];
    var state_clients = total_clients[degree];
    var clients_state = state_clients[state];
    generateDefaultMajorInfoHelper(clients_state, function(major_map){
        generateDefaultMajorPercentageInfo(major_map,function(major_percentage_map){
            generateDefaultMajorChart(major_percentage_map);
        });
    });
}
//generate major chart based on state and degree
function generateMajorInfoBaseOnAgeDegree(degree,year,age) {
    var total_clients = map['year_age_degree_chart'];
    var age_clients =total_clients[year];
    var degree_clients = age_clients[age];
    var clients_degree = degree_clients[degree];
    generateDefaultMajorInfoHelper(clients_degree, function(major_map){
        generateDefaultMajorPercentageInfo(major_map,function(major_percentage_map){
            generateDefaultMajorChart(major_percentage_map);
        });
    });
}

/******************************************
* Wrapping all Major Chart functions ends
*******************************************/


/********************************************************
            Data Format generation end
*********************************************************/


/********************************************************
            Visualization generation start
*********************************************************/


/********************************************************************
*                   School Chart HighChart
*
*********************************************************************/
//map chart generation
function generateDefaultMap(state_map) {
    var client_number=0;
    var state_data = [];
    for(var state in state_map) {
        client_number += state_map[state].length;
    }
    for(var state in state_map) {
        var obj = {code: state, value : Math.round(state_map[state].length/client_number*10000)/100};
        state_data.push(obj);
    }
    $('#mapchart').highcharts('Map', {
        title : {
            margin:5,
            text : 'Distribution of Sample Students'
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
            allowPointSelect : true,
            animation: {
                duration: 1500
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
            },
            events : {
                click : function(event) {
                    //complex logic for selection
                    generateChartsBaseOnMapChange(event);
                } 
            },
            states : {
                hover : {
                    color: 'orange'
                },
                select : {
                    color :'orange',
                    borderWidth : 2
                },
                normal : {
                    animation :false
                }
            }
        }]
    });
}
//reset the page if the user have already picked two different charts for filter purpose
function goBackToDefaultCharts() {
    array_picked = [false,false,false,false];
    //if the user have already selected two filter, the page will go back to default and reset array_picked to false
    //alert("you have already picked two different chart for filter");
    generateDefaultMapChart();
    generateDefaultSchoolInfo();
    generateDefaultAgeChart();
    generateDefaultGenderInfo();
    generateDefaultDegree();
    generateDefaultMajor();
}

function generateChartsBaseOnMapChange(event) {
    var picked_count=0;
    var selected_state = event.point.code;
    var is_equal = (selected_state == previous_selected_state);
    previous_selected_state = selected_state;
    //reset the page if the user have already picked two different charts for filter purpose
    for(var i=0;i<array_picked.length;i++) {
        if(array_picked[i]) 
            picked_count++;
    }
    if(picked_count >=2 && !array_picked[0]) {
        goBackToDefaultCharts();
    }
    if(event.point.value ==0) {
        return;
    }
    //split the function into several sub-functions which handling each pair selection
    //age cahrt is selected
    if(array_picked[1]) {
        generateChartBaseOnStateAgeHelper(is_equal, selected_state);
    //degree chart is selected
    } else if(array_picked[2]) {
        generateChartBaseOnStateDegreeHelper(is_equal, selected_state);
    //major chart is selected
    } else if(array_picked[3]) {
        generateChartBaseOnStateMajorHelper(is_equal, selected_state);
    //only map is selected
    } else {
        generateChartBaseOnStateHelper(is_equal,selected_state);
    }
}
//helper function to handle the map-year-age pair selection
function generateChartBaseOnStateAgeHelper(is_equal,selected_state) {
    //select both year-age and map
    if(!array_picked[0]){
        array_picked[0] = true;
        generateSchoolInfoBaseOnAgeState(selected_state, previous_selected_year, previous_selected_age);
        generateGenderInfoBaseOnAgeState(selected_state, previous_selected_year, previous_selected_age);
        generateDegreeInfoBaseOnAgeState(selected_state, previous_selected_year, previous_selected_age);
        generateMajorInfoBaseOnAgeState(selected_state, previous_selected_year, previous_selected_age);
        //select year-age and change map to default
    } else if(array_picked[0] ) {
        goBackToDefaultCharts();
    }
}

//helper function to handle the map-degree pair selection
function generateChartBaseOnStateDegreeHelper(is_equal,selected_state) {
    //select both map and degree
    if(!array_picked[0]){
        array_picked[0] = true;
        generateSchoolInfoBaseOnDegreeState(previous_selected_state, previous_selected_degree);
        generateAgeInfoBaseOnDegreeState(previous_selected_state, previous_selected_degree)
        generateGenderInfoBaseOnDegreeState(previous_selected_state, previous_selected_degree);
        generateMajorInfoBaseOnDegreeState(previous_selected_state, previous_selected_degree);
    //select degree and change map to default
    } else if(array_picked[0]){
        goBackToDefaultCharts();
    }
}

//helper function to handle the map-major pair selection
function generateChartBaseOnStateMajorHelper(is_equal,selected_state) {
    //select both map and major
    if(!array_picked[0]){
        array_picked[0] = true;
        generateSchoolInfoBaseOnMajorState(previous_selected_state, previous_selected_major);
        generateAgeInfoBaseOnMajorState(previous_selected_state, previous_selected_major)
        generateGenderInfoBaseOnMajorState(previous_selected_state, previous_selected_major);
        generateDegreeInfoBaseOnMajorState(previous_selected_state, previous_selected_major);
    //select degree and change map to default
    } else if(array_picked[0]){
        goBackToDefaultCharts();
    }
}
//helper function to handle the only-map selection
function generateChartBaseOnStateHelper(is_equal,selected_state) {
    //map is not selected-- this is same as changing to another state
    if(!array_picked[0] || (array_picked[0] && !is_equal)) {
        array_picked[0] = true;
        generateSchoolInfoBaseOnState(selected_state);
        generateAgeInfoBaseOnState(selected_state);
        generateGenderInfoBaseOnState(selected_state);
        generateDegreeInfoBaseOnState(selected_state);
        generateMajorInfoBaseOnState(selected_state);
    } else if(array_picked[0] && is_equal){
        array_picked[0] = false;
        generateDefaultSchoolInfo();
        generateDefaultAgeChart();
        generateDefaultGenderInfo();
        generateDefaultDegree();
        generateDefaultMajor();
    }
}
/********************************************************************
*                   School Chart HighChart
*
*********************************************************************/
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
            plotShadow: false,
            options3d: {
                enabled: true,
                alpha: 45
            },
            animation:1500
        },
        title: {
            margin:5,
            text: "Sample Students\'s Universities"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                depth: 45,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    formatter: function(data) {
                        if(this.point.name.length >15) {
                            var name = this.point.name;
                            var name_substr = name.substring(15,name.length);
                            var first_space_index = name_substr.indexOf(' ');
                            var first_dash_index = name.indexOf('-');
                            var formatted_str;
                            if(first_dash_index!= -1) {
                                formatted_str = name.substring(0,first_dash_index) + "<br>" + name.substring(first_dash_index,name.length);
                            } else if(first_dash_index == -1 && first_space_index != -1) { 
                                first_space_index += 15;
                                formatted_str = name.substring(0,first_space_index) + "<br>" + name.substring(first_space_index,name.length);
                            } else if(first_dash_index == -1 && first_space_index == -1) {
                                formatted_str= this.point.name;
                            }
                            return formatted_str;
                        } else {
                            return this.point.name;
                        }
                    },
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

/********************************************************************
*                   Age-Year Chart HighChart
*
*********************************************************************/
function generateDefaultYearAgeChart(year_age_data) {
    //create dummy object to make the chart consistent
    var length = year_age_data.length;
    if(length < 3) {
        for(var i=length;i<=3;i++) {
            var dummy_obj = {};
            dummy_obj.name = null;
            dummy_obj.data = null;
            year_age_data.push(dummy_obj);
        }
    }
    var colors = Highcharts.getOptions().colors;
    $('#agechart').highcharts({
        title: {
            text: 'Age Distribution of Sample Students'
        },
        labels: {
            items: [{
                html: 'Gender Ratio',
                style: {
                    left: '580px',
                    top: '3px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        xAxis: {
            categories: age_range
        },
        yAxis: {
            title: {
                text: 'Percentage of (%)'
            },
            min:0
        }, 
        tooltip: {
            valueSuffix : "%"
        },
        plotOptions : {
            series: {
                animation: {
                    duration :1500
                }                
            }
        },
        series: [{
            type: "column",
            name : year_age_data[0].name,
            data : year_age_data[0].data,
            allowPointSelect : true,
            cursor : 'pointer',
            color: colors[1],
            events : {
                click : function(event) {
                    generateChartBaseOnAgeChange(this.name, event);
                }
            },
            states: {
                select: {
                    color: 'orange',
                    borderColor: 'white'
                },
                hover: {
                    color: 'orange',
                    borderColor : 'white'
                }
            }
        }, {
            type: "column",
            name : year_age_data[1].name,
            data : year_age_data[1].data,
            allowPointSelect : true,
            cursor : 'pointer',
            events : {
                click : function(event) {
                    generateChartBaseOnAgeChange(this.name, event);
                }
            },
            color: colors[2],
            states: {
                select: {
                    color: 'orange',
                    borderColor : 'white'
                },
                hover: {
                    color: 'orange',
                    borderColor : 'white'
                }
            }
        }, {
            type: "column",
            name : year_age_data[2].name,
            data : year_age_data[2].data,
            allowPointSelect : true,
            cursor : 'pointer',
            color: colors[3],
            events : {
                click : function(event) {
                    generateChartBaseOnAgeChange(this.name, event);
                }
            },
            states: {
                select: {
                    color: 'orange',
                    borderColor :'white'
                },
                hover: {
                    color: 'orange',
                    borderColor : 'white'
                }
            }
        }]
    });
}

//helper function to generate interactive component's chart
function generateChartBaseOnAgeChange(name,event) {
    var picked_count=0;
    var selected_year_age = name + "/" + event.point.category;
    var is_equal = (selected_year_age == previous_selected_year_age);
    previous_selected_year_age = selected_year_age;
    previous_selected_year = name;
    previous_selected_age = event.point.category;
    //reset the page if the user have already picked two different charts for filter purpose
    for(var i=0;i<array_picked.length;i++) {
        if(array_picked[i]) 
            picked_count++;
    }
    if(picked_count >=2 && !array_picked[1]) {
        goBackToDefaultCharts();
    }
    if(event.point.y ==0) {
        return;
    }
    //split the function into several sub-functions which handling each pair selection
    //map chart is selected
    if(array_picked[0]) {
        generateChartBaseOnAgeStateHelper(is_equal, name, event.point.category);
    //degree chart is selected
    } else if(array_picked[2]) {
        generateChartBaseOnAgeDegreeHelper(is_equal, name, event.point.category);
    //major chart is selected
    } else if(array_picked[3]) {
        generateChartBaseOnAgeMajorHelper(is_equal, name, event.point.category);
    //only map is selected
    } else {
        generateChartBaseOnAgeHelper(is_equal,name, event.point.category);
    }
}
//helper function to handle logics for age-state pair
function generateChartBaseOnAgeStateHelper(is_equal, year, age){
    //select both age and state
    if(!array_picked[1]){
        array_picked[1] = true;
        generateSchoolInfoBaseOnAgeState(previous_selected_state, year, age);
        generateGenderInfoBaseOnAgeState(previous_selected_state, year, age);
        generateDegreeInfoBaseOnAgeState(previous_selected_state, year, age);
        generateMajorInfoBaseOnAgeState(previous_selected_state, year, age);
    //stated was seleted but age chart should go back to default
    } else if(array_picked[1]){
        goBackToDefaultCharts();
    }
}
//helper function to handle logics for age-degree pair
function generateChartBaseOnAgeDegreeHelper(is_equal, year, age){
    //select both age and degree
    if(!array_picked[1]){
        array_picked[1] = true;
        generateMapBaseOnAgeDegreeChart(previous_selected_degree,year,age);
        generateSchoolInfoBaseOnAgeDegree(previous_selected_degree,year,age);
        generateGenderInfoBaseOnAgeDegree(previous_selected_degree,year,age);
        generateMajorInfoBaseOnAgeDegree(previous_selected_degree,year,age);
    //degree was seleted but age chart should go back to default
    } else if(array_picked[1]){
        goBackToDefaultCharts();
    }
}
//helper function to handle logics for age-major pair
function generateChartBaseOnAgeMajorHelper(is_equal, year, age){
    //select both age and major
    if(!array_picked[1]){
        array_picked[1] = true;
        generateMapBaseOnAgeMajorChart(previous_selected_major,year,age);
        generateSchoolInfoBaseOnAgeMajor(previous_selected_major,year,age);
        generateGenderInfoBaseOnAgeMajor(previous_selected_major,year,age);
        generateDegreeInfoBaseOnAgeMajor(previous_selected_major,year,age);
    //major was seleted but age chart should go back to default
    } else if(array_picked[1]){
        goBackToDefaultCharts();
    }
}
//helper function to handle logics when only age is selected
function generateChartBaseOnAgeHelper(is_equal, year, age){
    //pick up a an age filter 
    if(!array_picked[1] || (array_picked[1] && !is_equal)) {
        array_picked[1] = true;
        generateGenderInfoBaseOnAge(year, age);
        generateMapBaseOnAgeChart(year, age);
        generateSchoolInfoBaseOnAge(year, age);
        generateDegreeInfoBaseOnAge(year, age);
        generateMajorInfoBaseOnAge(year, age);
    //go back to default age chart
    } else if(array_picked[1] && is_equal) {
        array_picked[1] = false;
        generateDefaultMapChart();
        generateDefaultSchoolInfo();
        generateDefaultAgeChart();
        generateDefaultGenderInfo();
        generateDefaultDegree();
        generateDefaultMajor();
    }
}

/********************************************************************
*                   Gender Chart HighChart
*
*********************************************************************/
//generate default gender chart
function generateDefaultGenderChart(gender_data) {
    var age_chart = $('#agechart').highcharts();
    var previous_gender_series = age_chart.get('gender_chart');
    if(previous_gender_series) {
        age_chart.get('gender_chart').remove();
    }
    age_chart.addSeries({
        type: 'pie',
        id: 'gender_chart',
        name : 'Gender Ratio',
        allowPointSelect : true,
        tooltip : {
        valueSuffix : "%"
        },
        data: [{
            name: 'Female',
            y: gender_data['female_count'],
            color: '#cc3300' // female's color
        }, {
            name: 'Male',
            y: gender_data['male_count'],
            color: '#0099cc' // male's color
        }],
        center: [600, 40],
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

/********************************************************************
*                   Static Reason Chart HighChart
*
*********************************************************************/

//generate default reason chart
function generateDefaultReasonChart() {

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

/********************************************************************
*                   Degree Chart HighChart
*
*********************************************************************/

//draw degree chart
function generateDefaultDegreeChart(degree_percentage_map) {
    var degree_format_data = [];
    for(var degree in degree_percentage_map) {
        degree_format_data.push(degree_percentage_map[degree]);
    }
    $('#degreechart').highcharts({
        chart: {
            margin: 75,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 25,
                depth: 70
            }
        },
        title: {
            text: 'Degree Distribution of Dismissal Students'
        },
        plotOptions: {
            column: {
                depth: 35
            }
        },
        xAxis: {
            categories: Object.keys(degree_map)
        },
        yAxis: {
            title: {
                text: 'Percentage(%)'
            }
        },
        legend : {
            enabled: false
        },
        tooltip :{
            valueSuffix:'%'
        },
        cursor:'point',
        series: [{
            type:'bar',
            name: 'Percentage',
            data: degree_format_data,
            color:'#a3c1e0',
            allowPointSelect:true,
            states:{
                select: {
                    color:'orange',
                    borderColor:'orange',
                },
                hover: {
                    color: 'orange',
                    borderColor : 'white'
                }
            },
            events : {
                click : function(event) {
                    //complex logics -- needs unit tests
                    generateChartBaseOnDegreeChange(degree_map[event.point.category]);
                }
            }
        }]
    });
}
//complex logics -- needs unit tests
function generateChartBaseOnDegreeChange(degree_number) {
    var picked_count=0;
    var is_equal = (degree_number == previous_selected_degree);
    previous_selected_degree = degree_number;
    //reset the page if the user have already picked two different charts for filter purpose
    for(var i=0;i<array_picked.length;i++) {
        if(array_picked[i]) 
            picked_count++;
    }
    if(picked_count >=2 && !array_picked[2]) {
        goBackToDefaultCharts();
    }
    //split the function into several sub-functions which handling each pair selection
    //map is selected
    if(array_picked[0]) {
        generateChartBaseOnDegreeStateHelper(is_equal, degree_number);
    //age chart is selected
    } else if(array_picked[1]) {
        generateChartBaseOnDegreeAgeHelper(is_equal, degree_number);
    //major chart is selected
    } else if(array_picked[3]) {
        generateChartBaseOnDegreeMajorHelper(is_equal, degree_number);
    //only degree is selected
    } else {
        generateChartBaseOnDegreeHelper(is_equal,degree_number);
    }
}
//helper function to handle degree-state pair selection
function generateChartBaseOnDegreeStateHelper(is_equal, degree_number) {
    //select both degree and state
    if(!array_picked[2]){
        array_picked[2] = true;
        generateSchoolInfoBaseOnDegreeState(previous_selected_state,degree_number);
        generateAgeInfoBaseOnDegreeState(previous_selected_state,degree_number);
        generateGenderInfoBaseOnDegreeState(previous_selected_state,degree_number);
        generateMajorInfoBaseOnDegreeState(previous_selected_state,degree_number);
    //change to another degree and map is also selected
    } else if(array_picked[2]) {
        goBackToDefaultCharts();
    }
}
//helper function to handle degree-age pair selection
function generateChartBaseOnDegreeAgeHelper(is_equal, degree_number) {
    //select both age and degree
    if(!array_picked[2]){
        array_picked[2] = true;
        generateMapBaseOnAgeDegreeChart(degree_number,previous_selected_year,previous_selected_age);
        generateSchoolInfoBaseOnAgeDegree(degree_number,previous_selected_year,previous_selected_age);
        generateGenderInfoBaseOnAgeDegree(degree_number,previous_selected_year,previous_selected_age);
        generateMajorInfoBaseOnAgeDegree(degree_number,previous_selected_year,previous_selected_age);
    //degree was seleted but age chart should go back to default
    } else if(array_picked[2]){
        goBackToDefaultCharts();
    }
}
//helper function to handle degree-major pair selection
function generateChartBaseOnDegreeMajorHelper(is_equal, degree_number) {
    //select both major and degree
    if(!array_picked[2]){
        array_picked[2] = true;
        generateMapBaseOnDegreeMajorChart(degree_number,previous_selected_major);
        generateSchoolInfoBaseOnDegreeMajor(degree_number,previous_selected_major);
        generateAgeInfoBaseOnDegreeMajor(degree_number,previous_selected_major);
        generateGenderInfoBaseOnDegreeMajor(degree_number,previous_selected_major);
    //major was seleted but degree chart should go back to default
    } else if(array_picked[2]){
        goBackToDefaultCharts();
    }
}
//helper function to handle degree only selection
function generateChartBaseOnDegreeHelper(is_equal, degree_number) {
    if(!array_picked[2] || (array_picked[2] && !is_equal)) {
        array_picked[2] = true;
        generateMapBaseOnDegreeChart(degree_number);
        generateSchoolInfoBaseOnDegree(degree_number);
        generateAgeInfoBaseOnDegree(degree_number);
        generateGenderInfoBaseOnDegree(degree_number);
        generateMajorInfoBaseOnDegree(degree_number);
    } else if(array_picked[2] && is_equal) {
        array_picked[2] = false;
        generateDefaultMapChart();
        generateDefaultSchoolInfo();
        generateDefaultAgeChart();
        generateDefaultGenderInfo();
        generateDefaultMajor();
    }
}

/********************************************************************
*                   Major Chart HighChart
*
*********************************************************************/   

//draw major chart
function generateDefaultMajorChart(major_percentage_map) {
    var major_format_data=[];
    for(var major in major_percentage_map) {
        var current_major = [];
        current_major.push(major_map[major]);
        current_major.push(major_percentage_map[major]);
        major_format_data.push(current_major);
    }
    $('#majorchart').highcharts({
        chart: {
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Major Distribution of Dismissal Students'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Percentage',
            innerSize: '50%',
            allowPointSelect:true,
            states:{
                select: {
                    color:'orange'
                },
                hover: {
                    color: 'orange',
                    borderColor : 'white'
                }
            },
            data: major_format_data,
            events : {
                click : function(event) {
                    //complex logics -- needs unit tests
                    generateChartBaseOnMajorChange(event.point.name);
                }
            }
        }]
    });
}

//complex logics -- needs unit tests
function generateChartBaseOnMajorChange(major) {
    var picked_count =0;
    var selected_major_number;
    //reset the page if the user have already picked two different charts for filter purpose
    for(var i=0;i<array_picked.length;i++) {
        if(array_picked[i]) 
            picked_count++;
    }
    if(picked_count >=2 && !array_picked[3]) {
        goBackToDefaultCharts();
    }
    
    for(var search_major in major_map) {
        if(major_map[search_major] === major) {
            selected_major_number = search_major;
        }
    }
    var is_equal = (selected_major_number == previous_selected_major);
    previous_selected_major = selected_major_number;
    //split the function into several sub-functions which handling each pair selection
    //map is selected
    if(array_picked[0]) {
        generateChartBaseOnMajorStateHelper(is_equal, selected_major_number);
    //age chart is selected
    } else if(array_picked[1]) {
        generateChartBaseOnMajorAgeHelper(is_equal, selected_major_number);
    //major chart is selected
    } else if(array_picked[2]) {
        generateChartBaseOnMajorDegreeHelper(is_equal, selected_major_number);
    //only degree is selected
    } else {
        generateChartBaseOnMajorHelper(is_equal,selected_major_number);
    }
}

//helper function to handle the major-state pair selection
function generateChartBaseOnMajorStateHelper(is_equal, selected_major_number) {
    //select both major and state
    if(!array_picked[3]){
        array_picked[3] = true;
        generateSchoolInfoBaseOnMajorState(previous_selected_state,selected_major_number)
        generateAgeInfoBaseOnMajorState(previous_selected_state,selected_major_number);
        generateGenderInfoBaseOnMajorState(previous_selected_state,selected_major_number);
        generateDegreeInfoBaseOnMajorState(previous_selected_state,selected_major_number);
    //change to another degree and map is also selected
    } else if(array_picked[3]) {
        goBackToDefaultCharts();
    }
}
//helper function to handle the major-state pair selection
function generateChartBaseOnMajorAgeHelper(is_equal, selected_major_number) {
    //select both age and major
    if(!array_picked[3]){
        array_picked[3] = true;
        generateMapBaseOnAgeMajorChart(selected_major_number,previous_selected_year,previous_selected_age);
        generateSchoolInfoBaseOnAgeMajor(selected_major_number,previous_selected_year,previous_selected_age);
        generateGenderInfoBaseOnAgeMajor(selected_major_number,previous_selected_year,previous_selected_age);
        generateDegreeInfoBaseOnAgeMajor(selected_major_number,previous_selected_year,previous_selected_age);
    //major was seleted but age chart should go back to default
    } else if(array_picked[3]){
        goBackToDefaultCharts();
    }
}
//helper function to handle the major-state pair selection
function generateChartBaseOnMajorDegreeHelper(is_equal, selected_major_number) {
    //select both major and degree
    if(!array_picked[3]){
        array_picked[3] = true;
        generateMapBaseOnDegreeMajorChart(previous_selected_degree,selected_major_number);
        generateSchoolInfoBaseOnDegreeMajor(previous_selected_degree,selected_major_number);
        generateAgeInfoBaseOnDegreeMajor(previous_selected_degree,selected_major_number);
        generateGenderInfoBaseOnDegreeMajor(previous_selected_degree,selected_major_number);
    //degree was seleted but major chart should go back to default
    } else if(array_picked[3]){
        goBackToDefaultCharts();
    }
}
//helper function to handle the major-state pair selection
function generateChartBaseOnMajorHelper(is_equal, selected_major_number) {
    if(!array_picked[3] || (array_picked[3] && !is_equal)) {
        array_picked[3] = true;
        generateMapBaseOnMajorChart(selected_major_number);
        generateSchoolInfoBaseOnMajor(selected_major_number);
        generateAgeInfoBaseOnMajor(selected_major_number);
        generateGenderInfoBaseOnMajor(selected_major_number);
        generateDegreeInfoBaseOnMajor(selected_major_number);
    } else if(array_picked[3] && is_equal) {
        array_picked[3] = false;
        generateDefaultMapChart();
        generateDefaultSchoolInfo();
        generateDefaultAgeChart();
        generateDefaultGenderInfo();
        generateDefaultDegree();
    }
}
/********************************************************
            Visualization generation end
*********************************************************/

