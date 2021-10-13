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
    res.send("Please use route '/items' ")
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

                res.send("No Items, Default Items were Added. Please Refresh to Restore Default Items.")

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
    Item.deleteOne({name: req.params.itemName}, err => {
        if (!err) {
            res.send("One Item was Successfully Deleted.")
        }
    })
})

.put((req,res) => {
    Item.findOneAndUpdate(
        {item:req.params.itemName},
        {item:req.body.item, des:req.body.des},
        {overwrite:true},
        (err,results) => {
            if (!err) {
                res.redirect("/items/" + req.body.item);
            } else {
                res.send(err);
            }
        }
    )
})

.patch((req,res) => {

    Item.findOneAndUpdate(
        {item:req.params.itemName},
        {item: req.body.item, des: req.body.des},
        err => {
            if (err) {
                res.send(err);
            } else {
                res.send("Succuessfully Patched.")
            }
        }
    )

    // $set{req.body}
});

app.listen(3000, function(err) {
    console.log("...Running on 3000.");
    if (err) {
        console.log(err);
    }
})