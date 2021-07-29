const xlsx = require('xlsx');

const path = require('path');


// mysql to excel file 

const mysql = require('mysql');
const excel = require('exceljs');
 




const exportExcel = (data,workSheetColumnsNames,workSheetName,filepath) => {

const workBook = xlsx.utils.book_new();

const workSheetData = [
    workSheetColumnsNames,
    ... data
];   // workbook est le classeur excel .

const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);

xlsx.utils.book_append_sheet(workBook,workSheetData,workSheetName);

xlsx.writeFile(workBook,filepath );


}



const exportUsersToExcel = (users , workSheetColumnsNames , workSheetName , filepath ) => {

    const data = users.map(user=>{

        return [user.id ,user.name ,user.age] ;

    });

    exportExcel(data,workSheetColumnsNames,workSheetName,filepath);



}





// my sql to excel file .

function create_excel_panier(){


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
     con.query("SELECT * FROM panier", function (err, panier, fields) {
       
       const jsonpanier = JSON.parse(JSON.stringify(panier));
       console.log(jsonpanier);
       /**
         [ { id: 1, address: 'Jack Smith', age: 23, name: 'Massachusetts' },
         { id: 2, address: 'Adam Johnson', age: 27, name: 'New York' },
         { id: 3, address: 'Katherin Carter', age: 26, name: 'Washington DC' },
         { id: 4, address: 'Jack London', age: 33, name: 'Nevada' },
         { id: 5, address: 'Jason Bourne', age: 36, name: 'California' } ]
       */
       
       let workbook = new excel.Workbook(); //creating workbook
       let worksheet = workbook.addWorksheet('panier'); //creating worksheet
      
       //  WorkSheet Header
       worksheet.columns = [
         { header: 'Id', key: '_id', width: 10 },
         { header: 'Nom', key: 'nom', width: 30 },
         { header: 'Prix', key: 'prix', width: 30},
         { header: 'Photo', key: 'photo', width: 10, outlineLevel: 1},
         { header: 'Date', key: 'date', width: 10, outlineLevel: 1},
         { header: 'Categorie', key: 'categorie', width: 10, outlineLevel: 1}
       ];
      
       // Add Array Rows
       worksheet.addRows(jsonpanier);
      
       // Write to File
       workbook.xlsx.writeFile("panier.xlsx")
       .then(function() {
         console.log("file saved!");
       });
       
       // -> Close MySQL connection
       con.end(function(err) {
         if (err) {
         return console.log('error:' + err.message);
         }
         console.log('Close the database connection.');
       });
       
       // -> Check 'customer.csv' file in root project folder
     });
   });
    
}




module.exports = exportUsersToExcel ;