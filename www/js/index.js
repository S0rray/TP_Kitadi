document.addEventListener('deviceready', onDeviceReady, false);

//var myDBMaison = "";

function onDeviceReady() {

    myDBMaison = window.sqlitePlugin.openDatabase({ name: "KitadiEnergie.db", location: 'default' });

    myDBMaison.transaction(function (transaction) {
      transaction.executeSql('CREATE TABLE IF NOT EXISTS maison (id_maison INTEGER, nom_client VARCHAR(50), prenom_client VARCHAR(50), email_client VARCHAR(50), tel_client  DECIMAL(10,0), adresse_client VARCHAR(150), code_postal_client VARCHAR(5), ville_client VARCHAR(30), power_energy DECIMAL(15,2), date_ajout datetime default current_timestamp, PRIMARY KEY(id_maison));', [],);

  });

  //   myDBMaison.transaction(function (transaction) {
  //     transaction.executeSql('CREATE TABLE IF NOT EXISTS CLIENT (numDossClient(10), nomClient VARCHAR(20), numTelClient INTEGER(10), prenomClient VARCHAR(20), mailClient VARCHAR(40), numVoie INTEGER (3), nomVoie VARCHAR(20), ville VARCHAR(20),departement INTEGER(3)))', [],
  //         function (tx, result) {
  //             alert("La Table a été créé avec succés !!!");
  //         },
  //         function (error) {
  //             alert("Une erreur s'est produite !!!");
  //         });
  //         transaction.executeSql('CREATE TABLE IF NOT EXISTS PIECES (nomPiece,temperature,temperatureConfort,longueur,largeur,isolationPiece))', [],
  //         function (tx, result) {
  //             alert("La Table a été créé avec succés !!!");
  //         },
  //         function (error) {
  //             alert("Une erreur s'est produite !!!");
  //         });
  // });
};


const boutonAjouter = document.getElementById("ajouterUnClient");
const tableContainer = document.getElementById("tableContainer");
const projets = document.getElementsByClassName("projets");

const page1 = document.getElementById("ecran");
const page2 = document.getElementById("p2_container");
let noProjet = 0;

boutonAjouter.addEventListener("click", () => {
  tableContainer.innerHTML += `
  <div class="projets" id="projet${noProjet}">
    <p>Nom client:</p>
    <p>Numéro dossier:</p>
</div>
  `;

  noProjet++;

  for (i = 0; i < projets.length; i++) {
    const projet = document.getElementById(projets[i].id);
    projet.addEventListener("click", () => {
      page1.style.display = "none";
      page2.style.display = "block";
    });
  }
});

// page 2

// ------------
// VARIABLES
// ------------

// Div
const p2Container = document.getElementById("p2_container");
const p2ContainerPieces = document.getElementById("p2_container_pieces");
const p2PiecesInfo = document.getElementsByClassName("p2_pieces_info");

// Boutons
const p2BoutonRetour = document.getElementById("p2_bouton_retour");
const p2BoutonSauvegarder = document.getElementById("p2_bouton_sauvegarder");
const p2BoutonAjouter = document.getElementById("p2_bouton_ajouter");
const p2BoutonsDelete = document.getElementsByClassName("p2_boutons_delete");

// Informations
const p2InputNumero = document.getElementById("p2_input_numero");
const p2InputNom = document.getElementById("p2_input_nom");
const p2InputAdresse = document.getElementById("p2_input_adresse");
const p2InputTelephone = document.getElementById("p2_input_telephone");
const p2InputEmail = document.getElementById("p2_input_email");

// Autre
let p2Id = 0;
let espace = false;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  myDBMaison = window.sqlitePlugin.openDatabase({
    name: "maison.db",
    location: "default",
  });

  myDBPiece = window.sqlitePlugin.openDatabase({
    name: "piece.db",
    location: "default",
  });
}

// -------------------
// EVENTS LISTENERS
// -------------------

// Clic bouton retour
p2BoutonRetour.addEventListener("click", () => {
  page1.style.display = "block";
  p2Container.style.display = "none";
});

// Input nom
p2InputNom.addEventListener("input", () => {
  p2InputNom.value = p2InputNom.value.toUpperCase();
});

