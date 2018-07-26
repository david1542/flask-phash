var files = [];

function dropHandler(ev) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                
                var elementId = ev.target.id;
                var selector = `#${elementId} > p`;
                document.querySelector(selector).innerHTML = file.name;

                if(elementId === 'zone-1') {
                    files[0] = file;
                } else {
                    files[1] = file;                    
                }

            }
        }
    } else {
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            var file = ev.dataTransfer.files[i];

            var elementId = ev.target.id;
            var selector = `#${elementId} > p`;
            document.querySelector(selector).innerHTML = file.name;

            if(elementId === 'zone-1') {
                files[0] = file;
            } else {
                files[1] = file;                    
            }
        }
    }

    // Pass event to removeDragData for cleanup
    removeDragData(ev)
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function removeDragData(ev) {
    console.log('Removing drag data')

    if (ev.dataTransfer.items) {
        ev.dataTransfer.items.clear();
    } else {
        ev.dataTransfer.clearData();
    }
}

document.getElementById('submit-btn').onclick = sendFiles;

function sendFiles() {
    var formData = new FormData();    
    for(var i = 0; i < files.length; i++) {
        formData.append(`file${i}`, files[i]);
    }
    fetch('/', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => printData(data))
    .catch(error => console.log(error));
}

function printData(data) {
    if(data.similar) {
        document.getElementById('answer').className = 'alert alert-success';
        document.querySelector('#answer > h4').innerHTML = 'The images are similar!';
    } else {
        document.getElementById('answer').className += 'alert alert-warning';
        document.querySelector('#answer > h4').innerHTML = 'The images are not similar :(';
    }
}