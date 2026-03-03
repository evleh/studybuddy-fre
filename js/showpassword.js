function showpassword (inputid) {
    const passwordfield = document.getElementById(inputid);
    if(passwordfield.type === "password") {
        passwordfield.type = "text";
    }
    else {passwordfield.type = "password";}
}
