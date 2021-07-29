// c'est la partie admin

// la partie 'locale' de notre boutique .

var express = require('express');
var router = express.Router();

// export le module excel 

const exportToExcel = require('./exportService');

const excel = require('exceljs');

// mysql database

var mysql = require('mysql');
const { resolveNaptr } = require('dns');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ordre"
});







// function from mysql to excel 



// my sql to excel file .

function create_excel_produits(){


  // Create a connection to the database
  const con = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ordre'
     });
      
     // Open the MySQL connection
     con.connect((err) => {
       if (err) throw err;


       // -> Query data from MySQL
       con.query("SELECT * FROM produits", function (err, panier, fields) {

         const jsonpanier = JSON.parse(JSON.stringify(panier));

         console.log(jsonpanier);
         /**
           [ { id: 1, address: 'Jack Smith', age: 23, name: 'Massachusetts' },
           { id: 2, address: 'Adam Johnson', age: 27, name: 'New York' },
           { id: 3, address: 'Katherin Carter', age: 26, name: 'Washington DC' },
           { id: 4, address: 'Jack London', age: 33, name: 'Nevada' },
           { id: 5, address: 'Jason Bourne', age: 36, name: 'California' } ]
         */
      
        

         // creer 1ére sheet -> panier

         let workbook = new excel.Workbook(); //creating workbook

         let worksheet = workbook.addWorksheet('panier'); //creating worksheet
        
         //  WorkSheet Header
         worksheet.columns = [
           { header: 'Id', key: 'id', width: 10 },
           { header: 'Nom', key: 'nom', width: 30 },
           { header: 'Prix', key: 'prix', width: 30},
           { header: 'Photo', key: 'photo', width: 40, outlineLevel: 1},
           { header: 'Date', key: 'date', width: 30, outlineLevel: 1},
           { header: 'Categorie', key: 'categorie', width: 30, outlineLevel: 1}
         ];
        
         // Add Array Rows
         worksheet.addRows(jsonpanier);

         // Write to File
         workbook.xlsx.writeFile("produits.xlsx")
         .then(function() {
           console.log("file produits saved!");
         });

        });
     });
      
  }









  function create_excel_coordinates(){


    // Create a connection to the database
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ordre'
       });
        
       // Open the MySQL connection
       con.connect((err) => {
         if (err) throw err;
  
  
         // -> Query data from MySQL
         con.query("SELECT * FROM coordinates", function (err, panier, fields) {
  
           const jsonpanier = JSON.parse(JSON.stringify(panier));
  
           console.log(jsonpanier);
           /**
             [ { id: 1, address: 'Jack Smith', age: 23, name: 'Massachusetts' },
             { id: 2, address: 'Adam Johnson', age: 27, name: 'New York' },
             { id: 3, address: 'Katherin Carter', age: 26, name: 'Washington DC' },
             { id: 4, address: 'Jack London', age: 33, name: 'Nevada' },
             { id: 5, address: 'Jason Bourne', age: 36, name: 'California' } ]
           */
        
          
  
           // creer 1ére sheet -> panier
  
           let workbook = new excel.Workbook(); //creating workbook
  
           let worksheet = workbook.addWorksheet('coordinates'); //creating worksheet
          
           //  WorkSheet Header
           worksheet.columns = [
             { header: 'Id', key: 'id', width: 10 },
             { header: 'shape Id', key: 'shape_id', width: 30 },
             { header: 'point Id', key: 'point_id', width: 30},
             { header: 'x', key: 'x', width: 40, outlineLevel: 1},
             { header: 'y', key: 'y', width: 30, outlineLevel: 1}
             
           ];
          
           // Add Array Rows
           worksheet.addRows(jsonpanier);
  
           // Write to File
           workbook.xlsx.writeFile("coordinates.xlsx")
           .then(function() {
             console.log("file coordniates saved!");
           });
  
          });
       });
        
    }
  
  
  
  
  
  
  
  

  

  function add_worksheet(workbook,worksheet_name){

   return workbook.addWorksheet(worksheet_name);
  }


  function add_produit_header(worksheet){

    //  WorkSheet Header
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Nom', key: 'nom', width: 30 },
      { header: 'Prix', key: 'prix', width: 30},
      { header: 'Photo', key: 'photo', width: 40, outlineLevel: 1},
      { header: 'Date', key: 'date', width: 30, outlineLevel: 1},
      { header: 'Categorie', key: 'categorie', width: 30, outlineLevel: 1}
    ];
  }

  function add_coordinates_header(worksheet){

    //  WorkSheet Header
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'shape Id', key: 'shape_id', width: 30 },
      { header: 'point Id', key: 'point_id', width: 30},
      { header: 'x', key: 'x', width: 40, outlineLevel: 1},
      { header: 'y', key: 'y', width: 30, outlineLevel: 1}
    ];
  }



  function data(workbook,table){

    con.query("SELECT * FROM "+table, function (err, result, fields) {

      if(err){
        console.log(err);
      }
      else{

        var worksheet = add_worksheet(workbook,table);

        add_produit_header(worksheet) ;

       worksheet.addRows( JSON.parse(JSON.stringify(result)) ) ;

      }



    });

  }

  function test_excel_finale(){

    let workbook = new excel.Workbook(); //creating workbook
    // json data

    data(workbook,'produits') ; 

    workbook.xlsx.writeFile("test.xlsx")
    .then(function() {
      console.log("file saved!");
    });

  }


// / users

router.get('/', function(req, res, next){

 
  //create_excel_produits();
 
  //create_excel_coordinates();
 
  res.render('login_locale.twig');
 
 });




// / users/map

router.get('/map', function(req, res, next){

 // create_excel_panier();

 //create_excel_produits();

 //create_excel_coordinates();

 res.render('map.twig');

});




// 3d animation with three.js

//   /users/test3d

router.get('/test3d', function(req, res, next){
 
  res.render('howitworks.twig');
 
 });












module.exports = router;
