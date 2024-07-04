function usermsgfun(msg){
    document.getElementById("divusermsg").style.visibility = "visible";
    document.getElementById("usermsg12").innerHTML = msg;
    setTimeout(function(){
    document.getElementById("divusermsg").style.visibility = "hidden";
    }, 2000);
}

function subscribegymmanagement() {
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'subscribegymmanagement',
        },
        //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function notice(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res === "subscribed") {
                    alert("Your trial period of 3 days is started.")
                    window.location.replace("/1/gymmanagement");
                }
            }
        }
    })
}
function orginfo(){
    document.getElementById("gymbase").style.display= "none";
    document.getElementById("orginformation").style.display= "block";
    // document.getElementById("taskpage").style.display="none";
}
function closebmi(){
    document.getElementById("bmireportmember").style.display = 'none'
    document.getElementById("membermenu").style.display = 'block'
}

function openworkoutmem(){
    document.getElementById("workoutmember").style.display = 'block'
    document.getElementById("membermenu").style.display = 'none'
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'workoutmember',
        },
        //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function notice(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("workout12").innerHTML = res
            }
        }
    })
}
function closeworkoutmem(){
    document.getElementById("workoutmember").style.display = 'none'
    document.getElementById("membermenu").style.display = 'block'
}
function openmembmi(){
    document.getElementById("bmireportmember").style.display = 'block'
    document.getElementById("membermenu").style.display = 'none'
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'bmisearchmember',
        },
        //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function notice(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("bmireportmem").innerHTML = res
            }
        }
    })
}
function paymenthistorymem(){
    var ibox = document.getElementById("membermenu");
    ibox.style.display = "none";
    var tdiv1 = document.getElementById("paymenthistorymem");
    tdiv1.style.display = 'block'
}
function closepaymenthistorymem(){
    var ibox = document.getElementById("membermenu");
    ibox.style.display = "block";
  document.getElementById("paymenthistorymem").style.display = 'none'
}
function seepaymentmem(){
    if($("#fromdatemem").val()=='' || $("#todatemem").val()==''){
        return alert("Please select dates")
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'seepaymentmem',
            sdate: $("#fromdatemem").val(),
            edate: $("#todatemem").val(),
        },
        cache: false,
        success: function savecaller(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("paymenthistorymember").innerHTML=res
            }
        }
    })

}
function memberprofile(){
    var ibox = document.getElementById("membermenu");
    ibox.style.display = "none";
    var tdiv1 = document.getElementById("memberprofile");
    tdiv1.style.display = 'block'
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "getmemberprofile",

        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                var adate,bdate 
                if(res != "No Details"){
                    if(res[7] == " " || res[7] == null || res[7] == undefined || res[7] == ""){
                        adate == ' '
                    }else{
                        adate = new Date(res[7])
                        adate = adate.getFullYear() + '-' + ('0' + (adate.getMonth() + 1)).slice(-2) + '-' + ('0' + adate.getDate()).slice(-2)
                    }
                    if(res[8] == " " || res[8] == null || res[8] == undefined || res[8] == ""){
                        bdate == ' '
                    }else{
                        bdate = new Date(res[8])
                        bdate = bdate.getFullYear() + '-' + ('0' + (bdate.getMonth() + 1)).slice(-2) + '-' + ('0' + bdate.getDate()).slice(-2)
                    }
                    if(adate == undefined || adate == null || adate == ""){
                        adate = " "
                    }
                    if(bdate == undefined || bdate == null || bdate == ""){
                        bdate = " "
                    }
                    document.getElementById("memberidmem").innerHTML=res[6]
                    document.getElementById("namemem").innerHTML=res[0]
                    document.getElementById("emailmem").innerHTML=res[2]
                    document.getElementById("mobilemem").innerHTML=res[1]
                    document.getElementById("anniversarymem").innerHTML=adate
                    document.getElementById("birthdatemem").innerHTML=bdate
                    document.getElementById("addressmem").innerHTML=res[3]
                    document.getElementById("citymem").innerHTML=res[4]
                    document.getElementById("pinmem").innerHTML=res[5]
                }else{
                    res.send("No Details Found Try Again Later")
                }
            }
        }
    })
}
function closememberprof(){
    var ibox = document.getElementById("membermenu");
    ibox.style.display = "block";
    var tdiv1 = document.getElementById("memberprofile");
    tdiv1.style.display = 'none'
}
function showorgprofile(calid) {
    var ibox = document.getElementById("orgprofile");
    ibox.style.display = "block";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "getorgprofile",
            calid: calid,
        },
        cache: false,
        success: function(res){
            res = JSON.parse(res)
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res[0]==="orginfo") {
                    let orgname = res[1], orggst = res[8], orgpan = res[9], orgbankname = res[10], orgbankaccountname = res[11], orgbankaccountnumber = res[12];  
                    let orgaddress = res[2], orgcity = res[3], orgstate = res[4], orgpin = res[5], orgcontact = res[6], orgemailid = res[7], orgifsccode = res[13];   
                    if(orgname === null || orgname === "undefined" || orgname === '' || orgname === 'null' || orgname === undefined){
                        orgname = '';
                    }
                    if(orgbankaccountnumber === null || orgbankaccountnumber === "undefined" || orgbankaccountnumber === '' || orgbankaccountnumber === 'null' || orgbankaccountnumber === undefined){
                        orgbankaccountnumber = '';
                    }
                    if(orgaddress === null || orgaddress === "undefined" || orgaddress === '' || orgaddress === 'null' || orgaddress === undefined){
                        orgaddress = '';
                    }
                    if(orgcity === null || orgcity === "undefined" || orgcity === '' || orgcity === 'null' || orgcity === undefined){
                        orgcity = '';
                    }
                    if(orgstate === null || orgstate === "undefined" || orgstate === '' || orgstate === 'null' || orgstate === undefined){
                        orgstate = '';
                    }
                    if(orgcontact === null || orgcontact === "undefined" || orgcontact === '' || orgcontact === 'null' || orgcontact === undefined){
                        orgcontact = '';
                    }
                    if(orgemailid === null || orgemailid === "undefined" || orgemailid === '' || orgemailid === 'null' || orgemailid === undefined){
                        orgemailid = '';
                    }
                    if(orgifsccode === null || orgifsccode === "undefined" || orgifsccode === '' || orgifsccode === 'null' || orgifsccode === undefined){
                        orgifsccode = '';
                    }
                    if(orggst === null || orggst === "undefined" || orggst === '' || orggst === 'null' || orggst === undefined){
                        orggst = '';
                    }
                if(orgpan === null || orgpan === "undefined" || orgpan === '' || orgpan === 'null' || orgpan === undefined){
                        orgpan = '';
                    }
                    if(orgbankname === null || orgbankname === "undefined" || orgbankname === '' || orgbankname === 'null' || orgbankname === undefined){
                        orgbankname = '';
                    }
                    if(orgbankaccountname === null || orgbankaccountname === "undefined" || orgbankaccountname === '' || orgbankaccountname === 'null' || orgbankaccountname === undefined){
                        orgbankaccountname = '';
                    }
                    if(orgpin === null || orgpin === "undefined" || orgpin === '' || orgpin === 'null' || orgpin === undefined){
                        orgpin = '';
                    }
                    document.getElementById("orgname").value = orgname;
                    document.getElementById("orgaddress").value = orgaddress;
                    document.getElementById("orgcity").value = orgcity;
                    document.getElementById("orgstate").value = orgstate;
                    document.getElementById("orgpin").value = orgpin;
                    document.getElementById("orgcontact").value = orgcontact;
                    document.getElementById("orgemailid").value = orgemailid;
                    document.getElementById("orggst").value = orggst;
                    document.getElementById("orgpan").value = orgpan;
                    document.getElementById("orgbankname").value = orgbankname;
                    document.getElementById("orgbankaccountname").value = orgbankaccountname;
                    document.getElementById("orgbankaccountnumber").value = orgbankaccountnumber;
                    document.getElementById("orgifsccode").value = orgifsccode;
                    retrivebgstylecolor();
                } else {
                    retrivebgstylecolor();
                    usermsgfun("Org information not found. Please save org information.")
                }
            }
        }
    })
}
function saveorginfo() {
    // document.getElementById("loader2").style.visibility = "visible";
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "saveorginfo",
            orgname: $('#orgname12').val(),
            orgaddress: $('#orgaddress1').val(),
            orgcity: $('#orgcity1').val(),
            orgstate: $('#orgstate1').val(),
            orgcontact: $('#orgcontact1').val(),
            orgemailid: $('#orgemailid1').val(),
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res === "Saved"){
                // document.getElementById("loader2").style.visibility = "hidden";
                usermsgfun("Profile Saved successfully")
                window.location.replace('/1/menu')
            }
            }
        }
    })
}
function closeorginfo(){
    document.getElementById("orginformation").style.display='none';
    document.getElementById("gymbase").style.display='block';
}
function saveorgprofile(calid) {
    // document.getElementById("loader2").style.visibility = "visible";
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "saveorgprofile",
            calid: calid,
            orgname: $('#orgname').val(),
            orgaddress: $('#orgaddress').val(),
            orgcity: $('#orgcity').val(),
            orgstate: $('#orgstate').val(),
            orgpin: $('#orgpin').val(),
            orgcontact: $('#orgcontact').val(),
            orgemailid: $('#orgemailid').val(),
            orggst: $('#orggst').val(),
            orgpan: $('#orgpan').val(),
            orgbankname: $('#orgbankname').val(),
            orgbankaccountname: $('#orgbankaccountname').val(),
            orgbankaccountnumber: $('#orgbankaccountnumber').val(),
            orgifsccode: $('#orgifsccode').val(),
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res === "Saved"){
                // document.getElementById("loader2").style.visibility = "hidden";
                usermsgfun("Profile Saved successfully")}
            }
        }
    })
}
function showadminmgmt(){
    var ibox = document.getElementById("divadminmgmt");
    ibox.style.display = "block";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none';
    showadmins();
}
function showadmins(){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "getgymadmin",
        },
        cache: false,
        success: function(res){
            //alert(res)
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("divadminlist").innerHTML = res
            }
        }
    })
}