// Input téléphone
p2InputTelephone.addEventListener("input", () => {
  p2InputTelephone.value = p2InputTelephone.value.trim();

  // Crée des espaces tous les 2 chiffres
  if (
    p2InputTelephone.value.length == 2 ||
    p2InputTelephone.value.length == 5 ||
    p2InputTelephone.value.length == 8 ||
    p2InputTelephone.value.length == 11
  ) {
    if (espace) {
      p2InputTelephone.value = p2InputTelephone.value.substr(
        0,
        p2InputTelephone.value.length - 1
      );

      espace = false;
    } else {
      p2InputTelephone.value = p2InputTelephone.value + ".";

      espace = true;
    }
  } else if (
    p2InputTelephone.value.length == 3 ||
    p2InputTelephone.value.length == 6 ||
    p2InputTelephone.value.length == 9 ||
    p2InputTelephone.value.length == 12
  ) {
    espace = true;
  } else {
    espace = false;
  }

  // Empêche d'avoir un numéro de plus de 10 chiffres (14 caractères avec les espaces)
  if (p2InputTelephone.value.length > 14) {
    p2InputTelephone.value = p2InputTelephone.value.substr(
      0,
      p2InputTelephone.value.length - 1
    );
  }
});

// Clic bouton sauvegarder
p2BoutonSauvegarder.addEventListener("click", () => {
  let p2NumeroClient = p2InputNumero.textContent;
  let p2Nom = p2InputNom.value;
  let p2Adresse = p2InputAdresse.value;
  let p2Telephone = p2InputTelephone.value;
  let p2Email = p2InputEmail.value;

  myDBMaison.transaction(function (transaction) {
    var executeQuery =
      "UPDATE client SET nom_client=?, adresse_client=?, telephone_client=?, email_client=? WHERE numero_client=?";
    transaction.executeSql(
      executeQuery,
      [p2Nom, p2Adresse, p2Telephone, p2Email, p2NumeroClient],
      //On Success
      function (tx, result) {
        alert("Modification OK !!!");
      },
      //On Error
      function (error) {
        alert("Une erreur s'est produite !!!");
      }
    );
  });
});

// Clic bouton ajouter
p2BoutonAjouter.addEventListener("click", () => {
  let p2NomPiece = "Pièce " + (p2Id + 1);

  p2ContainerPieces.innerHTML += `
      <div class="p2_pieces" id="p2_piece_${p2Id}">
        <div class="p2_pieces_info" id="p2_piece_info_${p2Id}">
          <h2>${p2NomPiece}</h2>
        </div>
       <button class="p2_boutons_delete" id="p2_bouton_delete_${p2Id}">Del</button>
      </div>
    `;

  p2Id++;

  // myDBPiece.transaction(function (transaction) {
  //   var executeQuery = "INSERT INTO piece (nom_piece) VALUES (?)";
  //   transaction.executeSql(
  //     executeQuery,
  //     [p2NomPiece],
  //     function (tx, result) {
  //       alert("Insertion OK !!!");
  //     },
  //     function (error) {
  //       alert("Une erreur s'est produite !!!");
  //     }
  //   );
  // });

  // Clic bouton delete
  for (i = 0; i < p2PiecesInfo.length; i++) {
    const p2PieceInfo = document.getElementById(p2PiecesInfo[i].id);
    const p2BoutonDelClic = document.getElementById(p2BoutonsDelete[i].id);

    p2PieceInfo.addEventListener("click", () => {
      p2Container.style.display = "none";
      AfficherPiece();
    });

    p2BoutonDelClic.addEventListener("click", () => {
      p2BoutonDelClic.parentElement.remove();

      let p2NumeroPiece = p2BoutonDelClic.id.substring(
        p2BoutonDelClic.id.length,
        p2BoutonDelClic.id.length - 1
      );

      myDBPiece.transaction(function (transaction) {
        var executeQuery = "DELETE FROM pieces where id_pieces=?";
        transaction.executeSql(
          executeQuery,
          [p2NumeroPiece],
          //On Success
          function (tx, result) {
            alert("Suppression OK !!!");
          },
          //On Error
          function (error) {
            alert("Une erreur s'est produite !!!");
          }
        );
      });
    });
  }
});

// page 3

