var headers = new Array();
headers = ['#', 'Expression', 'Justification', '', '', '']


function replaceCharacter(ev) {

    console.log(ev);

    if (ev.id == "premise" || ev.id == "conclusion") {
        var name = ev.id;
    } else {
        console.log(ev.path[0].id);
        var name = ev.path[0].id;
    }

    console.log(document.getElementById(name));
    let txt = document.getElementById(name).value;
    console.log(txt);

    txt = txt.replace("\\and", "∧");
    txt = txt.replace("\\or", "∨");
    txt = txt.replace("\\implies", "→");
    txt = txt.replace("\\not", "¬");
    txt = txt.replace("\\iff", "↔");
    txt = txt.replace("\\contradiction", "⊥");
    document.getElementById(name).value = txt;

}

function createNewRow(oButton, tr) {

    for (var cellCount = 0; cellCount < headers.length; cellCount++) {
        var td = document.createElement('td');
        td = tr.insertCell(cellCount);

        // If this is the first column add number
        if (cellCount == 0) {
            td.setAttribute('id', 'rowNumber');
            td.setAttribute('value', tr.rowIndex);
            td.innerHTML = tr.rowIndex;

        }

        // If this is the second column create input for expression
        if (cellCount == 1) {
            var inputField = document.createElement('input');

            var inputId = `expression-${tr.rowIndex}`;

            inputField.setAttribute('id', inputId);
            inputField.setAttribute('type', 'text');
            inputField.setAttribute('value', '');
            inputField.setAttribute("contenteditable", "true")
            inputField.addEventListener("input", replaceCharacter);
            td.appendChild(inputField);
        }

        // If this is the third column create input for justification
        if (cellCount == 2) {
            var inputField = document.createElement('input');

            var inputId = `justification-${tr.rowIndex}`;

            inputField.setAttribute('id', inputId);
            inputField.setAttribute('type', 'text');
            inputField.setAttribute('value', '');
            inputField.setAttribute("contenteditable", "true")
            inputField.addEventListener("input", replaceCharacter);
            td.appendChild(inputField);
        }

        // If this is the fourth column create button for adding line in current position
        if (cellCount == 3) {
            var button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'Insert Row Current Level');
            button.setAttribute('onclick', 'insertRowCurrentLevel(this)');
            td.appendChild(button);
        }

        // If this is the fifth column create button for adding sub
        if (cellCount == 4) {
            var button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'Insert Sub Row');
            button.setAttribute('onclick', 'insertNewSubRow(this)');
            td.appendChild(button);
        }
        // If this is the six column create button for deleting
        if (cellCount == 5) {
            var button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'Remove');
            button.setAttribute('onclick', 'removeRow(this)');
            td.appendChild(button);
        }

    }
    return tr;
}

function appendNewRow(oButton) {
    var emptyTable = document.getElementById('emptyTable');
    var rowCount = emptyTable.rows.length;
    var tr = emptyTable.insertRow(rowCount);
    createNewRow(oButton, tr);
}


function createTable(ev) {
    console.log(ev);


    var emptyTable = document.createElement('table');
    emptyTable.setAttribute('id', 'emptyTable');

    var tr = emptyTable.insertRow(-1);

    for (var headerCount = 0; headerCount < headers.length; headerCount++) {
        var th = document.createElement('th');
        th.innerHTML = headers[headerCount];
        tr.appendChild(th);
    }

    var div = document.getElementById('cont');
    div.appendChild(emptyTable);

    // console.log(document.getElementById('premise').value);
    var premise = document.getElementById('premise').value
    // console.log(document.getElementById('conclusion').value);
    var conclusion = document.getElementById('conclusion').value;

    var problem = `${premise} ∴ ${conclusion}`;

    document.getElementById("problem").innerHTML = problem;

    // Delimit the premise based on 
    var premises = premise.split(",").map(item => item.trim());

    // Iterate over the premises and create a new row for each
    var rowCount = 1;

    for (let premiseCount = 0; premiseCount < premises.length; premiseCount++) {
        appendNewRow();
        emptyTable.childNodes[0].childNodes[rowCount].childNodes[1].innerText = premises[premiseCount];
        emptyTable.childNodes[0].childNodes[rowCount].childNodes[2].innerText = "Premise";
        emptyTable.childNodes[0].childNodes[rowCount].childNodes[4].innerText = '';
        emptyTable.childNodes[0].childNodes[rowCount].childNodes[5].innerText = '';
        // emptyTable.childNodes[0].childNodes[rowCount].childNodes[6].innerText = '';
        rowCount++;
    }
    return false;
}


