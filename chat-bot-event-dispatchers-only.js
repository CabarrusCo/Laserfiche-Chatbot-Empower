//Shows How To Accomplish everything in CHAT-BOT.js using EVENT DISPATCHERS only, which may be a cleaner option for some users
//This example doesn't submit anything, just looks up an employee number based on name selection, for demonstration purposes only

$(document).ready(function () {

    var userPhotoURL = $('#Field1').val()
    userPhotoURL = userPhotoURL.replace("@", "")
    userPhotoURL = userPhotoURL.replace(".", "")
    userPhotoURL = userPhotoURL + ".jpg"
    userPhotoURL = "https://PHOTO_URLS_HERE" + userPhotoURL
    userPhotoURL = userPhotoURL.toLowerCase()


    var nameForAutofill = $('#Field2').val()
    nameForAutofill = nameForAutofill.split(" ")
    nameForAutofill = nameForAutofill[0]

    var employeeSelectedName = ""

    var employeeListForSelect = []


    function startConversationalForm() {
        clearInterval(loadAllAutofillData)
        window.ConversationalForm.start()
    }

    function startLoadingAllAutofillData() {
        loadAllAutofillData = setInterval(loadAllAutofillDataForSelect, 5000);
    }

    function loadAllAutofillDataForSelect() {

        var employeeListArray = []
        employeeListForSelect = []

        $("#Field4 option").each(function (i) {

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

            startConversationalForm()

        } else {
            employeeListArray = []
        }
    }

    function userSelectsEmployee() {

        var tags = [{
            "tag": "fieldset",
            "name": "employeeNameFromSelection",
            "type": "Radios",
            "cf-questions": "Please Select the Employee you are filling this review out for. You can use the bottom input field to filter",
            "cf-input-placeholder": "Use me to filter",
            "children": employeeListForSelect
        }, ];

        window.ConversationalForm.addTags(tags, true)
    }

    function pullBackEmployeeNumber() {
        window.ConversationalForm.uiOptions.robot.robotResponseTime = 7000

        var tags = [{
            "tag": "fieldset",
            "name": "pullBackEmployeeNumber",
            "type": "Radios",
            "cf-questions": "Please hit View Employee Number to View that Employee's Number",
            "cf-input-placeholder": "Use me to filter",
            "children": [{
                "tag": "input",
                "type": "radio",
                "name": "pullBackEmployeeNumberSelect",
                "value": "viewEmployeeNumber",
                "cf-label": "View Employee Number"
            }]
        }, ];

        window.ConversationalForm.addTags(tags, true)
    }

    function displayNumberToEndUser() {
        var employeeNumber = $('#Field5').val()
        window.ConversationalForm.addRobotChatResponse("I have the Employee Number As " + employeeNumber)
    }


    $.getScript("https://cdn.jsdelivr.net/gh/space10-community/conversational-form@1.0.1/dist/conversational-form.min.js", function (data, textStatus, jqxhr) {

        $('#cf-formtitle').show();
        $('form').show();

        var dispatcher = new cf.EventDispatcher();
        dispatcher.addEventListener(cf.ControlElementEvents.SUBMIT_VALUE, function (event) {

            var tagName = event.detail.referenceTag.name

            if (tagName == "startProcess") {
                userSelectsEmployee()
            }

            if (tagName == "employeeSelectForAutofill") {
                employeeSelectedName = event.detail.value
                $('#Field7').val(employeeSelectedName)
                $('#Field7').trigger('change')
                pullBackEmployeeNumber()
            }

            if (tagName == "pullBackEmployeeNumberSelect") {
                window.ConversationalForm.uiOptions.robot.robotResponseTime = 650
                displayNumberToEndUser()
            }

        }, false);

        $("form").conversationalForm({
            robotImage: "https://AVATAR_PHOTO_HERE_LINK",
            userImage: userPhotoURL,
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

            window.ConversationalForm.addRobotChatResponse("Hello " + nameForAutofill + " Welcome to the Cabarrus County Employee Number Lookup")
            window.ConversationalForm.addRobotChatResponse("I am your assistant and will guide you through filling out the form, please standby as I personalize your experience.")
            $('#signatureForForm').val($('#Field2').val())
            startLoadingAllAutofillData()
        } else {
            window.ConversationalForm.addRobotChatResponse("Sorry, you do not have an Email address in our system and cannot proceed with this form. Please contact the Cabarrus County IT Helpdesk to get this problem resolved.")
        }


    });

});