function openuploadwindow(){
    var ibox = document.getElementById("uploadwindow");
    ibox.style.display = "block";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none';
    
}
function searchgymadmin() {
    if($("#admincontactnumber").val()===''){
        return alert("Enter the mobile number first")
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "searchuser",
            mobilenumber: $('#admincontactnumber').val(),
        },
        cache: false,
        success: function(res){
            if(res === "notfound")
            {
                usermsgfun("User is not registered")
            } else {
                var ans = confirm("Do you want to make "+res+" your gym admin?")
                if(ans) {
                    $.ajax({
                        url: "/1/gymmanagement",
                        type: "POST",
                        data: {
                            action: "addgymadmin",
                            mobilenumber: $('#admincontactnumber').val(),
                        },
                        cache: false,
                        success: function(res){
                            if(res === 'sessionexpired'){
                                alert("Session Expired, Please login Again")
                                window.location.replace("/1/login")
                            }else{
                                if(res === "added")
                                {
                                    usermsgfun("Gym Admin Added Successfully")
                                    showadmins()
                                } else {
                                    showadmins();
                                    usermsgfun(res)
                                }
                            }
                        }
                    })
                }
            }
        }
    })
}
function showplanmgmt(){
    var ibox = document.getElementById("divplanmgmt");
    ibox.style.display = "block";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
    getgymplans()
}
function getgymplans(){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "getgymplans",
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
            //alert(res)
                planmamelist = document.getElementById("plannamelist")
                planmamelist.length = 0;
                for(i=0;i<res.length;i++) {
                    planmamelist[planmamelist.length] = new Option(res[i], i);
                }
            }
        }
    })
}
function showdetails(){
    let planname = $("#memberplan").val()
    if(planname !='Select'){
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "showdetails",
                planname: planname,
            },
            cache: false,
            success: function(res){
                //res = JSON.parse(res)
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    document.getElementById("duration").value = res[0].duration
                    document.getElementById("fee").value = res[0].fee
                    document.getElementById("discount").value = ''
                    document.getElementById("amount2").value = ''
                    enddate()
                }
            }
        })
    }
}
function attendancereport(){
    document.getElementById("workoutcards").style.display='none'
    document.getElementById("divmembermgmt").style.display='none';
    document.getElementById("memberreports").style.display='none';
    document.getElementById("openbmi").style.display='none';
    document.getElementById("PaymentReport").style.display='none';
    document.getElementById("BalanceReport").style.display='none';
    var ibox = document.getElementById("divattendance");
    ibox.style.display = "block";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
    attendacesearch();
}
function attendacesearch(){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "attendacesearch",
            mebid:$("#mebid").val(),
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("attendancedetails").innerHTML = res
            }
        }
    })
}
function playaudio(){
    var audio = new Audio('/static/image/foghi.mp3');
    // alert(audio + " -audio")
    audio.play();
}
function closeadminmgmt(){
    var ibox = document.getElementById("divadminmgmt");
    ibox.style.display = "none";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'block'
}
function closeorgprofile(calid) {
    var ibox = document.getElementById("orgprofile");
    ibox.style.display = "none";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'block'
}
function closeplanmgmt(){
    var ibox = document.getElementById("divplanmgmt");
    ibox.style.display = "none";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'block'
}
function closememberreport(){
    document.getElementById("workoutcards").style.display='none'
    document.getElementById("divmembermgmt").style.display='none';
    document.getElementById("memberreports").style.display='none';
    document.getElementById("openbmi").style.display='none';
    document.getElementById("divattendance").style.display='none';
    document.getElementById("BalanceReport").style.display='none';
    document.getElementById("PaymentReport").style.display = 'none';
    document.getElementById("menugymoption").style.display = 'none'
    var ibox = document.getElementById("memberreports");
    ibox.style.display = "none";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'block'
}
function searchregmember(){
    var date_ob = new Date();
    var currentdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2)
    let memberid2 = $("#mebid").val();
    if(memberid2.length > 3){
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "searchregmember",
                memberid: memberid2,
            },
            cache: false,
            success: function(res){
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    var age = res[5];
                    if(age === null || age === undefined){
                        age = '';
                    }
                    var height = res[8];
                    if(height === null || height === undefined){
                        height = '';
                    }
                    var weight = res[7];
                    if(weight === null || weight === undefined){
                        weight = '';
                    }
                    var fat = res[6];
                    if(fat === null || fat === undefined){
                        fat = '';
                    }
                    var bmi = res[9];
                    if(bmi == null || bmi == undefined){
                        bmi = '';
                    } 
                    var date = res[10];
                    if (date == null || date == undefined) {
                        date = '';
                    } else {
                        var dateObj = new Date(date);
                        date =  dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
                    }
                    var sdate=new Date(res[3])
                    // alert(sdate + " - sdate")
                    if(sdate === ''||sdate === null){
                        sdate = '0000-00-00'
                    }
                    else{
                        sdate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2);
                    }
                    var ndate= new Date(res[4])
                    // alert(ndate + " ndate")
                    if(ndate === ''||ndate === null){
                        ndate = '0000-00-00'
                    }
                    else{
                        ndate = ndate.getFullYear() + '-' + ('0' + (ndate.getMonth() + 1)).slice(-2) + '-' + ('0' + ndate.getDate()).slice(-2);
                    }
                    document.getElementById("membername").value = res[1];
                    document.getElementById("profilepic2").innerHTML = "<img style='width:300px;' src='/getprofilepicgym/"+res[0]+".png'>"
                    var d1 = new Date(ndate);   
                    // alert(d1 + " d1")
                    var d2 = new Date(currentdate);
                    // alert(d2 + " d2")
                    var diff = d1.getTime() - d2.getTime(); 
                    // alert(diff + " diff")
                    var daydiff = diff / (1000 * 60 * 60 * 24);  
                    if(daydiff <= 0){
                        playaudio();
                        document.getElementById("memberstatus").value = "Deactivate"
                    }
                    else if(daydiff <= 3){
                        playaudio();
                        document.getElementById("memberstatus").value = "Active"
                    }
                    else{
                        document.getElementById("memberstatus").value = "Active" 
                    }
                    out = "<table id='report'><tr><th>Age</th><th>Fat</th><th>weight</th><th>Height</th><th>BMI</th><th> Date </th></tr>"
                    out = out + "<tr><td>" + age + "</td><td>" + fat + "</td><td>" + weight + "</td><td>" + height + "</td><td>" + bmi + "</td><td>"+date+"</tr>"
                    document.getElementById("bmireport").innerHTML=out;
                }
            }
        })
    }
    else if(memberid2.length < 3){
        document.getElementById("membername").value = "";
        document.getElementById("memberstatus").value = "";
        document.getElementById("profilepic2").innerHTML = "";
        document.getElementById("bmireport").innerHTML="";
    }
}

// var input = document.getElementById("mebid");
// input.addEventListener("keyup", function(event) {
//   if (event.keyCode === 13) {
//    event.preventDefault();
//    document.getElementById("attendnce12").click();
//   }
// });

// $('#mebid').keypress(function(event) {
//     // Check if the Enter key (key code 13) is pressed
//     if (event.which === 13) {
//         // Call the markattendancegym function
//         markattendancegym();
//     }
// });

$('#mebid').keypress(function(event) {
    if (event.which === 13) {
        markattendancegym(); // Call the markattendancegym function
    }
});

function markattendancegym(){
    // document.getElementById("loader2").style.visibility = "visible";
    if ($('#mebid').val() < 3) {
        return alert("Please enter valid ID");
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "markattendancegym",
            memberid: $('#mebid').val(),
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("membername").value='';
                document.getElementById("mebid").value='';
                document.getElementById("memberstatus").value='';
                document.getElementById("bmireport").innerHTML=''
                document.getElementById("profilepic2").innerHTML=''
                // document.getElementById("loader2").style.visibility = "hidden";
                usermsgfun(res)
                attendacesearch();
            }
        }
    })
}
function saveplan() {
    if($("#planname").val()===''){
        return alert("Enter the plan name")
    }
    if($("#planduration").val()===''){
        return alert("Enter the planduration ")
    }
    if($("#planfee").val()===''){
        return alert("Enter the plan Fee ")
    }
    // document.getElementById("loader3").style.visibility = "visible";
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "savegymplan",
            planname: $('#planname').val(),
            duration: $('#planduration').val(),
            fee: $('#planfee').val(),
        },
        cache: false,
        success: function(res){
            // document.getElementById("loader3").style.visibility = "hidden";
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res === "Saved")
                usermsgfun("Plan Saved successfully")
                if(res === "Updated")
                usermsgfun("Plan Updated successfully")
                getgymplans()
            }
        }
    })
}
function savememberplan(){
    if($('#membermobile').val()==='' || $('#membermobile').val() === null){
        return alert("Please enter mobile number")
    }
     var fee1=$('#fee').val();
    var amount3=$('#amount2').val();
    if($('#discount').val()==='' || $('#discount').val() === null){
        amount3=fee1;
    }else
    var amount3=$('#amount2').val();
    // document.getElementById("loader2").style.visibility = "visible";
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "savememberplan",
            membermobilesearch: $('#membermobile').val(),
            memberid: $("#memberid2").val(),
            planname: $('#memberplan').val(),
            duration: $('#duration').val(),
            startdate: $('#startdate').val(),
            enddate: $('#enddate').val(),
            discount: $('#discount').val(),
            amount2:amount3,
            // amount2: $('#amount2').val(),
            fee: $('#fee').val(),
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                usermsgfun(res)
                // document.getElementById("loader2").style.visibility = "hidden";
                showmyplans();
            }
        }
    })
}

