import {LightningElement} from 'lwc';
import {loadScript} from "lightning/platformResourceLoader";
import JSPDF from '@salesforce/resourceUrl/jspdf';
import getContacts from '@salesforce/apex/PdfGenerator.getContactsController';


export default class JspdfDemo extends LightningElement {
   contactList = [];
   headers = this.createHeaders([
       "Id",
       "FirstName",
       "LastName"
   ]);


   renderedCallback() {
       Promise.all([
           loadScript(this, JSPDF)
       ]);
   }


   generatePdf(){


       const { jsPDF } = window.jspdf;
       //default construct
       const pdf = new jsPDF({
           encryption: {
               userPermissions: ["print", "modify", "copy", "annot-forms"]
           },
           orientation: "portrait"
          
          
       })


       pdf.setFontSize(22)
       pdf.text("Here is your PDF Report!", 20, 20);
       pdf.setFontSize(16)
       pdf.table(10, 10, this.contactList, this.headers, { autosize:true });


       // NEED TO WORK ON HOW TO JUST DISPLAY THE PDF, NOT SAVE
       //pdf.fromHTML($('#pdf').get(0), 10, 10, {'width': 180});
       //pdf.autoPrint();
       //pdf.output("dataurlnewwindow");
       //this.template.querySelector('iframe').contentWindow.postMessage(pdf.output('datauristring').split(',')[1], window.location.origin);
       //this.template.querySelector('iframe').contentWindow.postMessage(this.pdfData, window.location.origin);
       //this.template.querySelector(".pdfFrame").contentWindow.postMessage(pdf.output('datauristring').split(',')[1], window.location.origin);



       // to save the pdf
       pdf.save("MyPDF.pdf");

   }


   generateData(){
       getContacts().then(result=>{
          
           this.contactList = result;
           this.generatePdf();
       });
   }


   createHeaders(keys) {
       var result = [];
       for (var i = 0; i < keys.length; i += 1) {
           result.push({
               id: keys[i],
               name: keys[i],
               prompt: keys[i],
               width: 65,
               align: "center",
               padding: 0
           });
       }
       return result;
   }

}
