# DEPRECATED: THIS PROJECT IS NO LONGER MAINTAINED



# Welcome to YETI-Stack

YETI-Stack is a Foundation for Apps powered Fullstack.

## Features
<ul>
	<li>stateless authentication via JWT</li>
	<li>rolebased Authorization</li>
	<li>modular frontend and backend</li>
	<li>optional use of frontmatter</li>
	<li>signup for users</li>
	<li>forgot password function</li>
	<li>responsive emails with ZURB-INK and handlebars templates </li>
	<li>configurable for different enviroments with .env files</li>
	<li>fast and easy builtprocess with gulp</li>
	<li>automatic annotation of Angularcontrollers</li>
	<li>stylesheets compiled with  lightning fast gulp-sass</li>
	<li>livereload in development</li>
</ul>

## Requirements

You'll need the following software installed to get started.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [MongoDB](http://www.mongodb.org/):Use the installer for your OS.
  * [Git](http://git-scm.com/downloads): Use the installer for your OS.
    * Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
  * [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `[sudo] npm install -g gulp bower`


## Get Started
<ol>
	<li><code>git clone https://github.com/webnugget/yeti-stack.git </code></li>
	<li><code>cd ./yeti-stack</code></li>
	<li><code>npm install</code></li>
	<li><code>bower install</code></li>
	<li>rename default.env to .env <br>
	and fill in your enviromentvariables</li>
	<li><code>npm start</code></li>
	<li>open <a href="http://localhost:3000">http://localhost:3000</a> in your browser</li>
</ol>

## Create Admin-User
To create an administrative Account just run the following command from the project-root.

```node createAdmin.js username password email```

and replace username password and email with your account Details.

## Example
[yeti-stack.webnugget.de](https://yeti-stack.webnugget.de)



