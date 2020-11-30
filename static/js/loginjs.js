document.addEventListener('DOMContentLoaded',() => {
	let myform = document.createElement('FORM');
	let input_submit = document.createElement("input"); //input element, Submit button
	let newuserbutton = document.createElement("input"); //input element, Submit button
	let input_username = document.createElement("input"); //input element, text
	let loginDiv= document.querySelector('#login');

	myform.id='loginform';
	myform.method = "post";
	myform.action = "/"

	input_username.type="text";
	input_username.name='form_username';
	input_username.required = true;
	input_username.placeholder="Enter username";
	// create form submit
	input_submit.type="submit";
	input_submit.value="Submit";
	// new user button
	newuserbutton.type="button";
	newuserbutton.name="newuser";
	newuserbutton.value="new user";
	newuserbutton.onclick = () => {
		document.querySelector('h1').innerHTML = `Welcome to chatroom!`;
		input_username.value = "";
		input_username.disabled = false;
		input_username.hidden = false;
		myform.removeChild(newuserbutton);
		localStorage.removeItem("username");
		input_submit.disabled = true;
	}
	input_username.onkeyup = () => {
	if (input_username.value.length > 0 ) {
			input_submit.disabled = false;
			}
	else {
			input_submit.disabled = true;
			}
	}
	myform.appendChild(input_username);
	myform.appendChild(input_submit);

	if (localStorage.getItem("username") === null) {
			input_submit.disabled = true;
	}
	else {
			input_username.hidden = true;
			input_username.value = localStorage.getItem("username");
			myform.insertBefore(newuserbutton,input_submit);
			document.querySelector('h1').innerHTML = `Welcome ${localStorage.getItem("username")}!`;
	}

	loginDiv.append(myform);
	myform.onsubmit = () => {
			localStorage.setItem("username",input_username.value);
	}

});
