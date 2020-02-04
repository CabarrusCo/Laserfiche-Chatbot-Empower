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

You can use event dispatcher to watch for changes to help with things like pulling autofill data out of Laserfiche. There are two main Events used by Conversational Form with Laserfiche Integration. These events are SUBMIT and SUBMIT_VALUE. SUBMIT is mainly used for text inputs where as SUBMIT_VALUE is mainly used for Selection events, such as the user clicks a radio button.

