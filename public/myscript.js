function checkInput(id)
{
    var input = document.getElementById(id).value;
    if (input.toLowerCase() != 'male' && input.toLowerCase() != 'female' && input.toLowerCase() != "non-binary"){
        window.alert("Error: Gender field only accepts Male, Female, or Non-binary.");
    }
}

function changeColor(id){
    var dob = document.getElementById(id).value;
    if(dob){
        document.getElementById(id).style.color = 'black';
    }else{
        document.getElementById(id).style.color = 'gray';
    }
    
}

