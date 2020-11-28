const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require("./middleware/date.js");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/TaskBoard",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify: false });
const itemsSchema = {
    item:String
}
const listSchema = {
    name:String,
    item:[itemsSchema]
}
const List = mongoose.model("List",listSchema);
const Item = mongoose.model("Item",itemsSchema);
const weekDayListItem = mongoose.model("weekDayListItem",itemsSchema);
const weekendDayListItem = mongoose.model("weekendDayListItem",itemsSchema);


const currentDay = date.getDayNumber();
const day_today = date.getDay();
const day = date.getDate();
let page="";
if(currentDay === 6 || currentDay === 0){
    
    page="weekend";
}
else{
    page="weekday";
}


app.get("/",function(req,res){
    List.find({},function(err,foundListName){
        if(err){
            console.log(err);
        }
        else{
            res.render("landing",{listPage:page,listnames:foundListName});
        }
    })
 
});



app.get("/weekday",function(req,res){

 weekDayListItem.find({},function(err,allItems){
     if(err){
         console.log(err);

     }
     else{
        res.render("list",{listPage:page,day:day,today:day_today,lists:allItems})
     }
 })
 
});

app.post("/weekday",function(req,res){
   const newItem =new weekDayListItem( {
       item:req.body.newTask
    });
    weekDayListItem.insertMany(newItem,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Successfully saved Item");
        }
    });
    
   res.redirect("/weekday");
});


app.get("/weekend",function(req,res){
    weekendDayListItem.find({},function(err,allItems){
        if(err){
            console.log(err);
   
        }
        else{
           res.render("list",{listPage:page,day:day,today:day_today,lists:allItems})
        }
    })
});

app.post("/weekend",function(req,res){
  
    const newItem =new weekendDayListItem( {
        item:req.body.newTask
     });
     weekendDayListItem.insertMany(newItem,function(err){
         if(err){
             console.log(err);
         }
         else{
             console.log("Successfully saved Item");
             res.redirect("/weekend");
         }
     })
     
    
 });

 app.post("/delete/weekday",function(req,res){
   const checkBoxItem = req.body.checkbox;
   weekDayListItem.findByIdAndRemove(checkBoxItem,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Week Day Item Deleted")
            res.redirect("/weekday");
        }
   });
 });

 app.post("/delete/weekend",function(req,res){
   const checkBoxItem = req.body.checkbox;
   weekendDayListItem.findByIdAndRemove(checkBoxItem,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Weekend Day Item Deleted")
            res.redirect("/weekend");
        }
   });
 });



 app.get("/:customList",function(req,res){
    const customListname = _.capitalize(req.params.customList);
         List.findOne({name:customListname},function(err,foundlist){
           if(!err){
               if(!foundlist){
                   const newList = List({
                     name:customListname,
                     item:[]
                   });
                   newList.save();
                   res.redirect("/"+customListname);
               }
               else{
                  
                   res.render("list",{listPage:foundlist.name,day:foundlist.name,today:day_today,lists:foundlist.item})
               }
           }
         })
 });
 app.post("/:customList",function(req,res){
    const customListname = _.capitalize(req.params.customList);
    const newItem = new Item({
    item:req.body.newTask
    });
    List.findOne({name:customListname},function(err,foundlist){
        if(err){
            console.log(err);
        }
        else{
          
            foundlist.item.push(newItem);
            foundlist.save();
            console.log("Successfully saved Item");
            res.redirect("/"+customListname);
        }
    })
 });
    app.post("/delete/:customList",function(req,res){
        const customListname = req.params.customList;
        const checkBoxItem = req.body.checkbox;
        List.findOneAndUpdate({name:customListname},{$pull:{item:{_id:checkBoxItem}}},function(err,foundItem){
            if(!err){
                 res.redirect("/"+customListname);
            }
        })
     
});
     
app.listen(2000,function(){
    console.log("Server started at port 2000");
})