const { json } = require('express');
var express = require('express');
var router = express.Router();

//ajax 

const httpMsgs = require('http-msgs');

// url decomposition

// capture d'ecran

const puppeteer = require('puppeteer');


//var http = require('http');

//var url = require('url');

var querystring = require('querystring');

// mysql database

var mysql = require('mysql');
const { resolveNaptr } = require('dns');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ordre"
});



/* GET home page. */
router.get('/', function(req, res, next) {
  // la liste des produits 
 
  var list_prod ;

  let list_products = "SELECT * FROM produits";

  console.log(list_products);
  
  con.query(list_products, function (err, result, fields) {
    if (err) {
      //console.log(err);
      console.log("fama 8alta");
    }

    else{

      if(result==""){
        //alert("email or password incorrect !")
        console.log("pas de produits !");
      }
      else{
        console.log(result);
    console.log("il y a des produits ");

       
    console.log("-------------- list --------------------");
    console.log("longeur de list = " + result.length);
    console.log("-----------------------------------");

    // set this result in global var 

    var i ;
    for( i=0;i<result.length;i++){
      console.log("-------------- var global --------------------");
    console.log("nom = " + result[i]['nom'] );
    console.log("-----------------------------------");
    }

    res.render('index.twig',{products:result});
       
      }
    }
  });


   // res.render('index.twig',prod:{})
   

});

// login page 

router.get('/login', function(req, res, next) {
  //__dirname : It will resolve to your project folder.
  //res.sendFile(path.join(__dirname+"/index.html"));

  // test login with mysql database in login route 

   
    res.render('login.twig');

});




// routesubmit login btn 

router.post('/log', function(req, res, next) {
  
  let user = "SELECT * FROM users WHERE email =  '" + req.body.email + "' AND password = '" + req.body.password+"'" ;

  console.log(user);
  
  con.query(user, function (err, result, fields) {
    if (err) {
      //console.log(err);
      console.log("fama 8alta");
    }

    else{

      if(result==""){

        //alert("email or password incorrect !");

        console.log("user de email = " + req.body.email + " nexiste pas !");
        res.redirect('/login');
      }
      else{
        
        console.log(result);
    console.log("le user avec email = " + req.body.email +" existe ");
      res.redirect('/');

      }

    }
    
  });
});



// sign up page


router.get('/signup', function(req, res, next) {
  //__dirname : It will resolve to your project folder.
  //res.sendFile(path.join(__dirname+"/index.html"));

  /** 
  con.query("SELECT * FROM ordres", function (err, result, fields) {
    if (err) console.log(err);
    console.log(result);
  });

  // test INSERT INTO with mysql database

  var sql = "INSERT INTO ordres (id, message_ordre) VALUES (14, 'insert from nodejs')";
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("1 record inserted");
});

    // test UPDATE in mysql database in signup 

    var sql = "UPDATE ordres SET message_ordre = 'update from node js again' WHERE id = 13";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });

  */

    res.render('sign_up.twig');

});



// routesubmit signup btn 

router.post('/sign', function(req, res, next) {
  
  var email = req.body.email ;
  var password = req.body.password ; 

  var repeat_password = req.body.pass ;

  var post_user = "INSERT INTO users (email,password) VALUES ('"+email+"', '"+password+"')";

  console.log(post_user);
  
  con.query(post_user, function (err, result, fields) {
    if (err) {
      //console.log(err);
      console.log("fama 8alta");
    }

    else{

      if (password.toString() == repeat_password.toString() ){
        console.log("les 2 password miglin");
        console.log(result);
    console.log("le user : " + req.body.username +" avec email = " + req.body.email +" bien inscrit ");
      res.redirect('/');
      }

      else{

        console.log("les 2 passwords mehomch kifkif ");
        console.log("pass1 = "+ password.toString() + " #diff# pass2 = " + repeat_password.toString() );
        res.redirect('/signup');

      }


    }
    
  });
});



// chercher la categorie avec ajax 
// ajax function 


router.post('/ajax_cat', function(req, res, next) {
  // la liste des produits 

  var categorie = req.body.selectedCat;

  console.log("************** categorie *****************");

  console.log(categorie);

  console.log("******************");

  let req_cat = "SELECT * FROM produits WHERE CATEGORIE = '"+categorie+"'";

  con.query(req_cat, function (err, result, fields) {
    if (err){
      console.log(err);
    } 
    else{
      console.log("//////////////////////////");

      console.log(result);

      console.log("///////////////////////////");

      res.render('index.twig',{products:result});

      //res.render('login.twig');

    }
    
  });

    //res.send("wawah");

   // res.render('index.twig',prod:{})
   

});



// detail product route

router.get('/detail', function(req, res, next) {

  //get id 

  var id_req = req.query.id ;

  var id = String(id_req);

  console.log("id ======="+id );

  let req_cat = "SELECT * FROM produits WHERE id = "+id ;

  console.log(req_cat);

  con.query(req_cat, function (query_err, result, fields) {
    if (query_err){
      console.log(" *********** mouch mrigl");
    } 
    else{
      console.log("************* mrigl");
      console.log(result);
      res.render("detail.twig",{product:result});
    }
  });

  

});


