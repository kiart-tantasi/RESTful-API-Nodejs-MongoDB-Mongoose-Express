// EXPRESS
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MONGOOSE SETUP
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mongooseDB"); // <-- DEFINE NAME OF DATABASE HERE
const itemSchema = mongoose.Schema({ item: String, des: String});
const Item = mongoose.model("Item", itemSchema);

// ROUTES
app.route("/items")

.get((req,res) => {
    Item.find({}, (err,foundItems)=> {
        if (err) {
            console.log(err);
        } else {
            if (foundItems.length === 0) {

                const defaultItems = [
                    {item: "Item 1", des: "Testing1"},
                    {item: "Item 2", des: "Testing2"},
                    {item: "Item 3", des: "Testing3"}
                ];
                Item.insertMany(defaultItems, err=> {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Since there were no items, default items were added.")
                        res.redirect("/items");
                    }
                })
            } else {
                res.send(foundItems);
            }
        }
    });
})

// DELETE ALL ITEMS
.delete((req,res) => {
    Item.deleteMany((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("All Items were Deleted.")
            res.sendStatus(200);
        }
    })
})

// ADD A NEW ITEM
.post((req,res) => {
    const item = req.body.item;
    const des = req.body.des;
    const saveNewItem = new Item({
        item: item,
        des: des
    });
    saveNewItem.save((err) => {
        if (err){
            console.log(err);
        } else {
            res.sendStatus(200);
        }
    });
    
})

// ---------------- specific items ---------------- //

app.route("/items/:itemId")

//GET SPECIFIC ITEM
.get((req,res) => {
    const itemId = req.params.itemId;
    Item.findOne({_id: itemId}, (err, result)=> {
        if (err) {
            console.log(err);
        } else if (result) {
            res.send(result)
        } else if (result.length === 0 || result === null) {
            res.send("No Matching Item.")
        }
    })
})

// DELETE SPECIFIC ITEM
.delete((req,res)=> {
    const itemId = req.params.itemId;
    Item.deleteOne({_id: itemId}, err => {
        if (err) {
            console.log(err);
        } else {
            console.log("One Specific Item was Deleted.")
            res.sendStatus(200);
        }
    })
})

// UPDATE THE WHOLE THING
.put((req,res) => {
    if (!req.body.item || !req.body.des) {
        res.sendStatus(403);
    } else {
        const itemId = req.params.itemId;
        const newName = req.body.item;
        const newDes = req.body.des;
        Item.findOneAndUpdate(
            {_id: itemId},
            {item:newName, des:newDes},
            {overwrite:true},
            (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("One specific item was put.");
                    res.sendStatus(200);
                }
            }
        )
    }
})

// UPDATE ONLY DESCRIPTION
.patch((req,res) => {
    const itemId = req.params.itemId;
    const newDes = req.body.des;

    Item.findOneAndUpdate(
        {_id: itemId},
        {des: newDes},
        (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("One specific item was patched.");
                res.sendStatus(200);
            }
        }
    )
});

const port = process.env.port || 3000;
app.listen(port, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Running on", port);
    }
})