function newplan() {
    document.getElementById("planname").value = ""
    document.getElementById("planduration").value = ""
    document.getElementById("planfee").value = ""
}
function searchgymplan() {
    sel = document.getElementById("plannamelist")
    planname = sel.options[sel.selectedIndex].text
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "searchgymplan",
            planname: planname,
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                res = JSON.parse(res)
                document.getElementById("planname").value = planname
                document.getElementById("planduration").value = res[0]
                document.getElementById("planfee").value = res[1]
            }
        }
    })
}
function getexercise(){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "getexercise",
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res==='no data'){
                    console.log("no exercises")
                }else{
                    let slsn1 = document.getElementById("exername")
                    slsn1.length = 0
                    slsn1[slsn1.length] = new Option('Select')
                    for (i = 0; i < res.length; i++) {
                        //  slsn1[slsn1.length] = new Option(res[i].locaname+","+res[i].loc_id)
                        var myOption = document.createElement("option");
                        myOption.text = res[i]
                        myOption.value = res[i]
                        slsn1.add(myOption);
                    }
                }
            }
        }
    })
}
function membermenu(){
    if($("#selectgym").val()=='Select'){
        alert("Please Select Gym Name")
    }else{
        var ibox = document.getElementById("membermenu");
        ibox.style.display = "block";
        var tdiv1 = document.getElementById("gymbase");
        tdiv1.style.display = 'none'    
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "membermenu",
                name : $("#selectgym").val(),
        },
        cache: false,
        success: function(res){
           
            var logo = document.getElementById("gymlogo");
            logo.style.display ='block';
            logo.style.marginLeft  = "55%"
            logo.src = "/getlogogym/"+$("#selectgym").val()+".png"    
            }
        });
    }
}
function getallsubscriptions(){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "getallsubscriptions",
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res==='No Data'){
                    console.log("no exercises")
                }else{
                    let slsn1 = document.getElementById("selectgym")
                    slsn1.length = 0
                    slsn1[slsn1.length] = new Option('Select')
                    for (i = 0; i < res.length; i++) {
                        //  slsn1[slsn1.length] = new Option(res[i].locaname+","+res[i].loc_id)
                        var myOption = document.createElement("option");
                        myOption.text = res[i].name
                        myOption.value = res[i].id
                        slsn1.add(myOption);
                    }
                }
            }
        }
    });
}
function addcards(){
    if( $("#cardname").val()==='' || $("#cardname").val()===null){
        return alert("Please Enter Card Name")
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "addcards",
            cardname: $("#cardname").val(),
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res === 'dublicate'){
                    getcardname()
                    usermsgfun("Card Name Already Exist")
                }else if(res === 'successful'){
                    getcardname()
                    usermsgfun("Card Is Add successfully")
                }else{
                    getcardname()
                    usermsgfun("Unsuccessful")
                }
            }
        }
    })
}
function getcardname(){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "getcardnames",
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res==='no'){
                    console.log("no exercises")
                }else{
                    let slsn1 = document.getElementById("cardname2")
                    slsn1.length = 0
                    slsn1[slsn1.length] = new Option('Select')
                    for (i = 0; i < res.length; i++) {
                        //  slsn1[slsn1.length] = new Option(res[i].locaname+","+res[i].loc_id)
                        var myOption = document.createElement("option");
                        myOption.text = res[i]
                        myOption.value = res[i]
                        slsn1.add(myOption);
                    }
                    let slsn2 = document.getElementById("cardname3")
                    slsn2.length = 0
                    slsn2[slsn2.length] = new Option('Select')
                    for (i = 0; i < res.length; i++) {
                        //  slsn1[slsn1.length] = new Option(res[i].locaname+","+res[i].loc_id)
                        var myOption = document.createElement("option");
                        myOption.text = res[i]
                        myOption.value = res[i]
                        slsn2.add(myOption);
                    }
                }
            }
        }
    })
}
function addexercise(){
    if( $("#cardname2").val()==='Select'){
        return alert("Please Enter Card Name")
    }else if($("#exername").val()==='Select'||$("#weight").val()===''|| $("#howmany").val()===''||$("#rep").val()===''||$("#seq").val()===''){
        return alert("Some Fields Are Missing")
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "addexercise",
            cardname: $("#cardname2").val(),
            weight: $("#weight").val(),
            times: $('#howmany').val(),
            rep: $('#rep').val(),
            seq: $('#seq').val(),
            exercisename: $("#exername").val(),
            exerday: $("#exerday").val(),
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res === 'successful'){
                    previewcard();
                    usermsgfun("Exercise Is Add")
                }else{
                    usermsgfun("Unsuccessful")
                }
            }
        }
    })
}

