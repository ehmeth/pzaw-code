{
    const addChoiceBtn = document.getElementById("add-choice-btn");
    const pollSubmitBtn = document.getElementById("poll-submit-btn");
    const choiceTemplate = document.getElementById("choice-set-template");
    const newPollForm = document.getElementById("new-poll-form");
    
    addChoiceBtn.addEventListener("click", function(ev) {
        let currentId = +document.getElementById("id_choice_set-TOTAL_FORMS").getAttribute("value");
        let newChoice = choiceTemplate.content.firstElementChild.cloneNode(true)
        
        let replaceInAttribute = function (element, attribute, pattern, replacement) {
            element.setAttribute(
                attribute,
                element.getAttribute(attribute).replaceAll(pattern, replacement)
            );
        };

        for (element of newChoice.children)
        {
            switch(element.nodeName)
            {
                case "LABEL":
                    replaceInAttribute(element, "for", "__prefix__", currentId.toString());
                    break;
                case "INPUT":
                    replaceInAttribute(element, "name", "__prefix__", currentId.toString());
                    replaceInAttribute(element, "id", "__prefix__", currentId.toString());
                    break;
                default:
                    console.debug("Ignoring node %s", element.nodeName);
            }
        }
        
        newPollForm.insertBefore(newChoice, pollSubmitBtn);
        ++currentId;
        document.getElementById("id_choice_set-TOTAL_FORMS").setAttribute("value", currentId.toString());
    });
}