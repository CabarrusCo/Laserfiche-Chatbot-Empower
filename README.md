# Conversational Form Laserfiche Forms Integration

### About Cabarrus County
---
Cabarrus is an ever-growing county in the southcentral area of North Carolina. Cabarrus is part of the Charlotte/Concord/Gastonia NC-SC Metropolitan Statistical Area and has a population of about 210,000. Cabarrus is known for its rich stock car racing history and is home to Reed Gold Mine, the site of the first documented commercial gold find in the United States.

### About our team
---
The Business & Location Innovative Services (BLIS) team for Cabarrus County consists of five members:

+ Joseph Battinelli - Team Supervisor
+ Mark McIntyre - Software Developer
+ Landon Patterson - Software Developer
+ Brittany Yoder - Software Developer
+ Marci Jones - Software Developer

Our team is responsible for software development and support for the [County](https://www.cabarruscounty.us/departments/information-technology). We work under the direction of the Chief Information Officer.

### What is Conversational Form and SPACE10?
---
Conversational Form is a Javascript Library developed by SPACE10. It allows you to turn any form into a flowing, conversational experience using HTML5 and Javascript.

SPACE10 is a research and design lab located in Denmark. They built the Javascript Conversational Form library. To learn more about their research and design lab and what they do, please visit https://space10.com/.

To view the Conversational Form documentation, please visit https://space10-community.github.io/conversational-form/landingpage/.

### Integration -- Getting Started
---

To Integrate Conversational Form, use the JQuery Instantiation bundled with a getScript call.

```
$( document ).ready(function() {
  
  $.getScript( "https://cdn.jsdelivr.net/gh/space10-community/conversational-form@1.0.1/dist/conversational-form.min.js", function( data, textStatus, jqxhr ) {
  
    $("form").conversationalForm({
        
    });
    
  });
  
});

```

### Event Dispatchers
---
https://space10-community.github.io/conversational-form/docs/1.0.0/events/

You can use event dispatcher to watch for changes to help with things like using Autofills in Laserfiche. There are two main events used by Conversational Form with Laserfiche Integration. These events are SUBMIT and SUBMIT_VALUE. SUBMIT is mainly used for text inputs where as SUBMIT_VALUE is mainly used for selection events, such as when the user clicks a radio button. Below is an example of SUBMIT_VALUE.

Create a HTML button

```
<fieldset cf-questions="Please hit the Start button below to get started">

  <input type="radio" name="start" value="Start" cf-label="Start">

</fieldset>

```

Javascript for SUBMIT_VALUE

```
$(document).ready(function () {

    $.getScript("https://cdn.jsdelivr.net/gh/space10-community/conversational-form@1.0.1/dist/conversational-form.min.js", function (data, textStatus, jqxhr) {

        var dispatcher = new cf.EventDispatcher();

        dispatcher.addEventListener(cf.ControlElementEvents.SUBMIT_VALUE, function (event) {

            var tagName = event.detail.referenceTag.name

            if (tagName == "start") {
                //THIS CAN BE ANY FUNCTION, LOOKUP EMPLOYEE, ETC
                console.log("START EVENT FIRED")
            }

        }, false);

        $("form").conversationalForm({
            eventDispatcher: dispatcher
        });

    });

});

```

### Adding Tags with Javascript
----

You can also use Javascript to add tags into the Conversational Form as opposed to using HTML. Here is an example using SUBMIT_VALUE and functions. In the example below, the user hits the start button from the SUBMIT_VALUE example. Then tags are generated to determine which way the user wants to turn. Upon selection, it is logged to the console which the user chose. You can see here how you can start building logic and conditionals for your bot using Javascript and adding tags.

```
$(document).ready(function () {

    function determineUserDirection() {

        var tags = [{
            "tag": "fieldset",
            "name": "determineUserDirection",
            "type": "Radios",
            "cf-questions": "Which way would you like to turn?",
            "cf-input-placeholder": "Use me to filter",
            "children": [{
                    "tag": "input",
                    "type": "radio",
                    "name": "userDirectionSelection",
                    "value": "turnLeft",
                    "cf-label": "Turn Left"
                },
                {
                    "tag": "input",
                    "type": "radio",
                    "name": "userDirectionSelection",
                    "value": "turnRight",
                    "cf-label": "Turn Right"
                }
            ]
        }]

        window.ConversationalForm.addTags(tags, true)
    }

    function userChoseRight() {
        console.log("USER IS HERE--RIGHT")
    }

    function userChoseLeft() {
        console.log("USER IS HERE--LEFT")
    }

    $.getScript("https://cdn.jsdelivr.net/gh/space10-community/conversational-form@1.0.1/dist/conversational-form.min.js", function (data, textStatus, jqxhr) {

        var dispatcher = new cf.EventDispatcher();

        dispatcher.addEventListener(cf.ControlElementEvents.SUBMIT_VALUE, function (event) {

            var tagName = event.detail.referenceTag.name

            //USER HITS START HTML BUTTON FROM PREVIOUS EXAMPLE TO GET THINGS GOING

            if (tagName == "start") {
                determineUserDirection()
            }

            if (tagName == "userDirectionSelection") {

                var directionUserSelected = event.detail.value

                if (directionUserSelected == "Turn Left") {
                    userChoseLeft()
                } else {
                    userChoseRight()
                }
            }

        }, false);

        $("form").conversationalForm({
            eventDispatcher: dispatcher
        });

    });

});

```

### Filling out Laserfiche forms variables

The key to Laserfiche forms is variables. So you have to take the data from the Conversational Form and put it into Laserfiche to use throughout the process. This is accomplished with simple JQuery by grabbing the values set throughout the process (either by declaring variables or using the Conversational Form values), transferring them to the field values used by Laserfiche, and then forcing the Submit action. Here is a simple example.

```
$(document).ready(function () {

    var directionUserSelected = ""

    function determineUserDirection() {

        var tags = [{
            "tag": "fieldset",
            "name": "determineUserDirection",
            "type": "Radios",
            "cf-questions": "Which way would you like to turn?",
            "cf-input-placeholder": "Use me to filter",
            "children": [{
                    "tag": "input",
                    "type": "radio",
                    "name": "userDirectionSelection",
                    "value": "turnLeft",
                    "cf-label": "Turn Left"
                },
                {
                    "tag": "input",
                    "type": "radio",
                    "name": "userDirectionSelection",
                    "value": "turnRight",
                    "cf-label": "Turn Right"
                }
            ]
        }]

        window.ConversationalForm.addTags(tags, true)
    }

    function displayUserDirection() {
        window.ConversationalForm.addRobotChatResponse("You selected " + directionUserSelected)
        promptUserForSubmit()
    }

    function promptUserForSubmit() {

        var tags = [{
            "tag": "fieldset",
            "name": "promptUserForSubmit",
            "type": "Radios",
            "cf-questions": "Please hit submit below to submit this form",
            "cf-input-placeholder": "Use me to filter",
            "children": [{
                "tag": "input",
                "type": "radio",
                "name": "Submit",
                "value": "Submit",
                "cf-label": "Submit"
            }]
        }]

        window.ConversationalForm.addTags(tags, true)
    }

    function submitThisForm() {
        //FIELD THAT CONTAINS LASERFICHE VARIABLE
        $('#Field3').val(directionUserSelected)
        $('form').submit()
    }

    $.getScript("https://cdn.jsdelivr.net/gh/space10-community/conversational-form@1.0.1/dist/conversational-form.min.js", function (data, textStatus, jqxhr) {

        var dispatcher = new cf.EventDispatcher();

        dispatcher.addEventListener(cf.ControlElementEvents.SUBMIT_VALUE, function (event) {

            var tagName = event.detail.referenceTag.name

            //USER HITS START HTML BUTTON FROM PREVIOUS EXAMPLE TO GET THINGS GOING

            if (tagName == "start") {
                determineUserDirection()
            }

            if (tagName == "userDirectionSelection") {

                directionUserSelected = event.detail.value
                displayUserDirection()

            }

            if (tagName == "Submit") {
                submitThisForm()
            }

        }, false);

        $("form").conversationalForm({
            eventDispatcher: dispatcher
        });

    });

});

```
In this example, Field3 is a Single Line variable in Conversational Form. Upon running the Submit Function, the code grabs the variable and puts it in Field3, making it a Laserfiche Variable to be used anywhere in the Business Process that follows after submission.

### flowCallBack vs Event Dispatchers

The code in the repo uses flowCallBack, but the examples given in this readme use Event Dispatchers. When working with flows and conditionals, it is better to use Event Dispatchers. When working with data from autofill, especially large data sets, flowCallBack is better because the script CAN freeze if a lot of data is processed on an Event Dispatcher(such as loading every employee from a department), but a flowCallBack won't freeze and the script will continue on.


