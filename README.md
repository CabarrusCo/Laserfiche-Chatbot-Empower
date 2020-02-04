# Laserfiche-Chatbot-Empower

### Conversational Form Laserfiche Forms integration

### What is Conversational Form and SPACE10?
---
Conversational Form is a Javascript Library developed by SPACE10. It's let you turn any form into a flowing, Conversational experience using HTML5 and Javascript.

SPACE10 is the company that built Conversational Form. to learn more about their company and what they do, please visit https://space10.com/

To view the Conversational Form documentation, please visit https://space10-community.github.io/conversational-form/landingpage/

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

You can use event dispatcher to watch for changes to help with things like using Autofills in Laserfiche. There are two main Events used by Conversational Form with Laserfiche Integration. These events are SUBMIT and SUBMIT_VALUE. SUBMIT is mainly used for text inputs where as SUBMIT_VALUE is mainly used for Selection events, such as the user clicks a radio button. Below is an example of both.

SUBMIT_VALUE

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

You can also use Javascript to add tags into the Conversational Form as opposed to using HTML, here is an example using SUBMIT_VALUE and functions. In the example below, the user hits the start button from the SUBMIT_VALUE example. Then tags are generated to determine which way the user wants to turn. Upon selection, it is logged to console which way the user chose. You can see here how you can start building logic and conditionals for your bot using Javascript and adding tags.

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

The key to Laserfiche forms are variables. So you have to take the data from the Conversational Form and put them into Laserfiche to use throughout the process. This is accomplished with simple JQuery by grabbing the values set throughout the process(either by declaring variables or using the Conversational Form values), transferring them to the field values used by Laserfiche, then forcing the Submit action.


