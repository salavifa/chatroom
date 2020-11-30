import os
from flask_session import Session
from flask import Flask, render_template, request, url_for, redirect, flash, session, send_from_directory, request, jsonify
from flask_socketio import SocketIO, emit
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
socketio = SocketIO(app)
global all_users, chatrooms
chatrooms = {}
chats = {}

@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "GET":
        session["logged_in"] =  False
        return render_template("index.html")
    else:
        username = request.form.get("form_username")
        if username is None:
            flash("You did not enter a username")
            return render_template("index.html")
        else:
            session['username']=username

            session["logged_in"] = True
            return redirect(url_for("welcome"))


@app.route("/welcome", methods=["GET","POST"])
def welcome():
    if session.get("logged_in", False) is False or session.get('username',None) is None:
        flash("You need to login first")
        return redirect(url_for("index"))
    else:
        if request.method == "POST":
            if request.form["btn"]=="Back":
                return redirect(url_for("index"))
            elif request.form["btn"]=="Refresh":
                return render_template("welcome.html", session=session, chatrooms=chatrooms)
            elif request.form["btn"]=="Back to mainpage":
                session['chatroom'] = None
                return render_template("welcome.html", session=session, chatrooms=chatrooms)

        elif session.get('chatroom',None) is not None:
            return redirect(url_for("getchatrooms",chatroom=session['chatroom']))
        return render_template("welcome.html", session=session, chatrooms=chatrooms)


@app.route("/chatrooms/<chatroom>", methods=["GET"])
def getchatrooms(chatroom):
        if session.get("logged_in", False) is False or session.get('username',None) is None:
            flash("You need to login first")
            return redirect(url_for("index"))
        else:
            if chatroom not in chats:
                chats[chatroom] = []
            session['chatroom']=chatroom
            return render_template("chatroom.html", session=session, chats= chats[chatroom])



@socketio.on("newchat")
def addmessage(message):
    chats[session['chatroom']].append((session['username'],message))
    chats[session['chatroom']]=chats[session['chatroom']][-99:]
    emit("newmessage", {"username":session['username'],"message":message}, broadcast=True)

@socketio.on("newchatroom")
def addchatroom(chatroom):
    if chatroom not in chatrooms.keys():
        chatrooms[chatroom]=session['username']
        chats[chatroom] = []
        emit("newchatroomadded", {"username":session['username'],"chatroomname":chatroom}, broadcast=True)
    else:
        flash("chatroom already exists")

if __name__ == '__main__':
    socketio.run(app, debug=True, host="127.0.0.1", port=5000)
