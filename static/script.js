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

                var reader = new FileReader();
                reader.onload = function(){
                    var dataURL = reader.result;
                    var output = document.querySelector(`#${elementId} > img`);
                    output.src = dataURL;
                    output.style.opacity = '1';

                    var zone = document.getElementById(elementId);
                    zone.style.border = '2px solid black';
                    zone.style.color = 'white';
                };

                reader.readAsDataURL(file);
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

document.getElementById('submit-btn').onclick = handleSubmit;
document.getElementById('clear-btn').onclick = clearFiles;

function showLoading() {
    document.querySelector('.loader').style.opacity = '1';
    document.getElementById('answer').style.display = 'none';    
}

function hideLoading() {
    document.querySelector('.loader').style.opacity = '0';
    document.getElementById('answer').style.display = 'block';        
}

function handleSubmit() {
    if(validate()) {
        sendFiles();        
    } else {
        showError();
    }
}

function showError() {
    document.querySelector('#answer').style.display = 'none';            
    document.querySelector('#error').style.display = 'block';
    document.querySelector('#error').style.opacity = '1';
    document.querySelector('#error h4').innerHTML = 'Please fill images first';

    setTimeout(function() {
        document.querySelector('#error').style.opacity = '0';

        setTimeout(function() {
            document.querySelector('#error').style.display = 'none';            
        }, 500);
    }, 2000);
}

function validate() {
    return files.length === 2;
}

function sendFiles() {
    showLoading();

    var formData = new FormData();    
    for(var i = 0; i < files.length; i++) {
        formData.append(`file${i}`, files[i]);
    }

    fetch('/', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        printData(data);

        hideLoading();
    })
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

function clearFiles() {
    files = [];

    document.querySelectorAll('.drag-sections .drop-zone .output').forEach(child => {
        child.style.opacity = '0';
    });
    document.querySelectorAll('.drag-sections .drop-zone > img').forEach(child => {
        child.src = '';
    });
    document.querySelectorAll('.drag-sections .drop-zone > p').forEach(child => {
        child.innerHTML = 'Drag Image To Here';  
    }); 
    document.querySelectorAll('.drag-sections .drop-zone').forEach(child => {
        child.style.border = '2px dashed black';
    });
    document.querySelectorAll('.drag-sections .drop-zone').forEach(child => {
        child.style.color = 'black';
    });

    document.querySelector('#answer').style.display = 'none';
}