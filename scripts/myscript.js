document.addEventListener('DOMContentLoaded', function(){
    var elems = document.querySelectorAll('.side-menu');
    var options = {edge: "right"};
    M.Sidenav.init(elems, options);

    elems = document.querySelectorAll('.side-form');
    options = {edge: "left"};
    M.Sidenav.init(elems, options);
});

// TODO: code aanvullen om connectoren toe te voegen of te verwijderen in de UI.

// De overkoepelende DIV opzoeken.
const connectors = document.querySelector(".connectors");

function clearConnectorUI()
{
    connectors.innerHTML = "";
}

function deleteConnectorFromUI(id)
{
    document.querySelector("[data-id=" + id + "]").remove();
}

// Zet onderstaanded niet in db.js omdat het over de UI gaat.
function addConnectorToUI(connector, id)
{
    // HTML voor één connector voorbereiden via sjabloon.
    // OPM: zorg ervoor dat de afbeeldingen die je wil gebruiken, in de map images staan. Later worden die 
    //      mee opgeslaan in de database/IndexedDB...
    // Gebruik een JavaScript 'template string/literal' om data in HTML/tekst toe te voegen.
    // Doe dat binnen 'back ticks' ` (accent grave).

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals


    const hmtl = `
                <div class="card-panel connector white row" data-id="${id}">
                    <img src="images/${connector.image}" alt="connector thumb">
                    <div class="connector-details">
                        <div class="connector-title">${connector.name}</div>
                        <div class="connector-general-description">${connector.application}</div>
                    </div>
                    <div class="connector-delete">
                        <i class="material-icons" data-id="${id}">delete_outline</i>
                    </div>
                </div>
            `;
    
    // HTML toevoegen.
    connectors.innerHTML += hmtl;
}