async function assignworkoutcard(){
    const canvas = await html2canvas(document.querySelector("#newgymcard2"));
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    if($('#cardname3').val()=='Select'){
       return alert("Please Select Card")
    }
    if($('#memberIDsearch3').val()==''){
        return alert("Please Enter Valid ID")
    }
    if($('#programmer').val()==''){
        return alert("Please Enter Programmer name")
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "assignworkoutcard",
            cardname: $('#cardname3').val(),
            memberid: $('#memberIDsearch3').val(),
            programmer: $('#programmer').val(),
            image: image,
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                usermsgfun(res)
            }
        }
    })
}
function shareworkoutcard2(){
   
    if($('#mebid').val()==''){
        alert("Please Enter Valid ID")
        
    }else{
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "getmobile",
                memberid: $('#mebid').val(),
            },
            cache: false,
            success: function(res){
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res == 'no data'){
                        usermsgfun("Card Not Found")
                    }else{
                        
                        const a = document.createElement("img");
                        a.setAttribute("src", "/getworkoutcard/"+res[0]);
                        a.setAttribute("id", "image");
                        var encodedUri = encodeURIComponent(a.src);
                        var rtext = "https://wa.me/91" + res[0] +"?text="+encodedUri
                        window.open(rtext, 'xyz');
                    }
                }
            }
        })
    }
}
function shareworkoutcard(){
    alert("please Save First Card")
    if($('#memberIDsearch3').val()==''){
        alert("Please Enter Valid ID")
    }else{
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "getmobile",
                memberid: $('#memberIDsearch3').val(),
            },
            cache: false,
            success: function(res){
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res == 'no data'){
                        usermsgfun("Card Not Found")
                    }else{
                        
                        const a = document.createElement("img");
                        a.setAttribute("src", "/getworkoutcard/"+res[0]);
                        a.setAttribute("id", "image");
                        var encodedUri = encodeURIComponent(a.src);
                        var rtext = "https://wa.me/91" + res[0] +"?text="+encodedUri
                        window.open(rtext, 'xyz');
                    }
                }
            }
        })
    }
}
function preassignedcard(){
    if($('#cardname3').val()=='Select'){
        return 
    }
    if($('#memberIDsearch3').val()==''){
        return alert("Please Enter Valid ID")
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "preassignedcard",
            cardname: $('#cardname3').val(),
            memberid: $('#memberIDsearch3').val(),
            programmer: $('#programmer').val(),
        },
        cache: false,
        success: function(res){
            // alert(res)
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res == 'No Date'){
                    document.getElementById("showexercisess2").innerHTML=res
                }else if(res == "FIrst Add This Member BMI "){
                    usermsgfun(res)
                }else{
                    document.getElementById("showexercisess2").innerHTML=res
                }
            }
        }
    })
}
function previewcard(){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "previewcard",
            cardname: $('#cardname2').val(),
        },
        cache: false,
        success: function(res){
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res!='No Date'){
                    document.getElementById("showexercisess").innerHTML=res;
                }else{
                    document.getElementById("showexercisess").innerHTML=res;
                }
            }
        }
    })
}
function removeplans(){
    var ans = confirm("All plan related data will be vanished")
    if($('#planname').val()==='' || $('#planname').val()===null){
       return alert("Please Select Plan.")
    }else if(ans == true){
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "removeplans",
                planname: $('#planname').val(),
            },
            cache: false,
            success: function(res){
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    usermsgfun(res);
                    searchgymplan();
                    getgymplans();
                }
            }
        })  
    }
}
function showmembermgmt(){
    document.getElementById("divattendance").style.display='none';
    document.getElementById("memberreports").style.display='none';
    document.getElementById("openbmi").style.display='none';
    document.getElementById("workoutcards").style.display='none';
    document.getElementById("PaymentReport").style.display='none';
    document.getElementById("BalanceReport").style.display='none';
    document.getElementById("showimgaftersearch").style.display='none';
    document.getElementById("showimgaftersearch").style.display='none';
    var ibox = document.getElementById("menugymoption");
    ibox.style.display = "block";
    var ibox2 = document.getElementById("divmembermgmt");
    ibox2.style.display = "block";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
    var today = new Date();
    document.getElementById("startdate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    document.getElementById("pdate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    usergymplan();
    getnames();
    getcardname();
}
function sendmessage1(){
    let rtext = "https://wa.me/91" + 8009936009;
    window.open(rtext, 'xyz');
}
function sendmessage2(){
    let rtext = "https://wa.me/91" + 8009926009
    window.open(rtext, 'xyz');
}
function showgymaccount(){
    var ibox = document.getElementById("gymaccount");
    ibox.style.display = "block";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'opengymaccount',
        },
            //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function savecaller(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res === "error"){
                    usermsgfun("Please check internet connection if problem persists contact us")
                }
                var stdate = res[2];
                var edate = res[3];
                if(edate === null || edate === undefined || edate===''){
                    edate ='';
                }
                else{
                    edate = edate.substring(0,10)
                }
                stdate = stdate.substring(0,10)
                document.getElementById("state").value = res[0];
                document.getElementById("valid").value = res[1];
                document.getElementById("stdate").value = stdate;
                document.getElementById("eddate").value = edate; 
                if (res[4] === "" || res[4] === undefined || res[4] === null || res[4] === "null") {
                    document.getElementById("usedquota").value = "0 MB";
                }else{
                    document.getElementById("usedquota").value= res[4]+"MB"  
                }
                if (res[5] === "" || res[5] === undefined || res[5] === null || res[5] === "null") {
                    document.getElementById("quota").value = "0 MB";
                }else{
                    document.getElementById("quota").value= res[5]+"MB"  
                }       
            }
        }
    })
}
function removeexercise(id){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "removeexercise",
            id: id,
            cardname:$("#cardname2").val(),
        },
        cache: false,
        success: function(res){
           // res = JSON.parse(res)
           if(res === 'sessionexpired'){
            alert("Session Expired, Please login Again")
            window.location.replace("/1/login")
            }else{
            previewcard()
            usermsgfun(res)   
            }
        }
    })
}
function openworkoutcards(){
    getexercise()
    getcardname()
    document.getElementById("divattendance").style.display='none';
    document.getElementById("memberreports").style.display='none';
    document.getElementById("divmembermgmt").style.display='none';
    document.getElementById("PaymentReport").style.display='none';
    document.getElementById("BalanceReport").style.display='none';
    document.getElementById("openbmi").style.display='none'
    var ibox = document.getElementById("workoutcards");
    ibox.style.display = "block";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
}
function openbmi(){
    document.getElementById("workoutcards").style.display='none'
    document.getElementById("divattendance").style.display='none';
    document.getElementById("memberreports").style.display='none';
    document.getElementById("divmembermgmt").style.display='none';
    document.getElementById("PaymentReport").style.display='none';
    document.getElementById("BalanceReport").style.display='none';
    var ibox = document.getElementById("openbmi");
    ibox.style.display = "block";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
}
function savebmi(){
    if($("#membid2")==''){
        return alert("Please Enter Member ID")
    }
    if($("#memage")==''){
        return alert("Please Enter Age")
    }
    if($("#memheight")==''){
        return alert("Please Enter Height")
    }
    if($("#memweight")==''){
        return alert("Please Enter Weight")
    }
    
    if($("#memfat")==''){
        return alert("Please Enter Fat")
    }
    // document.getElementById("loader2").style.visibility = "visible";
    let mid22 =document.getElementById("membid2").value
    let mage2 = document.getElementById("memage").value
    let mheight2 = document.getElementById("memheight").value
    let mweight2 = document.getElementById("memweight").value
    let mfat2 = document.getElementById("memfat").value
    let mbmi2 = document.getElementById("membmi").value
    let mbmr = document.getElementById("membmr").value
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "savebmi",
            mid2: mid22,
            mage: mage2,
            mheight: mheight2,
            mweight: mweight2,
            mfat: mfat2,
            mbmi: mbmi2,
            mbmr: mbmr,
        },
        cache: false,
        success: function(res){
           // res = JSON.parse(res)
        //    document.getElementById("loader2").style.visibility = "hidden";
           if(res === 'sessionexpired'){
            alert("Session Expired, Please login Again")
            window.location.replace("/1/login")
        }else{
            usermsgfun(res);
           searchbmi();
        }                              
        }
    })
}
function clearbmiform(){
    document.getElementById("membid2").value = ''
    document.getElementById("memage").value = ''
    document.getElementById("memfat").value = ''
    document.getElementById("memweight").value = ''
    document.getElementById("memheight").value = ''
    document.getElementById("membmi").value = ''
    document.getElementById("membmr").value = ''
}
function searchbmi(){
    if($("#membid2").val().length === 4){
    // document.getElementById("loader3").style.visibility = "visible";
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "searchbmi",
                memberid: $("#membid2").val(),
            },
            cache: false,
            success: function(res){
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res != 'not found'){
                        out = "<table id='report'><tr><th>Date</th><th>Age</th><th>Fat</th><th>Weight</th><th>Height</th><th>BMI</th><th>BMR</th></tr>"
                        for(i = 0; i < res.length; i++){
                            let age = res[i].age;
                            let height = res[i].height;
                            let weight = res[i].weight;
                            let fat = res[i].fat;
                            let bmi = res[i].bmi;
                            let bmr = res[i].bmr;
                            let date = new Date(res[i].date);
                            if(date == '' || date == null || date==undefined){
                                date = ''
                            }else{
                                date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                            }
                            if(age === null || age === undefined){
                                age = '';
                            }
                            if(height === null || height === undefined){
                                height = '';
                            }
                            if(weight === null || weight === undefined){
                                weight = '';
                            }
                            if(fat === null || fat === undefined){
                                fat = '';
                            }
                            if(bmi === null || bmi === undefined){
                                bmi = '';
                            } 
                            if(bmr === null || bmr === undefined){
                                bmr = '';
                            }  
                            out = out + "<tr><td>"+date+"</td><td>" + age + "</td><td>" + fat+ "</td><td>" + weight + "</td><td>" + height + "</td><td>" + bmi + "</td><td>" + bmr + "</td></tr>"
                        }
                        out = out + "</table>"
                        document.getElementById("showbmi").innerHTML = out;
                        // document.getElementById("loader3").style.visibility = "hidden";
                    }else{
                        // document.getElementById("loader3").style.visibility = "hidden";
                    }
                }
            } 
        })
    }
    else{
        document.getElementById("showbmi").innerHTML = "";
    }
}
function usergymplan(){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "usergymplan",
        },
        cache: false,
        success: function(res){
           // res = JSON.parse(res)
           if(res === 'sessionexpired'){
            alert("Session Expired, Please login Again")
            window.location.replace("/1/login")
        }else{
            if(res != 'no'){
                var slsn = document.getElementById("memberplan")
                slsn.length = 0
                slsn[slsn.length] = new Option('Select')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    myOption.text = res[i].name
                    myOption.value = res[i].id;
                    slsn.add(myOption);
                }
            }
            else{
                usermsgfun("Please add gym plan")
            }
        }
        }
    })
}
async function screencapture() {
    const captureElement = document.querySelector('#showexercisess')
    const canvas = await html2canvas(document.querySelector("#newgymcard"));
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const a = document.createElement("a");
    a.setAttribute("download", `Gym Card.png`);
    a.setAttribute("href", image);
    a.click();
}
async function screencapture3(){
 //   const captureElement = document.querySelector('#showexercisess')
    const canvas = await html2canvas(document.querySelector("#workoutcardmem12"));
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const a = document.createElement("a");
    a.setAttribute("download", `Gym Card.png`);
    a.setAttribute("href", image);
    a.click();
}
function opencamera(){
    document.getElementById("menugymoption").style.display = 'none'
    var ibox = document.getElementById("divmembermgmt");
    ibox.style.display = "none";
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
    var ibox2 = document.getElementById("capture");
    ibox2.style.display = "block";
    
}
function openbalancereport(){
    document.getElementById("workoutcards").style.display='none'
    document.getElementById("divmembermgmt").style.display='none';
    document.getElementById("memberreports").style.display='none';
    document.getElementById("openbmi").style.display='none';
    document.getElementById("divattendance").style.display='none';
    document.getElementById("memberreports").style.display = "none";
    document.getElementById("PaymentReport").style.display='none';
    document.getElementById("BalanceReport").style.display='block';
    document.getElementById("gymbase").style.display='none';
    var today = new Date();
   document.getElementById("fromdate1").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
   document.getElementById("todate1").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}
