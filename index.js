const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let patients = new Object();
patients["JW983613J"] = ["Jensen", "Watkins", "020-7985-7249"]
patients["PB673285M"] = ["Patrick", "Bartholomew", "020-7985-4265"]
patients["TH263947S"] = ["Tom", "Hope", "020-8985-2982"]
patients["SL278491C"] = ["Sam", "Lost", "020-8985-2914"]

let records = new Object();
records["JW983613J"] = "Status: Healthy"
records["PB673285M"] = "Status: Slight Cold"
records["TH263947S"] = "Status: Sick"
records["SL278491C"] = "Status: Extremely Unwell"

// Get patient medical records
app.get("/", (req, res) => {
    
    // Verify Patient Exists
    if (records[req.headers.nin] === undefined) {
        res.status(404).send({"msg":"Patient not found."})
        return;
    }
    
    // Verify NIN (National Insurance Number) matches first and last Name
    if (req.headers.firstname == patients[req.headers.nin][0] && req.headers.lastname == patients[req.headers.nin][1]) {
        if (req.body.reasonforvisit === "medicalrecords") {
            // return medical records
            res.status(200).send(records[req.headers.nin]);
            return;
        }
        else {
            // return error
            res.status(501).send({"msg":"Unable to complete request at this time: " + req.body.reasonforvisit})
            return;
        }
    }
    else {
        res.status(401).send({"msg":"First or last name didn't match NIN."})
        return;
    }

    // Return Appropriate Record
    res.status(200).send({"msg": "HTTP GET - SUCCESS!"});
});

// Create a new patient
app.post("/", (req, res) => {
    
    // Create patient in database
    patients[req.headers.nin] = [req.headers.firstname, req.headers.lastname, req.headers.phonenumber]
    res.status(200).send(patients)
});                                                                                                                                                                                                         

// Update existing patient phonenumber
app.put("/", (req, res) => {
    
    // Verify Patient Exists
    if (records[req.headers.nin] === undefined) {
        res.status(404).send({"msg":"Patient not found."})
        return;
    }

    if (req.headers.firstname == patients[req.headers.nin][0] && req.headers.lastname == patients[req.headers.nin][1]) {
        // Update the phonenumber and return the patient info
        patients[req.headers.nin] = [req.headers.firstname, req.headers.lastname, req.body.phonenumber];
        res.status(202).send(patients[req.headers.nin]);
        return;
    }
    else {
        res.status(401).send({"msg":"First or last didn't match nin. (Trying to update phonenumber)"})
        return;
    }

});

// Delete patient records
app.delete("/", (req, res) => {

    // Verify Patient Exists
    if (records[req.headers.nin] === undefined) {
        res.status(404).send({"msg":"Patient not found."})
        return;
    }
    
    // Verify NIN (National Insurance Number) matches first and last Name
    if (req.headers.firstname == patients[req.headers.nin][0] && req.headers.lastname == patients[req.headers.nin][1]) {
        // Delete patient and medical records from database

        delete patients[req.headers.nin]
        delete records[req.headers.nin]
        
        res.status(200).send({"msg": "successfully deleted patient and medical records."});
        return;
    }
    else {
        res.status(401).send({"msg":"First or last didn't match NIN. (Trying to delete)"})
        return;
    }

});

app.listen(3000);