// ******************************************************************************************************** //
// ********************************************** Page pièce ********************************************** //
// ******************************************************************************************************** //
// Tableaux de données
var salles = [
  {
      value: "",
      nom: "--Choississez une pièce--",
  },
  {
      value: "hallEntree",
      nom: "Hall d\'entrée",
  },
  {
      value: "cuisine",
      nom: "Cuisine",
  },
  {
      value: "gardeManger",
      nom: "Garde-manger",
  },
  {
      value: "salleManger",
      nom: "Salle à manger",
  },
  {
      value: "salon",
      nom: "Salon",
  },
  {
      value: "salleReception",
      nom: "Salle de réception",
  },
  {
      value: "pieceFamilliale",
      nom: "Pièce familliale",
  },
  {
      value: "solarium",
      nom: "Solarium",
  },
  {
      value: "bureau",
      nom: "Bureau",
  },
  {
      value: "bibliotheque",
      nom: "Bibliotheque",
  },
  {
      value: "salleBains",
      nom: "Salle de bains",
  },
  {
      value: "salleEau",
      nom: "Salle d\'eau",
  },
  {
      value: "buanderie",
      nom: "Buanderie",
  },
  {
      value: "rangement",
      nom: "Pièce de rangement",
  },
  {
      value: "chambreParentale",
      nom: "Chambre parentale",
  },
  {
      value: "chambreEnfant",
      nom: "Chambre d\'enfant",
  },
  {
      value: "chambreBebe",
      nom: "Chambre de bébé",
  },
  {
      value: "chambreAmis",
      nom: "Chambre d\'amis",
  },
  {
      value: "salleJeux",
      nom: "Salle de jeux",
  },
  {
      value: "salleMusique",
      nom: "Salle de musique",
  },
  {
      value: "salleCinema",
      nom: "Salle cinéma",
  },
  {
      value: "salleGym",
      nom: "Salle de gym",
  },
  {
      value: "garage",
      nom: "Garage",
  },
  {
      value: "sousSol",
      nom: "Sous-sol",
  },
  {
      value: "caveVin",
      nom: "Cave à vin",
  },
  {
      value: "grenier",
      nom: "Grenier",
  },
  {
      value: "salleStockage",
      nom: "Salle de stockage",
  },
  {
      value: "cellier",
      nom: "Cellier",
  },
]

var formulaireInfos = [
  {
      label: "Température de base (°C)",
      id: "tempBase",
      type: "number",
  },
  {
      label: "Température confort (°C)",
      id: "tempConf",
      type: "number",
  },
  {
      label: "Longueur (m)",
      id: "long",
      type: "number",
  },
  {
      label: "Largeur (m)",
      id: "larg",
      type: "number",
  },
  {
      label: "Hauteur (m)",
      id: "haut",
      type: "number",
  },
  // {
  //     label: "Volume (m³)",
  //     id: "vol",
  //     type: "number",
  // },
  {
      label: "Niveau d\'isolation",
      id: "isolation",
      type: "number",
  },
]

var editPiece = false;


// ********* //
// Fonctions //
// ********* //

