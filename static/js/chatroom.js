document.addEventListener('DOMContentLoaded',() => {
	var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port )
	let add_chat = document.querySelector("#add_chat");
	let chat_content = document.querySelector('#chat_content');
	add_chat.disabled = true;
	chat_content.onkeyup = () => {
	if (chat_content.value.length > 0 )
		add_chat.disabled = false;
	else
		add_chat.disabled = true;
	}

socket.on('connect', () => {
		add_chat.onclick = () => {
				if (chat_content.value.length > 0 ) {
						socket.emit('newchat', chat_content.value);
						chat_content.value="";
					};
				};});
 socket.on('newmessage', data => {
	 	 let newli = document.createElement("li");
		 let chats = document.querySelector("#chats");
		 newli.innerHTML = `${data.username} wrote ${data.message} `;
		 chats.appendChild(newli);
 });




});
