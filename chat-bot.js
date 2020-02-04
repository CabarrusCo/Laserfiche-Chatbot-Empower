$(document).ready(function () {
  
    $('#cf-formtitle').hide();
    $('form').hide();
  
 
    //Flags and Variables to be used through the process. Variable names should be self explanatory

    //This script demostrates how to grab Employee Autofill Data both ways. The first way being Submit Flow Call back
    //The second method is using Event Dispatchers. Either way works great.


    var userPhotoURL = $('#Field1').val()
    userPhotoURL = userPhotoURL.replace("@", "")
    userPhotoURL = userPhotoURL.replace(".", "")
    userPhotoURL = userPhotoURL + ".jpg"
    userPhotoURL = "https://YOUR_URL/TO_USER_PHOTOS/" + userPhotoURL
    userPhotoURL = userPhotoURL.toLowerCase()

    var nameForAutofill = $('#Field2').val()
    nameForAutofill = nameForAutofill.split(" ")
    nameForAutofill = nameForAutofill[0]

    var employeeListForSelect = []
    var departmentHeadListForSelect = []

    //initial responses for compare
    var startProcessSelected = true
    var selectedEmployee = ""
    var employeeNameForSelection = ""
    var employeeLookupIteration = 0
    var selectedDepartmentHead = ""

    function startConversationalForm() {
        clearInterval(loadAllAutofillData)
        window.ConversationalForm.start()
    }

    function startLoadingAllAutofillData() {
        loadAllAutofillData = setInterval(loadAllAutofillDataForSelect, 5000);
    }

    function loadAllAutofillDataForSelect() {

        var employeeListArray = []
        var departmentHeadListArray = []
        employeeListForSelect = []

        $("#Field7 option").each(function (i) {

            var employeeName = $(this).text()
            employeeName = employeeName.trim()

            if (employeeName != "") {
                employeeListArray.push(employeeName)
            }

        })

        if (employeeListArray.length > 0) {

            employeeListArray.forEach(function (employee) {


                employeeListForSelect.push({
                    "tag": "input",
                    "type": "radio",
                    "name": "employeeSelectForAutofill",
                    "value": employee,
                    "cf-label": employee
                })

            })

            $("#Field9 option").each(function (i) {

                var departmentHeadName = $(this).text()
                departmentHeadName = departmentHeadName.trim()

                if (departmentHeadName != "") {
                    departmentHeadListArray.push(departmentHeadName)
                }

            })

            if (departmentHeadListArray.length > 0) {

                departmentHeadListArray.forEach(function (departmentHead) {


                    departmentHeadListForSelect.push({
                        "tag": "input",
                        "type": "radio",
                        "name": "departmentHeadSelectForAutofill",
                        "value": departmentHead,
                        "cf-label": departmentHead
                    })

                })

                startConversationalForm()
            }

        } else {
            departmentHeadListForSelect = []
            employeeListArray = []
        }
    }

    function presentUserWithEmployeeSelection() {

        var tags = [{
            "tag": "fieldset",
            "name": "employeeNameFromSelection",
            "type": "Radios",
            "cf-questions": "Please Select the Employee you are filling this review out for. You can use the bottom input field to filter",
            "cf-input-placeholder": "Use me to filter",
            "children": employeeListForSelect
        }, ];

        window.ConversationalForm.addTags(tags, true)
        startProcessSelected = false
    }

    function performEmployeeLookupFromAutofill() {

        if (employeeLookupIteration == 1) {
            window.ConversationalForm.uiOptions.robot.robotResponseTime = 5000

            var tags = [{
                "tag": "fieldset",
                "name": "tryEmployeeLookup",
                "type": "Radios",
                "cf-questions": "Please Hit View Employee Information whenever you are ready to proceed.",
                "cf-input-placeholder": "",
                "isMultiChoice": false,
                "children": [{
                    "tag": "input",
                    "type": "radio",
                    "cf-label": "View Employee's Information",
                    "value": "View Employee's Information",
                }, ],
            }, ];

            employeeLookupIteration = employeeLookupIteration + 1
            window.ConversationalForm.addTags(tags, true)

        } else if (employeeLookupIteration > 1) {

            window.ConversationalForm.uiOptions.robot.robotResponseTime = 0

            var employeeDepartment = $('#Field13').val()

            if (employeeDepartment != "") {

                employeeNumber = $('#Field12').val()
                employeeName = $('#Field10').val()
                employeePosition = $('#Field14').val()
                employeeEmail = $('#Field15').val()

                employeePhoto = employeeEmail.replace("@", "")
                employeePhoto = employeePhoto.replace(".", "")
                employeePhoto = "https://YOUR_URL_TO_EMPLOYEE_PHOTOS/" + employeePhoto + ".jpg"

                console.log(employeePhoto)

                employeePhoto = "<img src='" + employeePhoto + "'></img>"

                var message = "Here is that Employee's In Depth Information" + "<br><br>" +
                    "Employee Number: " + employeeNumber + "<br><br>" +
                    "Name: " + employeeName + "<br><br>" +
                    "Position Title: " + employeePosition + "<br><br>" +
                    employeePhoto

                var tags = [{
                    "tag": "fieldset",
                    "name": "continueOnToPerformanceReview",
                    "type": "Radios",
                    "cf-questions": message,
                    "cf-input-placeholder": "",
                    "isMultiChoice": false,
                    "children": [{
                        "tag": "input",
                        "type": "radio",
                        "cf-label": "Continue",
                        "value": "Continue",
                    }, ],
                }, ];

                selectedEmployee = employeeNameForSelection
                employeeLookupIteration = 0

                window.ConversationalForm.addTags(tags, true)
            }

        }

    }

    function performDepartmentHeadSelectFromAutofill() {

        selectedDepartmentHead = "DEPARTMENT HEAD FOUND"

        var tags = [{
            "tag": "fieldset",
            "name": "departmentHeadFromSelection",
            "type": "Radios",
            "cf-questions": "Please select the Department Head from the list below",
            "cf-input-placeholder": "Use me to filter",
            "children": departmentHeadListForSelect
        }]

        window.ConversationalForm.addTags(tags, true)

    }


    //In prod, consider setting up your own CDN, this is example only. Grabs the chat bot and renders it to the DOM
    $.getScript("https://cdn.jsdelivr.net/gh/space10-community/conversational-form@1.0.1/dist/conversational-form.min.js", function (data, textStatus, jqxhr) {

        $('#cf-formtitle').show();
      	$('form').show();
      
        var dispatcher = new cf.EventDispatcher();
        dispatcher.addEventListener(cf.ControlElementEvents.SUBMIT_VALUE, function (event) {

            var tagName = event.detail.referenceTag.name

            if (tagName == "departmentHeadSelectForAutofill") {
                var departmentHeadName = event.detail.value
                $('#Field17').val(departmentHeadName)
                $('#Field17').trigger('change')

            }

        }, false);


        var flowCallback = function (dto, success, error) {

            var botData = window.ConversationalForm.getFormData(true)

            if (botData.finalize[0] == 'submit') {
                $('form').hide()

                var performanceReviewScore = $('#employeeShortFormScore').val()
                var performanceReviewComments = $('#additionalComments').val()
                var performanceReviewType = botData.evaltype[0]
                var copyEmailed = botData.emailCopy[0]
                var signature = $('#signatureForForm').val()

                $('#Field29').val(performanceReviewScore)
                $('#Field30').val(performanceReviewComments)
                $('#Field31').val(performanceReviewType)
                $('#Field32').val(copyEmailed)
                $('#Field27').val(signature)

                $('form').submit()

            } else {

                if (botData.startProcess[0] == "start") {

                    if (startProcessSelected == true) {
                        presentUserWithEmployeeSelection()
                    }

                }

                if (botData.employeeNameFromSelection != null) {
                    employeeNameForSelection = botData.employeeNameFromSelection[0]

                    if (selectedEmployee != employeeNameForSelection) {

                        $('#Field10').val(employeeNameForSelection)
                        $('#Field10').trigger('change')

                        if (employeeLookupIteration == 0) {
                            employeeLookupIteration = 1
                        }

                        performEmployeeLookupFromAutofill()

                    }
                }


                if (botData.continueOnToPerformanceReview != null) {

                    if (selectedDepartmentHead == "") {
                        performDepartmentHeadSelectFromAutofill()
                    }

                }


            }



            success();

        };

        $("form").conversationalForm({
            robotImage: "https://YOUR_URL_TO_ROBOT_IMAGE.jpg",
            userImage: userPhotoURL,
            flowStepCallback: flowCallback,
            eventDispatcher: dispatcher,
            preventAutoStart: true,

            userInterfaceOptions: {
                robot: {
                    robotResponseTime: 0,
                    chainedResponseTime: 650,
                    showThinking: true
                }
            }

        });

        var initEmailForVerficiation = $('#Field1').val()

        if (initEmailForVerficiation != "") {

            $('html, body').animate({
                scrollTop: $(document).height()
            }, 'slow');

            window.ConversationalForm.addRobotChatResponse("Hello " + nameForAutofill + " Welcome to the Cabarrus County Performance Review Form")
            window.ConversationalForm.addRobotChatResponse("I am your assistant and will guide you through filling out the form, please standby as I personalize your experience.")
            $('#signatureForForm').val($('#Field2').val())
            startLoadingAllAutofillData()
        } else {
            window.ConversationalForm.addRobotChatResponse("Sorry, you do not have an Email address in our system and cannot proceed with this form. Please contact the Cabarrus County IT Helpdesk to get this problem resolved.")
        }


    });

});