// function to insert a new row for a sub proof
function insertNewSubRow(oButton) {

    const myList = oButton.parentNode.parentNode.parentNode;
    const myItem = oButton.parentNode.parentNode;
    var tr = document.createElement('tr');
    tr = createNewRow(oButton, tr);
    myList.insertBefore(tr, myItem.nextSibling);

    var value = myItem.childNodes[0].innerHTML;
    myItem.childNodes[0].innerHTML = `${value}.1`;
    tr.childNodes[0].innerHTML = `${value}.2`;
}

function insertRowCurrentLevel(oButton) {

    //Insert a new row into the table beneath the current element

    var emptyTable = document.getElementById('emptyTable').childNodes[0];
    const rowOfClickedButton = oButton.parentNode.parentNode;

    var newRow = document.createElement('tr');
    newRow = createNewRow(oButton, newRow);
    emptyTable.insertBefore(newRow, rowOfClickedButton.nextSibling);

    //Retrieve the current row number of the row you're inserting under
    var rowNumberOfClickedButton = rowOfClickedButton.childNodes[0].innerHTML;

    // Split the rowNumberOfClickedButton into prefix and last digit
    var rowNumberOfClickedButtonList = rowNumberOfClickedButton.split('.');

    var prefixValuesList = rowNumberOfClickedButtonList.slice(0, -1);
    var indexOfChangingElement = prefixValuesList.length;

    // If it has no subproof numbering then add one to the previous row number
    if (prefixValuesList.length == 0) {
        newRow.childNodes[0].innerHTML = `${Number(rowNumberOfClickedButton) + 1}`;

        // If is has subproof number then take the last number and add one to it
    } else {
        var prefixValuesString = prefixValuesList.join('.')
        var lastValue = rowNumberOfClickedButtonList.at(-1);
        newRow.childNodes[0].innerHTML = `${prefixValuesString}.${Number(lastValue) + 1}`;
    }

    var prefixValuesString = prefixValuesList.join('.')

    var startingPoint = newRow.rowIndex + 1;

    renumberAllRows(startingPoint, prefixValuesList);

    return;
}

// function to renumber both parent rows and rows with sub proofs
function renumberAllRows(startingPoint, prefixValuesList) {
    var myTable = document.getElementById('emptyTable');

    // console.log(startingPoint);
    var indexOfChangingElement = prefixValuesList.length;
    var prefixValues = prefixValuesList.join('.');

    for (var row = startingPoint; row < myTable.rows.length; row++) {
        var currentRowNumber = myTable.rows.item(row).cells[0].innerHTML;

        var currentRowNumberList = currentRowNumber.split('.');


        if (currentRowNumber.startsWith(prefixValues)) {

            currentRowNumberList[indexOfChangingElement] = Number(currentRowNumberList[indexOfChangingElement]) + 1;
            var newRowNumber = currentRowNumberList.join('.');

            for (var cellCount = 0; cellCount < myTable.rows[row].cells.length; cellCount++) {

                var element = myTable.rows.item(row).cells[cellCount];

                // Update the row number
                if (cellCount == 0) {
                    element.innerText = newRowNumber;
                }

                // Update the expression id
                if (cellCount == 1) {
                    element.childNodes[0].id = `expression-${newRowNumber}`;
                }

                // Update the justification id
                if (cellCount == 2) {
                    element.childNodes[0].id = `justification-${newRowNumber}`;
                }
            }
        }
    }
}

