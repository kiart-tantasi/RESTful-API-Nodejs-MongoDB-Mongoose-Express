const express = require("express");
const mongoose = require("mongoose");
const bP = require("body-parser");

const app = express();

app.use(bP.urlencoded({extended:false}));
app.use(bP.json());

mongoose.connect("mongodb://localhost:27017/testDB");

const itemSchema = {
    item: String,
    des: String
};

const Item = mongoose.model("Item",itemSchema);

app.get("", function(req,res) {
    console.log("Redirected to /items")
    res.redirect("/items");
})

app.route("/items")

.get((req,res) => {

    Item.find((err,foundItems)=> {
        if(!err) {
            if (foundItems.length === 0) {

                const defaultItems = [{
                    item: "Testing",
                    des: "For Testing."
                }, {
                    item: "Testing2",
                    des: "For Testing 2."
                }, {
                    item: "Testing3",
                    des: "For Testing 3."
                }];

                Item.insertMany(defaultItems, err=> {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Default Added.")
                    }
                })

                res.send("No Items. Please Refresh to See the Default Items that were Just Added in 'GET'.")

            } else {
                res.send(foundItems);
            }
        } else {
            res.send(err);
        }
    });
})

.delete((req,res) => {
    Item.deleteMany(err => {
        if (!err) {
            res.redirect("/items");
            console.log("All Items were Deleted.")
        } else {
            res.send(err);
        }
    })
})

.post((req,res) => {

    const saveNewItem = new Item({
        item: req.body.item,
        des: req.body.des
    });

    saveNewItem.save(err => {
        if (!err){
            res.redirect("/items");
        } else {
            res.send(err);
        }
    });
    
})

// ---------------- specific items ---------------- //

app.route("/items/:itemName")

.get((req,res) => {
    Item.findOne({item: req.params.itemName}, (err,foundItem)=> {
        if(!err && foundItem) {
            res.send(foundItem)
        } else if (!foundItem) {
            res.send("No Matching Item.")
        } else {
            res.end(err)
        }
    })
})

.delete((req,res)=> {
    Item.deleteOne({item: req.params.itemName}, err => {
        if (!err) {
            console.log("One Specific Item was Deleted.")
            res.redirect("/items");
        }
    })
})

.put((req,res) => {
    if (!req.body.item || !req.body.des) {
        res.send("Please define new item name and description.")
        return;
    }
    const newName = req.body.item;
    Item.findOneAndUpdate(
        {item:req.params.itemName},
        {item:newName, des:req.body.des},
        {overwrite:true},
        (err,results) => {
            if (!err) {
                res.redirect("/items/" + newName);
                console.log("One Specific Item was Updated with 'PUT'.");
            } else {
                res.send(err);
            }
        }
    )
})

.patch((req,res) => {

    Item.findOneAndUpdate(
        {item: req.params.itemName},
        {item: req.body.item, des: req.body.des},    // $set{req.body}
        err => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/items/" + req.params.itemName);
                console.log("One Specific Item was Updated with 'PATCH'.");
            }
        }
    )


});

const port = process.env.PORT || 5000;
app.listen(5000, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`running on PORT ${port}`);
    }
})