function seebalencereport(){
    if($("#fromdate1").val()=='' || $("#todate1").val()==''){
        return alert("Please select dates")
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'seebalencereport',
            sdate: $("#fromdate1").val(),
            edate: $("#todate1").val(),
            onname: $("#namefilter3").val(),
            onnumber: $("#numberfilter3").val(),
         //   numberofrows: $("#numberrows2").val(),
        },
        cache: false,
        success: function savecaller(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("seebalencereport").innerHTML=res
            }
        }
    })
}
function openpaymetreport(){
    document.getElementById("workoutcards").style.display='none'
    document.getElementById("divmembermgmt").style.display='none';
    document.getElementById("memberreports").style.display='none';
    document.getElementById("openbmi").style.display='none';
    document.getElementById("divattendance").style.display='none';
    document.getElementById("memberreports").style.display = "none";
    document.getElementById("PaymentReport").style.display='block';
    document.getElementById("gymbase").style.display='none';
    document.getElementById("BalanceReport").style.display='none';
    var today = new Date();
   document.getElementById("fromdate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
   document.getElementById("todate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}
function openmemberreport(){
    document.getElementById("workoutcards").style.display='none'
    document.getElementById("divattendance").style.display='none';
    document.getElementById("divmembermgmt").style.display='none';
    document.getElementById("PaymentReport").style.display='none';
    document.getElementById("openbmi").style.display='none';
    document.getElementById("BalanceReport").style.display='none';
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
    var ibox2 = document.getElementById("memberreports");
    ibox2.style.display = "block";
    var today = new Date();
   document.getElementById("startdate2").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
   document.getElementById("enddate2").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}
function popmemberreport2(mobile){
    document.getElementById("workoutcards").style.display='none'
    document.getElementById("divattendance").style.display='none';
    document.getElementById("divmembermgmt").style.display='block';
    document.getElementById("PaymentReport").style.display='none';
    document.getElementById("openbmi").style.display='none';
    document.getElementById("BalanceReport").style.display='none';
    document.getElementById("membermobilesearch").value = mobile
    searchmember()
    var tdiv1 = document.getElementById("gymbase");
    tdiv1.style.display = 'none'
    var ibox2 = document.getElementById("memberreports");
    ibox2.style.display = "none";
}
function sendesssage(phoneno){
    if(phoneno.length===10){
        let rtext = "https://wa.me/91" + phoneno
        window.open(rtext, 'xyz');
    }
    else{
        usermsgfun("Please check your number")
    }
}
function sendesssage2(phoneno){
    
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'receipt',
            pid: phoneno,
        },
        //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function receipt(res) {
            //alert(res)
            //document.getElementById("whatsaspptext").innerHTML = res;
            window.open(res, 'xyz');
        }
    })
}
function seepaymentreport(){
    if($("#fromdate").val()=='' || $("#todate").val()==''){
        return alert("Please select dates")
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'seepaymentreport',
            sdate: $("#fromdate").val(),
            edate: $("#todate").val(),
            onname: $("#namefilter2").val(),
            onnumber: $("#numberfilter2").val(),
           // numberofrows: $("#numberrows2").val(),
        },
        cache: false,
        success: function savecaller(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("seepaymentreport").innerHTML=res
            }
        }
    })
  
}
function maxrecords(){
    var startdate = $("#startdate2").val()
    var enddate =  $("#enddate2").val()
    var onname= $('#namefilter').val()
    var onnumber= $('#numberfilter').val()
    var reporttype=$('#reporttype').val()
  //  var reporttype = $("#selreporta").val()
    var numberofrows= $("#numberofrows").val()
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
                action: 'maxrecords',
                startdate: startdate,
                enddate: enddate,
                onname: onname,
                onnumber: onnumber,
                numberofrows: numberofrows,
                reporttype: reporttype,
            },
        cache: false,
        success: function savecaller(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res != "No Data"){   
                    let noofrecords = res.slice(1);
                //alert(noofrecords);
                    let noofrows=document.getElementById("numberrows").value;
                    //alert(noofrows);
                    let pages = Math.floor(noofrecords/parseInt(noofrows))
                    //alert(pages);
                    if(noofrecords%noofrows > 0) {
                        pages+=1;
                    }
                    //alert(pages);
                    list = ""
                    for(i=1;i<=pages;i++) {
                        list = list + "<a onclick='mamberreport("+i+")'>"+i+"</a> "
                    }
                    document.getElementById("numberofpages").innerHTML = list;
                    let rs = noofrecords/parseInt(numberofrows);
                    let rsl = parseInt(rs)
                    let str="r";
                    str=str.slice(1);
                    mamberreport(rsl);
                    //pagination(rsl);
                }else{
                    document.getElementById("seereportmember").innerHTML = res
                }
            }
        }
    })
}
function mamberreport(pagenumber){
    var startdate = $("#startdate2").val()
    var enddate =  $("#enddate2").val()
    var reporttype=$('#reporttype').val()

    var onname= $('#namefilter').val()
    var onnumber= $('#numberfilter').val()
  //  var reporttype = $("#selreporta").val()
    var numberofrows= $("#numberrows").val()
    var pageno = pagenumber;
    //console.log(pageno);
    if(pageno === null || pageno === undefined || pageno === ''){
        pageno = 0
        //console.log(pageno)
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'mamberreport',
            onname: onname,
            onnumber: onnumber,
            numberofrows: numberofrows,
            pagenumber: pageno,
            startdate: startdate,
            enddate: enddate,
            reporttype:reporttype,
        },
            //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function savecaller(res) {  
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{ 
                document.getElementById("seereportmember").innerHTML = res
            }
        }
    }) 
}

function startcamera(){
    let video = document.querySelector("#webcam");
    let canvas = document.querySelector("#canvas");
    let context = canvas.getContext("2d")
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video: true}).then((stream) =>{
            video.srcObject = stream;
            video.play()
        });
    }
    /*
    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach("#webcam");
    */
}
function capture(){
    let video = document.querySelector("#webcam");
    let canvas = document.querySelector("#canvas");
    let context = canvas.getContext("2d")
    context.drawImage(video, 0,0,400,300);
}



function saveimage(){
    document.getElementById("imagepreview").innerHTML = ""
    let video = document.querySelector("#webcam");
    let canvas = document.querySelector("#canvas");
    let context = canvas.getContext("2d")
    let id = $("#memberid34").val()
    let memberid = $("#memberid2").val()
    const datsURI = canvas.toDataURL("image/png") 
    if(memberid === '' || memberid===null || memberid==undefined){
       return alert("Please Search Member First")
    }
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "saveimage",
            mimage: datsURI,
            memberid: id,
        },
        cache: false,
        success: function(res){
          //  res = JSON.parse(res)
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("imagepreview").innerHTML=
                usermsgfun(res)
            }
        }
    })
}
function closecamera(){
    document.getElementById("menugymoption").style.display = 'blocks'
    let canvas = document.querySelector("#canvas");
    let video = document.querySelector("#webcam")
    let mmid = $("#memberid34").val()
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    var ibox = document.getElementById("capture");
    ibox.style.display = "none";
    var ibox2 = document.getElementById("divmembermgmt")
    ibox2.style.display = "block";
    document.getElementById("imagepreview").innerHTML = "<img class='profileimg' width='300' height='300' src='/getprofilepicgym/"+mmid+".png?t=" + new Date().getTime()+"'>'>"
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) =>{
        video.srcObject = stream;
        stream.getTracks().forEach(function(track) {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
    });
}
// functioin to search user
function clearscrean(){
    var result = new Date();
    document.getElementById("membernamesearch").value = ""
    document.getElementById("membermobilesearch").value = ""
    document.getElementById("membername").value = ""
    document.getElementById("membermobile").value = ""
    document.getElementById("memberemail").value = ""
    document.getElementById("memberaddress1").value = ""
    document.getElementById("memberaddress2").value = ""
    document.getElementById("membercity").value = ""
    document.getElementById("memberpincode").value = ""
    document.getElementById("memberid2").value = ""
    document.getElementById("duration").value = ""
    document.getElementById("startdate").value = result.getFullYear() + '-' + ('0' + (result.getMonth() + 1)).slice(-2) + '-' + ('0' + result.getDate()).slice(-2);
    document.getElementById("enddate").value = ""
    document.getElementById("fee").value = ""
    document.getElementById("discount").value = ""
    document.getElementById("amount2").value = ""
    document.getElementById('enddate').value = ""
    document.getElementById("pdate").value = result.getFullYear() + '-' + ('0' + (result.getMonth() + 1)).slice(-2) + '-' + ('0' + result.getDate()).slice(-2);
    document.getElementById("paid").value = ""
    document.getElementById("balance").value = ""
    document.getElementById("memberid34").value = ""
    document.getElementById("balancedate").value = ""
    document.getElementById("anniversarydt").value = ""
    document.getElementById("birthdate").value = ""
    document.getElementById("membername2").value = ""
    document.getElementById("remamount").value = ""
    document.getElementById("imagepreview").innerHTML = ""
    document.getElementById("myusedplans").innerHTML = ""
    document.getElementById("previouspayments").innerHTML = ""
}
function searchmember(){
    document.getElementById("showimgaftersearch").style.display='block';
    if($('#membernamesearch').val()==='' && $('#membermobilesearch').val()==='' && $('#memberIDsearch').val()===''){
        return alert("Enter please ID, Mobile and Name to search")    
    }
    // document.getElementById("loader3").style.visibility = "visible";
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "searchmember",
            membername: $('#membernamesearch').val(),
            membermobile: $('#membermobilesearch').val(),
            memberid2: $('#memberIDsearch').val(),
        },
        cache: false,
        success: function(res){
            //res = JSON.parse(res)
            // document.getElementById("loader3").style.visibility = "hidden"; 
            clearscrean();
            document.getElementById("imagepreview").innerHTML=''
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                  
                if(res !='User Not Found'){

                    let name = res[1]
                    if(name === null || name === undefined){
                        name = ''
                    }
                    let membermobile = res[2]
                    if(membermobile === null || membermobile === undefined){
                        membermobile = ''
                    }
                    let memberaddress2 = res[4]
                    if(memberaddress2 === null || memberaddress2 === undefined){
                        memberaddress2 = ''
                    }
                    let memberaddress1 = res[3]
                    if(memberaddress1 === null || memberaddress1 === undefined){
                        memberaddress1 = ''
                    }
                    let memberemail = res[7]
                    if(memberemail === null || memberemail === undefined){
                        memberemail = ''
                    }
                    let membercity = res[5]
                    if(membercity === null || membercity === undefined){
                        membercity = ''
                    }
                    let memberpincode = res[6]
                    if(memberpincode === null || memberpincode === undefined){
                        memberpincode = ''
                    }
                    let memberid2 = res[8]

                    if(memberid2 === null || memberid2 === undefined){
                        memberid2 = ''
                    }else if(memberid2.length === 4){
                        usermsgfun("Please MemberId should be 4 digits")
                    }
                    let annidate = new Date(res[9])
                    if(res[9]==null || res[9]==undefined || res[9] == ''){
                            annidate = ''
                    }else{
                        annidate = annidate.getFullYear() + '-' + ('0' + (annidate.getMonth() + 1)).slice(-2) + '-' + ('0' + annidate.getDate()).slice(-2)
                    }

                    let bdate = new Date(res[10])
                    if(res[10] == null || res[10] == undefined || res[10] == ''){
                        bdate == ''
                    }else{
                        bdate = bdate.getFullYear() + '-' + ('0' + (bdate.getMonth() + 1)).slice(-2) + '-' + ('0' + bdate.getDate()).slice(-2)
                    }
                    let balance = res[20]
                    if(balance === null || balance === undefined){
                        balance = ''
                    }
                    let amount2 = res[18]

                    if(amount2 === null || amount2 === undefined){
                        amount2 = ''
                    }
                    let discount = res[19]
                    if(discount === null || discount === undefined){
                        discount = ''
                    }
                    let fee = res[17]
                    if(fee === null || fee === undefined){
                        fee = ''
                    }
                    let duration = res[12]
                    if(duration === null || duration === undefined){
                        duration = ''
                    }
                    
                    let sdate = new Date(res[15]);
                    sdate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2)
                    if(sdate === null || sdate === undefined){   
                        sdate = ''
                    }
                    let edate = new Date(res[16]);
                    edate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2)
                    if(edate === null || edate === undefined){
                        edate = ''
                    }
                    let planname = res[11];
                    if(planname === null || planname === undefined ){
                        planname = ''
                    }else{
                        const $select = document.querySelector('#memberplan');
                        $select.value = res[12]
        
                    }
                    document.getElementById("birthdate").value = bdate
                    document.getElementById("anniversarydt").value = annidate
                    document.getElementById("memberid34").value = res[0]
                    document.getElementById("membername2").value = res[1]
                    document.getElementById("membermobile").value = membermobile
                    document.getElementById("memberemail").value = memberemail
                    document.getElementById("memberaddress1").value = memberaddress1
                    document.getElementById("memberaddress2").value = memberaddress2
                    document.getElementById("membercity").value = membercity
                    document.getElementById("memberpincode").value = memberpincode
                    document.getElementById("memberid2").value = memberid2
                    document.getElementById("duration").value = duration 
                    document.getElementById("fee").value = fee
                    document.getElementById("discount").value = discount
                    document.getElementById("amount2").value = amount2
                    document.getElementById("balance").value = balance
                    if(res[14] === '' || res[14] === null || res[14] === undefined){
                    //    console.log("none") 
                    }else{
                        out = "<table id='report'><tr><th>Plan Name</th><th>Duration</th><th>Start Date</th><th>End Date</th><th>Fees</th><th>Discount</th><th>Total Fees</th><th>Status</th></tr>"
                        out = out + "<tr><td>" + planname + "</td><td>" + duration+ "</td><td>" + sdate + "</td><td>" + edate + "</td><td>" + fee + "</td><td>" + discount + "</td><td>" + amount2 + "</td><td>Active</td><td><button onclick=renewplan('"+res[14]+"','"+duration+"')>Renew Plan</button></td></tr>"
                        document.getElementById("myusedplans").innerHTML = out;
                        $('#balance').val(amount2);
                    }  
                    // alert(res[0])
                    // alert(res + " res")
                    document.getElementById("imagepreview").innerHTML = "<img class='profileimg' width='300' height='300' src='/getprofilepicgym/"+res[0]+".png'>"            
                }else{
                    usermsgfun(res)
                }
            }    
        }
    })
}

