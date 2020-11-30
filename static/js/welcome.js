document.addEventListener('DOMContentLoaded',() => {
	var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port )
	let myform = document.querySelector('#backform');
	let createChatroomBtn = document.querySelector("#createchatroombtn");
	let newChatroomName = document.querySelector('#chatroomname');
  let all_links = document.querySelectorAll('a');


	createChatroomBtn.disabled = true;
	newChatroomName.onkeyup = () => {
	if (newChatroomName.value.length > 0 )
		createChatroomBtn.disabled = false;
	else
		createChatroomBtn.disabled = true;
	};

socket.on('connect', () => {
		createChatroomBtn.onclick = () => {
						socket.emit('newchatroom', newChatroomName.value);
						newChatroomName.value="";
				};});

 socket.on('newchatroomadded', data => {
	 	 let chatrooms = document.querySelector("#chatrooms");

		 let newli = document.createElement("li");
		 let newlink = document.createElement("a");

		 newlink.href="/chatrooms/"+data.chatroomname;
		 newlink.innerHTML = `${data.username} by ${data.chatroomname}`;
		 newli.appendChild(newlink);
		 chatrooms.appendChild(newli);
 });


 	function storelink(chatroom) {
 		localStorage.setItem("chatroom",chatroom);
 	}


});
