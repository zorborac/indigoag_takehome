function Builder() {
    var AGE_ERROR_ID = 'age-error-msg';
    var REL_ERROR_ID = 'rel-error-msg';

    var eventListenersAdded = false;
    function initEventListeners() {
        if (eventListenersAdded) { // guard against console fun and games
            console.log('Sorry, event listeners already present.');
            return;
        }

        document.querySelector('form').addEventListener('submit', function(event) {
            event.preventDefault();
            // Pretend this is an AJAX post
            document.querySelector('pre.debug').innerText = serialize();
        }); // prevent page refresh on button clicks
        document.querySelector('button.add').addEventListener('click', handleAdd);
        console.log('Event listeners added.');
        eventListenersAdded = true;
    }

    function handleAdd(event) {
        event.preventDefault();
        var age = document.getElementById('age').value;
        var relationship = document.getElementById('rel').value;
        var isSmoker = document.getElementById('smoker').checked;

        var personDetails = {
            age,
            relationship,
            isSmoker
        }

        var validationResult = handleFormValidation(age, relationship);
        if (validationResult === true) {
            resetFields(true);
            insertPerson(personDetails);
        } else {
            displayErrors(validationResult);
        }
    }

    function resetFields(isSuccess) {
        var ageInput = document.getElementById('age');
        var relationshipSelect = document.getElementById('rel');
        var ageErrorSpan = document.getElementById(AGE_ERROR_ID);
        var relationshipErrorSpan = document.getElementById(REL_ERROR_ID);

        ageInput.style = '';
        relationshipSelect.style = '';
        if (ageErrorSpan) {
            ageErrorSpan.parentNode.removeChild(ageErrorSpan);
        }
        if (relationshipErrorSpan) {
            relationshipErrorSpan.parentNode.removeChild(relationshipErrorSpan);
        }
        if (isSuccess) {
            ageInput.value = '';
            relationshipSelect.value = '';
            document.getElementById('smoker').checked = false;
        }
    }

    function displayErrors(validationErrors) {
        // Hard code as there are two fields to validateq
        var ageInput = document.getElementById('age');
        var relationshipSelect = document.getElementById('rel');
        
        resetFields(false);

        if (validationErrors.age) {
            ageInput.style = 'border: 2px solid red;';
            insertError(ageInput.parentNode, validationErrors.age, AGE_ERROR_ID);
        }
        if (validationErrors.relationship) {
            relationshipSelect.style = 'border: 2px solid red;';
            insertError(relationshipSelect.parentNode, validationErrors.relationship, REL_ERROR_ID);
        }
    }

    function handleFormValidation(age, relationship) {
        // Validate top down, one at a time
        var errors = {};

        if (!age.trim()) {
            errors.age = 'Age is required.';
        } else if (!Number(age) > 0) { // Should catch NaN as well
            errors.age = 'Age must be a number greater than zero.';
        }

        if (relationship === "") {
            errors.relationship = "Please select a relationship.";
        }
        if (Object.keys(errors).length > 0) {
            return errors;
        }
        return true;
    }

    function insertError(parentNode, errorMessage, errorId) {
        var errorSpan = document.createElement('span');
        errorSpan.style = "color: red; margin-left: 10px;";
        errorSpan.id = errorId;

        errorSpan.innerText = errorMessage;

        parentNode.appendChild(errorSpan);
    }

    function insertPerson(personDetails) {
        var personLi = document.createElement('li');

        var personHTML = '<div>Age: ' + personDetails.age + '</div>' +
                         '<div>Relationship: ' + personDetails.relationship + '</div>' +
                         '<div>Smoker: ' + personDetails.isSmoker + '</div>' +
                         '<button class="remove-person">Remove</button>';

        personLi.innerHTML = personHTML;

        personLi.querySelector('button').addEventListener('click', handleRemovePerson);
        document.querySelector('ol.household').appendChild(personLi);
    }

    function handleRemovePerson(event) {
        // just to be safe
        event.target.removeEventListener('click', handleRemovePerson);
        var liParent = event.target.parentNode;

        liParent.parentNode.removeChild(liParent);
    }

    function serialize() {
        var data = {
            members: []
        }
        var members = document.querySelectorAll('.household > li');
        // ES5 doesn't natively support forEach AFAIK... 
        for(var i = 0; i < members.length; i++) {
            var divs = members[i].querySelectorAll('div');
            var memberData = {}
            for (var j = 0; j < divs.length; j++) {
                var text = divs[j].innerText;
                var splitText = text.split(': ');
                // i.e. [Age, 33]
                memberData[splitText[0].toLowerCase()] = splitText[1]; // adds field to object, first lowercasing
            }
            data.members.push(memberData);
        }
        return JSON.stringify(data);
    }

    return {
        initEventListeners: initEventListeners
    }
}

var insuranceFormBuilder = Builder();
document.addEventListener('DOMContentLoaded', insuranceFormBuilder.initEventListeners());