// function to delete a row.
function removeRow(oButton) {

    var emptyTable = document.getElementById('emptyTable').childNodes[0];
    const rowOfClickedButton = oButton.parentNode.parentNode;

    // Retrieve the current row number of the row you're deleting
    var rowNumberOfClickedButton = rowOfClickedButton.childNodes[0].innerHTML;

    // Split the rowNumberOfClickedButton into prefix and last digit
    var rowNumberOfClickedButtonList = rowNumberOfClickedButton.split('.');

    var prefixValuesList = rowNumberOfClickedButtonList.slice(0, -1);
    var finalElementOfRowNumberOfClickedButton = rowNumberOfClickedButtonList.slice(-1);
    var prefixValuesString = prefixValuesList.join('.')

    // Find the prefix of the next value to see if we have deleted the last element of a subproof
    var nextRowNumber = rowOfClickedButton.nextSibling.childNodes[0].innerHTML;
    console.log("Next row");
    console.log(nextRowNumber);
    var nextRowNumberList = nextRowNumber.split('.');
    var prefixOfNextRowValueList = nextRowNumberList.slice(0, -1);
    var prefixNextRowValuesString = prefixOfNextRowValueList.join('.')



    var startingPoint = rowOfClickedButton.rowIndex;

    emptyTable.deleteRow(rowOfClickedButton.rowIndex);

    renumberAllRowsAfterDelete(startingPoint, prefixValuesList);


    // If we have deleted a sub proof then we need to upate the numbers after
    if (finalElementOfRowNumberOfClickedButton == "1" & !prefixNextRowValuesString.startsWith(prefixValuesString)) {

        if (prefixValuesList.length == prefixOfNextRowValueList.length) {
            prefixOfNextRowValueList.pop();
        }
        renumberAllRowsAfterDelete(startingPoint, prefixOfNextRowValueList);
    }

}



function renumberAllRowsAfterDelete(startingPoint, prefixValuesList) {
    var myTable = document.getElementById('emptyTable');

    // console.log(startingPoint);
    var indexOfChangingElement = prefixValuesList.length;
    var prefixValues = prefixValuesList.join('.');

    console.log([startingPoint, myTable.rows.length - 1]);

    // for (var row = startingPoint; row < myTable.rows.length; row++) {
    for (var row = myTable.rows.length - 1; row >= startingPoint; row--) {

        var currentRowNumber = myTable.rows.item(row).cells[0].innerHTML;

        var currentRowNumberList = currentRowNumber.split('.');

        if (currentRowNumber.startsWith(prefixValues)) {

            currentRowNumberList[indexOfChangingElement] = Number(currentRowNumberList[indexOfChangingElement]) - 1;
            var newRowNumber = currentRowNumberList.join('.');

            for (var cellCount = 0; cellCount < myTable.rows[row].cells.length; cellCount++) {

                var element = myTable.rows.item(row).cells[cellCount];

                // Update the row number
                if (cellCount == 0) {
                    element.innerText = newRowNumber;
                }

                // Update the expression id
                if (cellCount == 1) {
                    element.childNodes[0].id = `expression-${newRowNumber}`;
                }

                // Update the justification id
                if (cellCount == 2) {
                    element.childNodes[0].id = `justification-${newRowNumber}`;
                }
            }
        }
    }
}





function submit() {

    var myTable = document.getElementById('emptyTable');
    var values = new Array();

    var proofObject = {};

    proofObject["proof"] = {};


    var premise = document.getElementById('premise').value
    var premises = premise.split(",").map(item => item.trim());
    var conclusion = document.getElementById('conclusion').value;



    var proof = proofObject["proof"];
    proof["premises"] = premises;
    proof["conclusion"] = conclusion;
    proof["lines"] = [];

    for (var row = 1; row < myTable.rows.length; row++) {
        var proofLine = {};
        for (var cellCount = 0; cellCount < myTable.rows[row].cells.length; cellCount++) {
            var element = myTable.rows.item(row).cells[cellCount];
            console.log(element);

            if (cellCount == 0) {
                values.push(element.innerText);
                proofLine["line_no"] = element.innerText;
            } else if (cellCount == 1) {
                values.push(element.childNodes[0].value ? element.childNodes[0].value : element.innerText)
                proofLine["expression"] = element.childNodes[0].value ? element.childNodes[0].value : element.innerText;
            } else if (cellCount == 2) {
                values.push(element.childNodes[0].value ? element.childNodes[0].value : element.innerText)
                proofLine["rule"] = element.childNodes[0].value ? element.childNodes[0].value : element.innerText;
            }
        }
        proof["lines"].push(proofLine);
    }

    console.log(proofObject);

    var jsonProofObject = JSON.stringify(proofObject);
    console.log(jsonProofObject);

}