// Fonction d'afficher de la page Pièce
function AfficherPiece(){
  var pieceDiv = document.getElementById("piece");
  var contenuDivPiece = "";

  contenuDivPiece += '<header>';
      contenuDivPiece += '<div class="btnNav">';
          contenuDivPiece += '<button id="btnRetour">';
              contenuDivPiece += '<img src="img/retour.png" alt="retour">';
          contenuDivPiece += '</button>';
          contenuDivPiece += '<button id="btnAccueil">';
              contenuDivPiece += '<img src="img/accueil.png" alt="accueil">';
          contenuDivPiece += '</button>';
      contenuDivPiece += '</div>';
      contenuDivPiece += '<select name="piece" id="pieceSelect">';
          // Générer le menu déroulant de toutes les salles via le tableau salles
          salles.forEach(function(salle){
              contenuDivPiece += '<option value="' + salle.value + '">' + salle.nom + '</option>';
          })
      contenuDivPiece += '</select>';
  contenuDivPiece += '</header>';
  contenuDivPiece += '<main>';
      contenuDivPiece += '<form action="#">';
          contenuDivPiece += '<div class="infosContainer">';
              // Générer le formulaire via le tableau formulaireInfos
              formulaireInfos.forEach(function(formulaireInfo){
                  contenuDivPiece += '<div class="infos">';
                      contenuDivPiece += '<label for="' + formulaireInfo.id + '">' + formulaireInfo.label + '</label>';
                      contenuDivPiece += '<input type="' + formulaireInfo.type + '" id="' + formulaireInfo.id + '" name="' + formulaireInfo.id + '">';
                      contenuDivPiece += '<span id="erreur' + formulaireInfo.id + '"></span>'
                  contenuDivPiece += '</div>';
              })
          contenuDivPiece += '</div>';
          contenuDivPiece += '<div class="puissance">';
              contenuDivPiece += '<h2>';
                  contenuDivPiece += 'Puissance P <br><span id="puissanceP"></span> W';
              contenuDivPiece += '</h2>';
          contenuDivPiece += '</div>';
          contenuDivPiece += '<input type="submit" value="Valider" class="valider">';
      contenuDivPiece += '</form>';
  contenuDivPiece += '</main>';

  pieceDiv.innerHTML = contenuDivPiece;
  pieceDiv.innerHTML = contenuDivPiece;
  const btnRetour = document.getElementById("btnRetour");
  const btnAccueil = document.getElementById("btnAccueil");

  btnRetour.addEventListener("click", () => {
    page2.style.display = "block";
    pieceDiv.innerHTML = "";
  });

  btnAccueil.addEventListener("click", () => {
    page1.style.display = "block";
    pieceDiv.innerHTML = "";
  });
  

  // ****************** //
// Gestion des inputs //
// ****************** //

// Variables input

var inputTempBase   = document.getElementById("tempBase");
var inputTempConf   = document.getElementById("tempConf");
var inputLong       = document.getElementById("long");
var inputLarg       = document.getElementById("larg");
var inputHaut       = document.getElementById("haut");
// var inputVol        = document.getElementById("vol");
var inputIsolation  = document.getElementById("isolation");
var puissancePiece  = document.getElementById("puissanceP");

// Variables d'erreurs

var erreurTempBase  = document.getElementById("erreurtempBase");
var erreurTempConf  = document.getElementById("erreurtempConf");
var erreurLong      = document.getElementById("erreurlong");
var erreurLarg      = document.getElementById("erreurlarg");
var erreurHaut      = document.getElementById("erreurhaut");
var erreurVol       = document.getElementById("erreurvol");
var erreurIsolation = document.getElementById("erreurisolation");

// Variables de validation pour calculs

var longVal         = false;
var largVal         = false;
var hautVal         = false;
var volume          = "";
var volVal          = false;
var tc              = false;
var tb              = false;
var deltaT          = "";
var deltaVal        = false;
var g               = false;



// Champ température de base
inputTempBase.addEventListener("input", function() {
  if (inputTempBase.value === "") {
      erreurTempBase.innerHTML = "Champ vide";
      couleur(erreurTempBase, inputTempBase, "red");
      tb = false;
  } else if (inputTempBase.value !== '-3' && inputTempBase.value !== '-6' && inputTempBase.value !== '-9') {
      erreurTempBase.innerHTML = "Valeur incorecte! Entrez -3, -6 ou -9!";
      couleur(erreurTempBase, inputTempBase, "red");
      tb = false;
  } else {
      erreurTempBase.innerHTML = "";
      couleur(erreurTempBase, inputTempBase, "green");
      tb = true;
      delta();
      puissanceP();
  }
});

// Champ température de confort
inputTempConf.addEventListener("input", function() {
  if (inputTempConf.value === "") {
      erreurTempConf.innerHTML = "Champ vide";
      couleur(erreurTempConf, inputTempConf, "red");
      tc = false;
  }
  else {
      erreurTempConf.innerHTML = "";
      couleur(erreurTempConf, inputTempConf, "green");
      tc = true;
      delta();
      puissanceP();
  }
});

// Champ longueur
inputLong.addEventListener("input", function() {
  if (inputLong.value === "") {
      erreurLong.innerHTML = "Champ vide";
      couleur(erreurLong, inputLong, "red");
      longVal = false;
      viderVolume ();
  }
  else {
      erreurLong.innerHTML = "";
      couleur(erreurLong, inputLong, "green");
      longVal = true;
      calculVolume ();
      puissanceP();
  }
});

// Champ largeur
inputLarg.addEventListener("input", function() {
  if (inputLarg.value === "") {
      erreurLarg.innerHTML = "Champ vide";
      couleur(erreurLarg, inputLarg, "red");
      largVal = false;
      viderVolume ();
  }
  else {
      erreurLarg.innerHTML = "";
      couleur(erreurLarg, inputLarg, "green");
      largVal = true;
      calculVolume ();
      puissanceP();
  }
});

// Champ hauteur
inputHaut.addEventListener("input", function() {
  if (inputHaut.value === "") {
      erreurHaut.innerHTML = "Champ vide";
      couleur(erreurHaut, inputHaut, "red");
      hautVal = false;
      viderVolume ();
  }
  else {
      erreurHaut.innerHTML = "";
      couleur(erreurHaut, inputHaut, "green");
      hautVal = true;
      calculVolume ();
      puissanceP();
  }
});

// Champ isolation
inputIsolation.addEventListener("input", function() {
  if (inputIsolation.value === "") {
      erreurIsolation.innerHTML = "Champ vide";
      couleur(erreurIsolation, inputIsolation, "red");
      g = false;
  }
  else {
      erreurIsolation.innerHTML = "";
      couleur(erreurIsolation, inputIsolation, "green");
      g = true;
      puissanceP();
  }
});

// ********************** //
// Controle du formulaire //
// ********************** //

document.querySelector("form").addEventListener("submit", function(e){
  var erreur = false;

  // Champ température de base
  if (inputTempBase.value === "") {
      erreurTempBase.innerHTML = "Champ vide";
      couleur(erreurTempBase, inputTempBase, "red");
  } 
  else if (inputTempBase.value !== '-3' && inputTempBase.value !== '-6' && inputTempBase.value !== '-9') {
      erreurTempBase.innerHTML = "Valeur incorecte! Entrez -3, -6 ou -9!";
      couleur(erreurTempBase, inputTempBase, "red");
  } 
  else {
      erreurTempBase.innerHTML = "";
      couleur(erreurTempBase, inputTempBase, "green");
  }

  // Champ température de confort
  if (inputTempConf.value === "") {
      erreurTempConf.innerHTML = "Champ vide";
      couleur(erreurTempConf, inputTempConf, "red");
  }
  else {
      erreurTempConf.innerHTML = "";
      couleur(erreurTempConf, inputTempConf, "green");
  }

  // Champ longueur
  if (inputLong.value === "") {
      erreurLong.innerHTML = "Champ vide";
      couleur(erreurLong, inputLong, "red");
  }
  else {
      erreurLong.innerHTML = "";
      couleur(erreurLong, inputLong, "green");
  }

  // Champ largeur
  if (inputLarg.value === "") {
      erreurLarg.innerHTML = "Champ vide";
      couleur(erreurLarg, inputLarg, "red");
  }
  else {
      erreurLarg.innerHTML = "";
      couleur(erreurLarg, inputLarg, "green");
  }

  // Champ hauteur
  if (inputHaut.value === "") {
      erreurHaut.innerHTML = "Champ vide";
      couleur(erreurHaut, inputHaut, "red");
  }
  else {
      erreurHaut.innerHTML = "";
      couleur(erreurHaut, inputHaut, "green");
  }

  // Champ volume
  // if (inputVol.value === "") {
  //     erreurVol.innerHTML = "Champ vide";
  //     couleur(erreurVol, inputVol, "red");
  // }
  // else if (inputVol.value <= 0) {
  //     erreurVol.innerHTML = "Volume invalide";
  //     couleur(erreurVol, inputVol, "red");
  // }
  // else {
  //     erreurVol.innerHTML = "";
  //     couleur(erreurVol, inputVol, "green");
  // }

  // Champ isolation
  if (inputIsolation.value === "") {
      erreurIsolation.innerHTML = "Champ vide";
      couleur(erreurIsolation, inputIsolation, "red");
  }
  else {
      erreurIsolation.innerHTML = "";
      couleur(erreurIsolation, inputIsolation, "green");
  }





  
  try{
      if (erreur) {
          throw new Error();
      } else {
          alert("Les données sont mises à jour dans votre BDD!")
      }
  }
  catch (error) {
      alert("Veuillez renseigner tous les champs correctement!!")
      e.preventDefault();
  }
})
}

// Fonction couleur
function couleur(element, input, color) {
  element.style.color = color;
  input.style.borderColor = color;
  input.style.borderWidth = '2px';
  input.style.borderStyle = 'solid';
}

// Remplir le champ volume
function calculVolume () {
  if (largVal || longVal || hautVal) {
      volume = inputLarg.value * inputLong.value * inputHaut.value;
      volVal = true;
  }
  console.log("volume = ")
}

// Vider le champ volume
function viderVolume () {
  if (!largVal || !longVal || !hautVal) {
      volume = "";
      volVal = false;
  }
  console.log("volume = ")
}

// Calcul du deltaT
function delta() {
  if (tc || tb) {
      deltaT = inputTempConf.value - inputTempBase.value;
      deltaVal = true;
  } else {
      deltaVal = false;
  }
  console.log("DeltaT = " + deltaT);
}

// Calcul de la puissance de la pièce
function puissanceP() {
  if (g || tb || deltaVal) {
      puissancePiece.value = inputIsolation.value * volume * deltaT;
      puissancePiece.innerHTML = puissancePiece.value;
  }
  console.log("puissanceP = " + puissancePiece.value);
}



