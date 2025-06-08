var baseURL = "http://api.login2explore.com:5577";
var connToken = "90934578|-31949213623345877|90956656";
var dbName = "SCHOOL-DB";
var relationName = "STUDENT-TABLE";
var jpdbirl = "/api/irl";
var jpdbiml = "/api/iml";

var recordNumber = ""; // To store the record number for update

setBaseUrl(baseURL);

function getStudentIDJson() {
    let sid = $("#sid").val();
    return JSON.stringify({ id: sid });
}

function validateFormData() {
    let sid = $("#sid").val().trim();
    let sname = $("#sname").val().trim();
    let sclass = $("#sclass").val().trim();
    let sdob = $("#sdob").val().trim();
    let saddress = $("#saddress").val().trim();

    if (sid === "") { alert("Student ID required"); $("#sid").focus(); return ""; }
    if (sname === "") { alert("Student name required"); $("#sname").focus(); return ""; }
    if (sclass === "") { alert("Class required"); $("#sclass").focus(); return ""; }
    if (sdob === "") { alert("DOB required"); $("#sdob").focus(); return ""; }
    if (saddress === "") { alert("Address required"); $("#saddress").focus(); return ""; }

    let data = {
        id: sid,
        name: sname,
        class: sclass,
        dob: sdob,
        address: saddress
    };
    return JSON.stringify(data);
}

function saveStudent() {
    let jsonData = validateFormData();
    if (jsonData === "") return;

    let putReq = createPUTRequest(connToken, jsonData, dbName, relationName);
    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommand(putReq, jpdbiml);
    jQuery.ajaxSetup({ async: true });

    if (resultObj.status === 200) {
        alert("Student record saved successfully!");
        resetForm();
    } else {
        alert("Error saving record: " + JSON.stringify(resultObj));
    }
}

function getStudent() {
    let sid = $("#sid").val().trim();
    if (sid === "") {
        alert("Please enter Student ID to search.");
        $("#sid").focus();
        return;
    }
    let getReq = createGET_BY_KEYRequest(connToken, dbName, relationName, getStudentIDJson());
    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommandAtGivenBaseUrl(getReq, baseURL, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    if (resultObj.status === 200) {
        // Fill form with fetched data
        let record = JSON.parse(resultObj.data).record;
        $("#sname").val(record.name);
        $("#sclass").val(record.class);
        $("#sdob").val(record.dob);
        $("#saddress").val(record.address);

        // Store record number for update
        recordNumber = JSON.parse(resultObj.data).rec_no;

        // Disable Student ID input and enable Update button
        $("#sid").prop("disabled", true);
        $("#updateBtn").prop("disabled", false);

        alert("Student record found. You can update the details now.");
    } else {
        alert("Student ID not found. You can create a new record.");
        resetForm();
        $("#sid").val(sid); // keep entered id
        $("#updateBtn").prop("disabled", true);
    }
}

function updateStudent() {
    let jsonStr = validateFormData();
    if (jsonStr === "") return;

    if (recordNumber === "") {
        alert("Please fetch a student record before updating.");
        return;
    }

    let updateReq = createUPDATERecordRequest(connToken, jsonStr, dbName, relationName, recordNumber);
    jQuery.ajaxSetup({ async: false });
    let res = executeCommand(updateReq, jpdbiml);
    jQuery.ajaxSetup({ async: true });

    if (res.status === 200) {
        alert("Student record updated successfully!");
        resetForm();
    } else {
        alert("Error updating record: " + JSON.stringify(res));
    }
}

function resetForm() {
    $("#studentForm")[0].reset();
    $("#sid").prop("disabled", false);
    $("#updateBtn").prop("disabled", true);
    recordNumber = "";
}