function removeadmin(id){
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "removeadmin",
            gymadmin: id,
        },
        cache: false,
        success: function(res){
        //  res = JSON.parse(res)
        if(res === 'sessionexpired'){
            alert("Session Expired, Please login Again")
            window.location.replace("/1/login")
        }else{
            showadmins();
            usermsgfun(res)
        }
        }
    });
}

function renewplan(id,dur){
    // alert(dur +" - dur")
    if($('#membermobile').val()!='' || $('#membermobile').val().length != 0){
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "renewplan",
                membermobile: $('#membermobile').val(),
                planid: id,
                duration: dur,
            },
            cache: false,
            success: function(res){
            //  res = JSON.parse(res)
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                showmyplans();
                usermsgfun(res)
            }
            }
        });
    }
}

function showmyplans(){
    if($('#membermobile').val()!='' || $('#membermobile').val().length != 0){
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "showmyplans",
                membermobile: $('#membermobile').val(),
            },
            cache: false,
            success: function(res){
            //  res = JSON.parse(res)
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res != "No Data"){
                    out = "<table id='report'><tr><th>Plan Name</th><th>Duration</th><th>Start Date</th><th>End Date</th><th>Fees</th><th>Discount</th><th>Total Fees</th><th>Status</th></tr>"
                    for(i = 0; i < res.length; i++){
                        let amount2 = res[i].amount;
                        if(amount2 === null || amount2 === undefined){
                            amount2 = ''
                        }   
                        let discount = res[i].discount;
                        if(discount === null || discount === undefined){
                            discount = ''
                        }
                        let fee = res[i].fee
                        if(fee === null || fee === undefined){
                            fee = ''
                        }
                        let duration = res[i].duration;
                        if(duration === null || duration === undefined){
                            duration = ''
                        }
                        let status = res[i].status;
                        if(status === null || status === undefined){
                            status = ''
                        }
                        let sdate = new Date(res[i].startdate)
                        sdate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2);
                        if(sdate === null || sdate === undefined){   
                            sdate = ''
                        }
                        let edate = new Date(res[i].enddate)
                        edate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2);
                        if(edate === null || edate === undefined){
                            edate = ''
                        }
                        let planname = res[i].planname
                        if(planname != null || planname != undefined ){
                            const $select = document.querySelector('#memberplan');
                            $select.value = planname
                        }else{
                            planname = ''
                        }
                        out = out + "<tr><td>" + planname + "</td><td>" + duration+ "</td><td>" + sdate + "</td><td>" + edate + "</td><td>" + fee + "</td><td>" + discount + "</td><td>" + amount2 + "</td><td>"+status+"</td><td><button onclick=renewplan('"+res[i].planid+"','" +duration+"')>Renew Plan</button></td></tr>"
                        $('#balance').val(amount2);
                    }
                    // $('#balance').val(amount2);
                    out = out + "</table>"
                    document.getElementById("myusedplans").innerHTML = out;
                    
                }else{
                    usermsgfun(res)
                    }
            }
            }
        })
    }
    else{
        usermsgfun("Please check the number")
    }
}