// ajouter au panier route 


router.get('/ajouter_panier', function(req, res, next) {

    // id deu prod 

    
   var id_req = req.query.id ;

   var id = String(id_req);

    console.log("*-*-*-*-*-*-*-**-*-");
  
    console.log("ajouter produit d'id ======="+id );

    console.log("*-*-*-*-*-*-*-*-*");



    // partie d'ajout d'un produit

    // etape 1 : recuperer le produit 'id' qu'ont va ajouté

    let prod = "SELECT * FROM produits WHERE id ="+id ;

    con.query(prod, function (err, result, fields) {
      if (err){
        console.log(err);
      } 
      else{
        console.log("le produit qu'on va ajouté == ");
        console.log(result);

        console.log("+ + + + + + + + + + + + + + + +");

        console.log("nom du prod = " + result[0]['nom']);

        console.log("prix du prod = " + result[0]['prix']);
        

        // aprés la recuperation de produit qu'on va ajouté 
        // etape 2 : inserer "ajouter" le produit dans le panier

        
        var insert_prod = "INSERT INTO panier (nom,prix,photo,date,categorie) VALUES ('"+result[0]['nom']+"', '"+result[0]['prix']+"', '"+result[0]['photo']+"', '"+result[0]['date']+"', '"+result[0]['categorie']+"')";
          con.query(insert_prod, function (err, result) {
            if (err) throw err;
            console.log("vous avez ajouté 1 produit au panier");
          }); 

          
      }
      
    });

    res.redirect('/');

  
});



// fonction pour calculer le nbr des lignes dans le tabme panier 


router.get('/nbr_prod_panier', function(req, res, next) {

  
  con.query("SELECT COUNT(*) AS 'c' from panier", function (err, result, fields) {
    if (err){
      console.log(err);
    } 
    else{
      var nbr_prod = String(result[0]['c']);
      console.log(".........................");
      console.log(result);
      console.log("nbr = " + nbr_prod);
      if(nbr_prod > 0 ){
        res.send(nbr_prod);
        res.end();
      }
      else{
        console.log("pas de prod dans le panier") ;
        res.end();
      }
     
      //res.end();
    }
  });


});





// votre panier 

router.get('/panier', function(req, res, next) {

  // recuperer le liste des produits dans la commande  'panier'

  con.query("SELECT * FROM panier", function (err, result, fields) {
    if (err){
      console.log(err);
    } 
    else{
      console.log(result);
      res.render("panier.twig",{products:result});
    }
    
  });


  // route delete prod from  

  router.get('/deleteprod', function(req, res, next) {


    var id = req.query.id ;

    console.log("delete 'id' = " + id ) ;

    // delete with this id 

    let sql = "DELETE FROM panier WHERE id = "+id ;

    con.query(sql, function (err, result, fields) {
      if (err){
        console.log(err);
      } 
      else{

        con.query("SELECT * FROM panier", function (err, result, fields) {
          if (err){
            console.log(err);
          } 
          else{
            console.log(result);
            res.render("panier.twig",{products:result});
          }

      });

    }
     
    });

  });


  // route de la commande 

  
  router.get('/commande', function(req, res, next) {

    
    // generer un pdf contient la page de panier .

    // etape 1   : capture d'ecran 

    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setViewport({
        width: 1200,
        height: 1200,
        deviceScaleFactor: 1,
      });
      await page.goto('http://localhost:2021/panier/');
      await page.screenshot({ path: 'panier.png' });
    
      await browser.close();
    })();

    // etape 3 : confirmer votre mail

    res.render('confirm_mail.twig');


  });

  // mail function



  function send_mail(destinataire){

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({

      service:'gmail',
      auth:{
        user:'amindridi447@gmail.com',
        pass:'Kaki1112'
      }

    });

    var mailoptions = {
      from:'amindridi447@gmail.com',
      to:destinataire,
      subject:'facture de votre panier sur notre e-shop',
      text:'c est votre commande sur notre site Mr ... , Merci',
      attachments:[
        { filename :'panier.PNG',path:'./panier.PNG' }
    ]
      
    };

    transporter.sendMail(mailoptions,function(error,info){

      if(error){
        console.log(error);
      }
      else{
        console.log("----> email sent to " + destinataire ) ;
      }

    });


  }



  // mail route

  router.post('/mail', function(req, res, next) {

    // delete all produits in panier tab .

    var votre_mail = req.body.email ;

    console.log("votre mail ===== " + votre_mail ) ;



    // etape 1 : verifier le mail est correcte ou non .



    // etape 2 : envoi le mail to .....


    send_mail(votre_mail);

    // delete all prod in panier 

    
    let sql_delete = "DELETE FROM panier" ;

    con.query(sql_delete, function (err, result, fields) {
      if (err){
        console.log(err);
      } 
      else{
        console.log("panier vide ");


        let list_products = "SELECT * FROM produits";

        //console.log(list_products);
        
        con.query(list_products, function (err, result, fields) {

          if (err) {
            console.log(err);
            console.log("fama 8alta");
          }

          else{
            res.render('index.twig',{products:result});
          }
            
          });

      }

    });




    


  });



});

module.exports = router;
