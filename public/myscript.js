function checkInput(id)
{
    var input = document.getElementById(id).value;
    if (input.tolowercase != 'male' && input.tolowercase != 'female' && input.towerlowercase != "non-binary"){
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

