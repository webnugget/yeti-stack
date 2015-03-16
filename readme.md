#Welcome to FAPP-Stack
FAPP-Stack is based on Foundation for Apps.

##Features
<ul>
	<li>authentication via JWT</li>
	<li>rolebased authorization</li>
	<li>modular AngularJS frontend</li>
	<li>restrict routes via ui-router config or frontmatter</li>
	<li>livereload in developmentmode</li>
</ul>
## Requirements

You'll need the following software installed to get started.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [MongoDB](http://www.mongodb.org/):Use the installer for your OS.
  * [Git](http://git-scm.com/downloads): Use the installer for your OS.
    * Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
  * [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `[sudo] npm install -g gulp bower`


##Installation
<ul>
	<li>clone this repository</li>
	<li>cd ./fapp-stack</li>
	<li>npm install</li>
	<li>bower install</li>
	<li>rename default.env to .env <br>
	and fill in your enviromentvariables</li>
	<li>npm start</li>
	<li>open http://localhost:3000 in your browser</li>
</ul>

##Create Admin-User
To create an administrative Account just run the following command from the project-root.

```node createAdmin.js username password email```

and replace username password and email with your account Details.