// function to register new Member
function newmember(){
    if($('#membernamesearch').val() === ''){
        return alert("Please Enter Name First")
    }else if($('#membermobilesearch').val()==='' && $('#membermobilesearch').val().length != 10 ){
        return alert("Please Enter Contact Number First")
    }
    // document.getElementById("loader3").style.visibility = "visible";
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "newmember",
            membername: $('#membernamesearch').val(),
            membermobile: $('#membermobilesearch').val(),
        },
        cache: false,
        success: function(res){
            // alert(res + " ,.,..")
          //  res = JSON.parse(res)
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res === "Metch"){
                    usermsgfun("Memeber exist please try search option")
                }
                else {
                    var maxid = res.maxid[0]; // Accessing the first element of the maxid array
                usermsgfun("New Member created " + maxid);
                    
                // Update HTML elements with maxid
                document.getElementById("memberid2").value = maxid;
                    document.getElementById("memberid").value = "";
                    document.getElementById("membername2").value = $('#membernamesearch').val();
                    document.getElementById("membermobile").value = $('#membermobilesearch').val();
                    document.getElementById("memberaddress1").value = ""
                    document.getElementById("memberaddress2").value = ""
                    document.getElementById("membercity").value = ""
                    document.getElementById("memberpincode").value = ""
                    // document.getElementById("loader3").style.visibility = "hidden";
                }
            }
        }
    })
}
function paymenthistory(){
    if($("#membermobile").val()!= '' || $("#membermobile").val().length === 10){
        // document.getElementById("loader3").style.visibility = "visible";
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "paymenthistory",
                mobileno: $("#membermobile").val(),
            },
            cache: false,
            success: function(res){
                // document.getElementById("loader3").style.visibility = "hidden";
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    document.getElementById("previouspayments").innerHTML = res
                }
            }
        })
    }else{
        // document.getElementById("loader3").style.visibility = "visible";
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "paymenthistory2",
//mobileno: $("#membermobilesearch").val(),
            },
            cache: false,
            success: function(res){
                // document.getElementById("loader3").style.visibility = "hidden";
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    document.getElementById("previouspayments").innerHTML = res
                }
            }
        })
    }
}
function deletepayment(pdate){
    // document.getElementById("loader2").style.visibility = "visible";
    let pdate2 = pdate;
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "deletepayment",
            paymentid: pdate2,
            mobileno: $("#membermobilesearch").val(),
        },
        cache: false,
        success: function(res){
            paymenthistory();
            // document.getElementById("loader2").style.visibility = "hidden";
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                usermsgfun(res)
            }        
        }
    })
}
function savepayments(){
    if($('#remamount').val()=='' || $('#remamount').val()==='0' ||$('#remamount').val()==0 || $('#remamount').val()==null){
    }else{
        if($('#balancedate').val()==='' || $('#balancedate').val()===null || $('#balancedate').val()==undefined){
            return alert("please select Due Date")
        }
    }
    if($("#membermobile").val()!= '' || $("#membermobile").val().length === 10){
        // document.getElementById("loader2").style.visibility = "visible";
        $.ajax({
            url: "/1/gymmanagement",
            type: "POST",
            data: {
                action: "savepayments",
                pdate: $('#pdate').val(),
                paid: $('#paid').val(),
                balance: $('#remamount').val(),
                balancedate: $('#balancedate').val(),
                mobileno: $("#membermobile").val(),
            },
            cache: false,
            success: function(res){
                // document.getElementById("loader2").style.visibility = "hidden";
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    usermsgfun(res)
                }
            }
        })
    }
}
function savemember(){
    if($('#membername2').val()==='' || $('#membermobile').val()===''){
        return alert("Please enter name and mobile no")
    }
    else if($('#memberid2').val().length != 4 ){
        return alert("Please make sure that memberid is 4 digit")
    }
    var aniivesarydate=$("#anniversarydt").val();
    // alert(aniivesarydate + " - aniivesarydate")
        // document.getElementById("loader2").style.visibility = "visible";
    $.ajax({
        url: "/1/gymmanagement",
        type: "POST",
        data: {
            action: "savemember",
            membername: $('#membername2').val(),
            memberaddress1: $('#memberaddress1').val(),
            memberaddress2: $('#memberaddress2').val(),
            memberemail: $('#memberemail').val(),
            membermobile: $('#membermobile').val(),
            memberpincode: $('#memberpincode').val(),
            membercity: $('#membercity').val(),
            memberid2: $('#memberid2').val(),
            bdate: $("#birthdate").val(),
            aniivesarydate:$("#anniversarydt").val(),
        },
        cache: false,
        success: function(res){
            // document.getElementById("loader2").style.visibility = "hidden";
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                usermsgfun(res)
            }
        }
    })   
}
//uploadpic
function uploadselfie(){
    
    if($("#memberid2").val()==''|| $("#memberid2").val()== null||$("#memberid2").val()==undefined){
        return alert("MemberID Not Found")
    }
    if($("#memberid34").val()==''|| $("#memberid34").val()== null||$("#memberid34").val()==undefined){
        return alert("First Search MemberID ")
    }
    let fileInput = document.getElementById("uploadselfie"); 
    var fileName = fileInput.value;
    const fileSize = fileInput.files[0].size / 1024 / 1024;
    if(!fileInput.files[0]){
        return alert("Please select file first")
    }
    const fileExtension = fileName.split(".").pop();
    if(fileExtension !== 'png'){
        return alert("Only 'png' formate is accepted");
    }
    else if(fileSize > 2){
        return alert("File size excessed size limit of 2 MB")
    }
    var ans = confirm("File data is added on database after that you can't delete it")
    if(ans == true) {
        let memebae=document.getElementById("memberid34").value
    //   alert(memebae)
        let assignmentdoc = fileInput.files[0];
        let formData = new FormData();       
        formData.append("png", assignmentdoc)
        fetch('/uploadprofilepic', {method: "POST", body: formData});
        alert("File uploaded successfully!!!")
        document.getElementById("imagepreview").innerHTML="<img class='profileimg' width='300' height='300' src='/getprofilepicgym/"+memebae+".png?t=" + new Date().getTime()+"'>"
       
    }
}
function uploadselfie1() {
    if($("#memberid2").val()==''|| $("#memberid2").val()== null||$("#memberid2").val()==undefined){
        return alert("MemberID Not Found")
    }

    var memberid2=$('#memberid34').val();
    if($("#memberid2").val()==''|| $("#memberid2").val()== null||$("#memberid2").val()==undefined){
        return alert("First Search Member Id")
    }
    //  alert(memberid2 +" - memberid2")
    var uploadrec = document.getElementById("uploadselfie");
    if (!uploadrec.files[0]) {
        return alert("Please select file first");
    }
    var size = uploadrec.files[0].size / 1024 / 1024;
    var fileext = uploadrec.value.split(".").pop();
    // alert(size + "23")
    if (fileext != 'png' && fileext != 'jpg' && fileext != 'jpeg' && fileext != 'pdf' && fileext != 'mp3' && fileext != 'mp4') {
        return alert("please select 'png' , 'jpg' , 'jpeg' , 'pdf' extention")
    } else if (size > 1) {
        return alert("please select file less than 1 mb");
    }
    // var conf = confirm("Do You Want TO Upload This File!!!! ");

    // if (conf === true) {
        var filestore = uploadrec.files[0];
        var formdata = new FormData();
        formdata.append('image', filestore);
        formdata.append('action', 'savefile');

        fetch('/1/fileoperations', { method: "POST", body: formdata }).then(response => response.text()).then(data => {
            $.ajax({
                url: "/1/gymmanagement",
                type: 'POST',
                data: {
                    action: 'uploadpic',
                    memberid2: memberid2,
                    size:size,
                    // filename: uploadrec.value.split('\\').pop().split('/').pop()
                },
                cache: false,
                success: function savecaller(res) {
                    if (res == 'error') {
                        // usermsgfun("Error while uploading image try again later")
                    } else {
                        if(res==='You have reached the maximum limit of file upload'){
                        alert(res);
                        }
                        else{
                            // getprofilepic();
                            // alert(res)
                        uploadselfie();
                        }

                    }
                }
            })
        })
    // }
}
//retriv pic 
function getprofilepic(){
    var memberid2=$('#memberid34').val();
    alert(memberid2 +" - memberid212-----")
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'getprofilepic',
            memberid2:memberid2 
        },
        cache: false,
        success: function user(res) {
            alert(res)
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res == 'error' || res =='No Image'){
                }else{
                    // document.getElementById("imagepreview1").innerHTML = "<img class='profileimg' width='300' height='300' src='" + res + "'>";

                    // document.getElementById("imagepreview1").innerHTML = "<img class='profileimg' width='300' height='300' src='" + res + "'>";
        
                    // document.getElementById("profileimg").innerHTML="<img width='300' height='300' src='/getprofilepicgym/"+res+"'>"

                    document.getElementById("imagepreview").innerHTML = "<img src='/getprofilepicgym/" + res + "' style='margin-left:2%; height:100px;'>";            
                }
            
                }
            }
    })
}

// function uploadlogo(){
//     var uploadimg = document.getElementById("uploadgymlogo1");
//     var filename;
//     alert(filename + " filename")
//     var uploaddata=uploadimg.value;
//     if(!uploadimg.files[0]){
//         return alert("Please select file first");
//     }
//     var size = uploadimg.files[0].size / 1024 /1024;  
   
//     var fileext = uploaddata.split(".").pop();
//     if(fileext !== 'jpg' && fileext !== 'png' && fileext !== 'jpeg' ){
//         return alert("please select 'jpg' image extention")
//     }
//     if(size > 1){
//         return alert("please select file less than 1 mb");
//     }
//         var filestore = uploadimg.files[0];
//         var formdata = new FormData();
//         formdata.append('image',filestore);
//         formdata.append('action','savefile');
//         fetch('/1/fileoperations',{method: "POST", body: formdata}).then(response=>response.text()).then(data=>{
//             $.ajax({
//                 url: "/1/gymmanagement",
//                 type: 'POST',
//                 data: {
//                     action: 'uploadgymlogo',
//                     uploaddata:uploaddata
//                 },
//                 cache: false,
//                 success: function savecaller(res) {
//                     if(res === 'sessionexpired'){
//                         alert("Session Expired, Please login Again")
//                         window.location.replace("/1/login")
//                     }else{
//                         if(res =='error'){
//                             usermsgfun("Error while uploading image try again later")
//                         }else{
//                             getgymlogo();
//                             usermsgfun("Logo uploded Successfully")
//                         } 
//                     }
//                     }
//             })
//         })
// }
// function getgymlogo(){
//     $.ajax({
//         url: "/1/gymmanagement",
//         type: 'POST',
//         data: {
//             action: 'getgymlogo' 
//         },
//         cache: false,
//         success: function user(res) {
//             if(res === 'sessionexpired'){
//                 alert("Session Expired, Please login Again")
//                 window.location.replace("/1/login")
//             }else{
//                 if(res == 'error' || res =='No Image'){
//                 }else{
//                     document.getElementById("gymlogo").innerHTML="<img src='/getgymlogo/"+res+"' style='margin-left:2%; height:100px;'>"
//                 }
//             }
//         }
//     })
// }


function uploadgymlogo(){
    let fileInput = document.getElementById("uploadgymlogo"); 
    var fileName = fileInput.value;
    const fileSize = fileInput.files[0].size / 1024 / 1024;
    if(!fileInput.files[0]){
        return alert("Please select file first")
    }
    const fileExtension = fileName.split(".").pop();
    if(fileExtension !== 'png'){
        return alert("Only 'png' formate is accepted");
    }
    else if(fileSize > 2){
        return alert("File size excessed size limit of 2 MB")
    }
    var ans = confirm("File data is added on database after that you can't delete it")
    if(ans == true) {
        let assignmentdoc = fileInput.files[0];
        let formData = new FormData();       
        formData.append("png", assignmentdoc)
        fetch('/uploadgymlogo', {method: "POST", body: formData});
        usermsgfun("File uploaded successfully!!!")
        //document.getElementById("imagepreview").innerHTML = "<img class='profileimg' style='width:200px !important; height:200px !important;' src='/getprofilepicgym/"+res[0]+".png'>"
    }
}
function uploadpayment(){
    let fileInput = document.getElementById("upaymentdetails"); 
    var fileName = fileInput.value;
    const fileSize = fileInput.files[0].size / 1024 / 1024;
    if(!fileInput.files[0]){
        return alert("Please select file first")
    }
    const fileExtension = fileName.split(".").pop();
    if(fileExtension !== 'csv'){
        return alert("Only 'csv' formate is accepted");
    }
    else if(fileSize > 2){
        return alert("File size excessed size limit of 2 MB")
    }
    var ans = confirm("File data is added on database after that you can't delete it")
    if(ans == true) {
        let assignmentdoc = fileInput.files[0];
        let formData = new FormData();       
        formData.append("csv", assignmentdoc)
        fetch('/uploadmemberdetails', {method: "POST", body: formData});
        alert("File uploaded successfully!!!")
       //document.getElementById("iden1").innerHTML = "Please Wait";
       insertmemberdetails2()
    }     
}

