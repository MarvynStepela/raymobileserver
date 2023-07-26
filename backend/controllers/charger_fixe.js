import fs from "fs";
import { db } from "../config/Database.js";




export const addCharge = async (req, res) => {
  try {
    var sql = `INSERT INTO charge_vehicule(immatriculation, montant_charge, libelle_charge, date_charge, userID, tutelle) 
    VALUES("${req.body.immatriculation}", "${req.body.montant_charge}","${req.body.libelle_charge}", "${req.body.date_charge}", "${req.body.userID}", "${req.body.tutelle}")`;
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length == 1) {
        var sqlDepense = `INSERT INTO depense(auteur, motif_depense, date_depense, montant_depense, id_type_depense, enregistrement, userID) 
        VALUES("${req.body.immatriculation}", "${req.body.montant_charge}","${req.body.libelle_charge}", "${req.body.date_charge}", "${req.body.userID}", "${req.body.tutelle}")`;
        return res.status(200).send({
          msg: "Entretien préventif ajouté avec succès",
          code: 100,
        });
      }
    });
  } catch (error) {
    return res.status(203).send({
      msg: "Impossible d'ajouter cet entretien",
      code: 101,
    });
  }
};