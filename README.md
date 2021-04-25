# FOOD FEED

Food Feed started as my final project for Concordia’s full stack web development bootcamp, which I graduated from in April 2021. The objective was to build an interactive site with a frontend and a backend using React, Redux and Node.

**Food Feed** is a social networking site where users can easily create recipes to share and other members can then customize and save those recipes to make them their own. Users can easily edit the ingredients, the directions and even link ingredients to the individual steps.
![Food Feed Demo](https://github.com/rileymcmaster/recipe-app/tree/main/client/public/FF-screencap.gif?raw=true)

**Design/UI**
FF was designed with simplicity in mind and minimal handling of your smartphone/tablet while cooking. Easily follow along through the directions, with the relevant ingredients displayed on each step so you don’t have to keep scrolling back and forth between the different sections. While scrolling, each page snaps into place so that the user can easily navigate without having to be very precise.

**Interaction**
When viewing a recipe, the user can click on the pen icon they can then edit any ingredient or direction and link/unlink any ingredients to a particular step. Once they are done editing, they can press the checkmark to name their creation and submit it.

**User**
The user sign-up and sign-in system is custom built. When signing-up, an encrypted password is stored in the server and there is a check for unique username and email. When signing-in, there are separate errors to warn if no email matches and if the password is incorrect.