function insertmemberdetails2(){
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'insertmemberdetails2',
        },
            //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function savecaller(res) {  
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                usermsgfun(res)
            }
        }
    })
 }
 function removeexercises(execiesseid,cardid,day){
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'removeexercises',
            execiesseid:execiesseid,
            cardid:cardid,
            day:day,
        },
            //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function savecaller(res) {  
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                usermsgfun(res)
                previewcard()
            }
        }
    })
 }
function uploadmemeberplans(){
    let fileInput = document.getElementById("mplansupload"); 
    var fileName = fileInput.value;
    const fileSize = fileInput.files[0].size / 1024 / 1024;
    if(!fileInput.files[0]){
        return alert("Please select file first")
    }
    const fileExtension = fileName.split(".").pop();
    if(fileExtension !== 'csv'){
        return alert("Only 'csv' formate is accepted");
    }
    else if(fileSize > 2){
        return alert("File size excessed size limit of 2 MB")
    }
    var ans = confirm("File data is added on database after that you can't delete it")
    if(ans == true) {
        let assignmentdoc = fileInput.files[0];
        let formData = new FormData();       
        formData.append("csv", assignmentdoc)
        fetch('/uploadmemberdetails', {method: "POST", body: formData});
        usermsgfun("File uploaded successfully!!!")
       //document.getElementById("iden1").innerHTML = "Please Wait";
       insertmemberdetails3()
    }
}
function insertmemberdetails3(){
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'insertmemberdetails3',
        },
            //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function savecaller(res) { 
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{ 
                usermsgfun(res)
            }
        }
    })
}
function memberdetailsupload() {
    let fileInput = document.getElementById("memberdetails"); 
    var fileName = fileInput.value;
    const fileSize = fileInput.files[0].size / 1024 / 1024;
    if(!fileInput.files[0]){
        return alert("Please select file first")
    }
    const fileExtension = fileName.split(".").pop();
    if(fileExtension !== 'csv'){
        return alert("Only 'csv' formate is accepted");
    }
    else if(fileSize > 2){
        return alert("File size excessed size limit of 2 MB")
    }
    var ans = confirm("File data is added on database after that you can't delete it")
    if(ans == true) {
        let assignmentdoc = fileInput.files[0];
        let formData = new FormData();       
        formData.append("csv", assignmentdoc)
        fetch('/uploadmemberdetails', {method: "POST", body: formData});
        usermsgfun("File uploaded successfully!!!")
       //document.getElementById("iden1").innerHTML = "Please Wait";
       insertmemberdetails()
    }    
  }
function insertmemberdetails(){
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'insertmemberdetails',
        },
            //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function savecaller(res) {  
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                usermsgfun(res)
            }
        }
    })
}
function getnames(){
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'getnames',
        },
            //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function savecaller(res) {  
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if(res != "No Data"){
                    autocomplete(document.getElementById('membernamesearch'), res)
                }
            }
        }
    })
}
function autocomplete(inp, arr) {
    var currentFocus;
      inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
          //  b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += "<b>"+arr[i]+"</b>";
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) { //up
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }

function calculatetotal(){
    let fees = $("#fee").val();
    let totalfees = fees - $("#discount").val();
    document.getElementById("amount2").value = totalfees;
}
function cal2(){
    let fees = $("#balance").val();
    let totalfees = fees - $("#paid").val();
    document.getElementById("remamount").value = totalfees;
}
function enddate(){
    let sdate = document.getElementById("startdate").value;
    let days = parseInt(document.getElementById("duration").value)
    const date = new Date(sdate);
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    document.getElementById('enddate').value = result.getFullYear() + '-' + ('0' + (result.getMonth() + 1)).slice(-2) + '-' + ('0' + result.getDate()).slice(-2);
}
const updateButton = document.getElementById('seeworkoutcard');
const favDialog = document.getElementById('favDialog');
if ( typeof favDialog.showModal !== 'function' ) {
    favDialog.hidden = true;    
}
updateButton.addEventListener('click', function onOpen() {
    if (typeof favDialog.showModal === "function") {
      favDialog.showModal();
      if($('#mebid').val()==''){
        alert("Please Enter Valid ID")
        }else{
            $.ajax({
                url: "/1/gymmanagement",
                type: "POST",
                data: {
                    action: "getmobile",
                    memberid: $('#mebid').val(),
                },
                cache: false,
                success: function(res){
                    if(res === 'sessionexpired'){
                        alert("Session Expired, Please login Again")
                        window.location.replace("/1/login")
                    }else{
                        if(res == 'no data'){
                            usermsgfun("Card Not Found")
                        }else{        
                            document.getElementById("showorkoutcard2").innerHTML="<img src='/getworkoutcard/"+res[0]+"' style='width:550px;'>"
                        }
                    }
                }
            })
        }
    } else {
      outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
    }
  });

  function closeback(){
    const favDialog = document.getElementById('favDialog');
    favDialog.close()
  }
setInterval(() => {
    $("#gadv").load("/1/getad");
}, 60000);
//document.addEventListener('contextmenu', event => event.preventDefault())

//csscolor
function retrivebgstylecolor(){
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'retrivebgstylecolorgym',
        },
        cache: false,
        success: function savecaller(res) {
        //    alert(res)
            var slsn1 = document.getElementById("csscolor")
            if(slsn1!=null){
                slsn1.length = 0
                slsn1[slsn1.length] = new Option('Color Name')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    try{
                        var x=JSON.parse(res[i]);
                        myOption.text = x.name;
                        myOption.value = x.filename;
                        slsn1.add(myOption);
                    }catch(err)
                    {   
                    }
                }
            }      
        }
    })
} 
function orgcolorgym(){
    $.ajax({
        url: "/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'orgcolorgym',
            csscolor:  $("#csscolor").val(),
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
            usermsgfun("updated successfully");
            window.location.replace("/1/menu");
            }
        }

    })

}
//close option
function accountstatusclose(){
    document.getElementById("gymaccount").style.display='none';
    document.getElementById("gymbase").style.display='block';
}
function uploadfileclose(){
    document.getElementById("uploadwindow").style.display='none';
    document.getElementById("gymbase").style.display='block';
}
function planclose(){
    document.getElementById("divplanmgmt").style.display='none';
    document.getElementById("gymbase").style.display='block';
}
function closebmipage(){
    document.getElementById("openbmi").style.display='none';
    document.getElementById("divmembermgmt").style.display='block';
}
function closeattendancepage(){
    document.getElementById("divattendance").style.display='none';
    document.getElementById("divmembermgmt").style.display='block';
}
function workoutcadeclose(){
    document.getElementById("workoutcards").style.display='none';
    document.getElementById("divmembermgmt").style.display='block';
}
function closememberpage(){
    document.getElementById("divmembermgmt").style.display='none';
    document.getElementById("menugymoption").style.display='none';
    document.getElementById("gymbase").style.display='block';
}
function closememberinfopage(){
    document.getElementById("membermenu").style.display='none';
    document.getElementById("gymbase").style.display='block';
}
function divdashboardclose(){
    document.getElementById("gymbase").style.display='block';
    document.getElementById("divdashboard").style.display='none';
}
function closefullreportpage(){
     document.getElementById("divdashboard").style.display='block';
    document.getElementById("showfullreport").style.display='none';
}
//dashboard
function showdashboard(){
    showdashboardactdact();
    showdashboardattendance();
    document.getElementById("divdashboard").style.display='block';
    document.getElementById("gymbase").style.display='none';
}
function showdashboardactdact(){
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'showdashboardactdact',
        },
        cache: false,
        success: function savecaller(res) {
        document.getElementById("showdashboardactdact").innerHTML=res;     
        }
    })
}
function showdashboardattendance(){
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'showdashboardattendance',
        },
        cache: false,
        success: function savecaller(res) {
        document.getElementById("showdashboardattendance").innerHTML=res;     
        }
    })
}
//full report
function showtotalmember(){
    document.getElementById("divdashboard").style.display='none';
    document.getElementById("showfullreport").style.display="block";
    alert("hello")
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'showtotalmember',
        },
        cache: false,
        success: function savecaller(res) {
            alert(res)
        document.getElementById("showtotalmemberinfo").innerHTML=res;     
        }
    })
}
function showtotalplanmember(){
    document.getElementById("divdashboard").style.display='none';
    document.getElementById("showfullreport").style.display="block";
    alert("hello")
    $.ajax({
        url:"/1/gymmanagement",
        type: 'POST',
        data: {
            action: 'showtotalplanmember',
        },
        cache: false,
        success: function savecaller(res) {
            alert(res)
        document.getElementById("showtotalmemberinfo").innerHTML=res;     
        }
    })  
}