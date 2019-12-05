const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

//
// Read JSON Files
//
let accounts = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./data/accounts.json")));
let restaurants = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./data/restaurants.json")));

//
// Initialize Server And Related Packages
//
let app = express();
let server = app.listen(3002, console.log("The server is listening on port 3002."));
app.use(express.static("client"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

//
// Handle Methods From Client
//
app.get("/accounts", getAccounts);
app.get("/restaurants", getRestaurants);
app.get("/emails", getEmails);
app.post("/accounts", postAccount);
app.post("/items", postItem);
app.put("/accounts", updateAccount);

//
// Handler Callback Functions
//
function getAccounts(request, response)
{
    response.send(accounts);
    return;
}

function getRestaurants(request, response)
{
    response.send(restaurants);
    return;
}

function getEmails(request, response)
{
    let emails = [];

    for (i in accounts)
    {
        emails.push(accounts[i].email);
    }

    response.send(emails);
    return;
}


function postAccount(request, response)
{
    let account = request.body;
    
    accounts.push(account);
    fs.writeFile(path.resolve(__dirname, "./data/accounts.json"), JSON.stringify(accounts, null, 2), () => {console.log("Wrote new account.")});
    return;
}

function postItem(request, response)
{
    let item = request.body.item;
    let restaurantId = request.body.restaurantId;
    
    for (i in restaurants)
    {
        if (restaurants[i].id == restaurantId)
        {
            restaurants[i].items.push(item);
            fs.writeFile(path.resolve(__dirname, "./data/restaurants.json"), JSON.stringify(restaurants, null, 2), () => {console.log("Added menu item.")});
            return;
        }
    }


    accounts.push(account);
    fs.writeFile(path.resolve(__dirname, "./data/accounts.json"), JSON.stringify(accounts, null, 2), () => {console.log("Wrote new account.")});
    return;
}

function updateAccount(request, response)
{
    let account = request.body;

    for (i in accounts)
    {
        if (accounts[i].id == account.id)
        {
            accounts[i] = account;
            fs.writeFile(path.resolve(__dirname, "./data/accounts.json"), JSON.stringify(accounts, null, 2), () => {console.log("Updated account.")});
            return;
        }
    }

    return;
}