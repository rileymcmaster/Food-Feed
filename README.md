# FOOD FEED

Food Feed started as my final project for Concordia’s full stack web development bootcamp, which I graduated from in April 2021. The objective was to build an interactive site with a frontend and a backend using React.js and Node. I also used Redux, Express, Mongoose and MongoDB.

**Food Feed** is a social networking site where users can easily modify and share recipes. Users have the option of creating recipes from scratch or they can simply edit any recipe in their feed with the click of a button. Change the ingredients, directions and even link specific ingredients to individual steps to suit your own taste!

![Food feed demo](https://github.com/rileymcmaster/recipe-app/blob/main/client/public/FF-screencap.gif?raw=true)

## Design/UI
FF was designed with simplicity in mind and minimal handling of your smartphone/tablet while following a recipe. Easily follow along through the directions, with the relevant ingredients displayed on each step so you don’t have to keep scrolling back and forth between the different sections. While scrolling, each page snaps into place so that the user can easily navigate without having to be very precise.

## Interaction
When viewing a recipe, the user can click on the pen icon they can then edit any ingredient or direction, link/unlink any ingredients to a particular step, add and delete ingredients and add and remove whole steps in the directions. Once they are done editing, they can press the checkmark to name their creation and submit it.

## User
The user sign-up and sign-in system is custom built. When signing-up, an encrypted password is stored in the server and there is a check for unique username and email. When signing-in, there are separate errors to warn if no email matches and if the password is incorrect.
