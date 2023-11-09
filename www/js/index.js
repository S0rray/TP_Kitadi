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
const p2BoutonSupprimer = document.getElementById("p2_bouton_supprimer");

// Informations
const p2InputNumero = document.getElementById("p2_input_numero");
const p2InputNom = document.getElementById("p2_input_nom");
const p2InputAdresse = document.getElementById("p2_input_adresse");
const p2inputCP = document.getElementById("p2_input_cp");
const p2InputTelephone = document.getElementById("p2_input_telephone");
const p2InputEmail = document.getElementById("p2_input_email");

const boutonAjouter = document.getElementById("ajouterUnClient");
const p1Container = document.getElementById("p1_container");
const tableContainer = document.getElementById("tableContainer");
const projets = document.getElementsByClassName("projets");
const piecesInfo = document.getElementsByClassName("p2_pieces_info");

let numeroClient;

const p3Container = document.getElementById("p3_container");

const p3NomPiece = document.getElementById("piece");
const p3TempBase = document.getElementById("tempBase");
const p3TempConfort = document.getElementById("tempConfort");
const p3Longueur = document.getElementById("longueur");
const p3Largeur = document.getElementById("largeur");
const p3Hauteur = document.getElementById("hauteur");
const p3Isolation = document.getElementById("isolation");
const p3Puissance = document.getElementById("puissance");

const btnRetour = document.getElementById("btnRetour");
const btnAccueil = document.getElementById("btnAccueil");
const btnValider = document.getElementById("valider");

const inputRecherche = document.getElementById("input_recherche");
const boutonRecherche = document.getElementById("bouton_recherche");

// ------------
// FONCTIONS
// ------------

// Ouverture de la page 1
function p1Open() {
  inputRecherche.value = "";

  p1ClientSelect();

  p1Container.style.display = "block";
  p2Container.style.display = "none";
  p3Container.style.display = "none";
}

// Ouverture de la page 2
function p2Open() {
  p2ClientSelect();
  p2PieceSelect();

  p1Container.style.display = "none";
  p2Container.style.display = "block";
  p3Container.style.display = "none";
}

// Ouverture de la page 3
function p3Open() {
  p3PieceSelect();

  p1Container.style.display = "none";
  p2Container.style.display = "none";
  p3Container.style.display = "block";
}

// Requête Select sur la table client pour afficher sur la page 1
function p1ClientSelect() {
  tableContainer.innerHTML = "";

  myDBMaison.transaction(function (transaction) {
    transaction.executeSql(
      "SELECT * FROM client",
      [],
      function (tx, results) {
        let len = results.rows.length,
          i;

        for (i = 0; i < len; i++) {
          let nomClient;
          if (results.rows.item(i).nom_client == null) {
            nomClient = "Nouveau client";
          } else {
            nomClient = results.rows.item(i).nom_client;
          }
          tableContainer.innerHTML += `
            <div class="bouton projets" id="projet${
              results.rows.item(i).id_client
            }">
              <p>${nomClient}</p>
              <p>Numéro client : ${results.rows.item(i).id_client}</p>
            </div>
          `;
        }

        for (i = 0; i < projets.length; i++) {
          const projet = document.getElementById(projets[i].id);
          projet.addEventListener("click", () => {
            numeroClient = projet.id.substring(6, 7);
            p2Open();
          });
        }
      },
      null
    );
  });
}

// Requête Select sur la table client pour afficher sur la page 2
function p2ClientSelect() {
  p2ContainerPieces.innerHTML = "";

  myDBMaison.transaction(function (transaction) {
    transaction.executeSql(
      "SELECT * FROM client WHERE id_client=?",
      [numeroClient],
      function (tx, results) {
        p2InputNumero.innerHTML = results.rows.item(0).id_client;
        p2InputNom.value = results.rows.item(0).nom_client;
        p2InputAdresse.value = results.rows.item(0).adresse_client;
        p2inputCP.value = results.rows.item(0).code_postal;
        p2InputTelephone.value = results.rows.item(0).telephone_client;
        p2InputEmail.value = results.rows.item(0).email_client;
      },
      null
    );
  });
}

// Requête Select sur la table piece pour afficher sur la page 2
function p2PieceSelect() {
  p2ContainerPieces.innerHTML = "";

  myDBMaison.transaction(function (transaction) {
    transaction.executeSql(
      "SELECT * FROM piece WHERE client_id=?",
      [numeroClient],
      function (tx, results) {
        let len = results.rows.length,
          i;

        for (i = 0; i < len; i++) {
          let nomPiece;
          if (results.rows.item(i).nom_piece == null) {
            nomPiece = "Nouvelle pièce";
          } else {
            nomPiece = results.rows.item(i).nom_piece;
          }
          p2ContainerPieces.innerHTML += `
            <div class="p2_pieces" id="p2_piece_${
              results.rows.item(i).id_piece
            }">
              <div class="bouton p2_pieces_info" id="p2_piece_info_${
                results.rows.item(i).id_piece
              }">
                <h2>${nomPiece}</h2>
                <h2>${results.rows.item(i).puissance_piece} W</h2>
              </div>
            <button class="p2_boutons_delete" id="p2_bouton_delete_${
              results.rows.item(i).id_piece
            }"><img src="img/poubelle.png" alt="delete"></button>
            </div>
          `;
        }

        for (i = 0; i < piecesInfo.length; i++) {
          const pieceInfo = document.getElementById(piecesInfo[i].id);
          pieceInfo.addEventListener("click", () => {
            numeroPiece = pieceInfo.id.substring(14, 15);
            p3Open();
          });

          const p2BoutonDelClic = document.getElementById(
            p2BoutonsDelete[i].id
          );

          p2BoutonDelClic.addEventListener("click", () => {
            p2BoutonDelClic.parentElement.remove();

            let p2NumeroPiece = p2BoutonDelClic.id.substring(
              p2BoutonDelClic.id.length,
              p2BoutonDelClic.id.length - 1
            );

            myDBMaison.transaction(function (transaction) {
              var executeQuery = "DELETE FROM piece where id_piece=?";
              transaction.executeSql(
                executeQuery,
                [p2NumeroPiece],
                //On Success
                function (tx, result) {
                  console.log("Suppression OK !!!");
                },
                //On Error
                function (error) {
                  console.log("Une erreur s'est produite !!!");
                }
              );
            });
          });
        }
      },
      null
    );
  });

  const p2Puissance = document.getElementById("p2_puissance");

  myDBMaison.transaction(function (transaction) {
    transaction.executeSql(
      "SELECT SUM(puissance_piece) AS puissance_totale FROM piece WHERE client_id=?",
      [numeroClient],
      function (tx, results) {
        p2Puissance.innerHTML = results.rows.item(0).puissance_totale;
      },
      null
    );
  });
}

// Requête Select sur la table piece pour afficher sur la table 3
function p3PieceSelect() {
  myDBMaison.transaction(function (transaction) {
    transaction.executeSql(
      "SELECT * FROM piece WHERE id_piece=?",
      [numeroPiece],
      function (tx, results) {
        p3NomPiece.value = results.rows.item(0).nom_piece;
        p3TempBase.value = results.rows.item(0).tbase_piece;
        p3TempConfort.value = results.rows.item(0).tconfort_piece;
        p3Longueur.value = results.rows.item(0).longueur_piece;
        p3Largeur.value = results.rows.item(0).largeur_piece;
        p3Hauteur.value = results.rows.item(0).hauteur_piece;
        p3Isolation.value = results.rows.item(0).isolation_piece;
        p3Puissance.innerHTML = results.rows.item(0).puissance_piece;
      },
      null
    );
  });
}

// --------
// DEBUT
// --------

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  myDBMaison = window.sqlitePlugin.openDatabase({
    name: "kitadi.db",
    location: "default",
  });

  myDBMaison.transaction(function (transaction) {
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS client (id_client integer primary key, nom_client varchar(50), adresse_client varchar(50), code_postal int(5), telephone_client varchar(50), email_client varchar(50))",
      [],
      function (tx, result) {
        console.log("La Table client a été créé avec succés !!!");
      },
      function (error) {
        console.log("Une erreur s'est produite !!!");
      }
    );
  });

  myDBMaison.transaction(function (transaction) {
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS piece (id_piece integer primary key, nom_piece varchar(50), tbase_piece integer, tconfort_piece integer, longueur_piece integer, largeur_piece integer, hauteur_piece integer, isolation_piece integer, puissance_piece integer, client_id integer, FOREIGN KEY (client_id) REFERENCES client (id_client))",
      [],
      function (tx, result) {
        console.log("La Table piece a été créé avec succés !!!");
      },
      function (error) {
        console.log("Une erreur s'est produite !!!");
      }
    );
  });

  p1ClientSelect();

  boutonAjouter.addEventListener("click", () => {
    let nom = null;
    let adresse = null;
    let telephone = null;
    let email = null;
    let codePostal = null;

    myDBMaison.transaction(function (transaction) {
      var executeQuery =
        "INSERT INTO client (nom_client, adresse_client, code_postal, telephone_client, email_client) VALUES (?,?,?,?,?)";
      transaction.executeSql(
        executeQuery,
        [nom, adresse, codePostal, telephone, email],
        function (tx, result) {
          console.log("Insertion OK !!!");
        },
        function (error) {
          console.log("Une erreur s'est produite !!!");
        }
      );
    });

    p1ClientSelect();
  });

  // page 2

  // -------------------
  // EVENTS LISTENERS
  // -------------------

  // Clic bouton retour
  p2BoutonRetour.addEventListener("click", () => {
    p1Open();
  });

  // Clic bouton sauvegarder
  p2BoutonSauvegarder.addEventListener("click", () => {
    let p2Nom = p2InputNom.value;
    let p2Adresse = p2InputAdresse.value;
    let p2Telephone = p2InputTelephone.value;
    let p2Email = p2InputEmail.value;
    let codePostal = p2inputCP.value;

    myDBMaison.transaction(function (transaction) {
      var executeQuery =
        "UPDATE client SET nom_client=?, adresse_client=?, code_postal=?, telephone_client=?, email_client=? WHERE id_client=?";
      transaction.executeSql(
        executeQuery,
        [p2Nom, p2Adresse, codePostal, p2Telephone, p2Email, numeroClient],
        //On Success
        function (tx, result) {
          console.log("Modification OK !!!");
        },
        //On Error
        function (error) {
          console.log("Une erreur s'est produite !!!");
        }
      );
    });
  });

  // Clic bouton supprimer
  p2BoutonSupprimer.addEventListener("click", () => {
    myDBMaison.transaction(function (transaction) {
      var executeQuery = "DELETE FROM client where id_client=?";
      transaction.executeSql(
        executeQuery,
        [numeroClient],
        //On Success
        function (tx, result) {
          console.log("Suppression client OK !!!");
          myDBMaison.transaction(function (transaction) {
            var executeQuery = "DELETE FROM piece where client_id=?";
            transaction.executeSql(
              executeQuery,
              [numeroClient],
              //On Success
              function (tx, result) {
                console.log("Suppression pieces OK !!!");
                p1Open();
              },
              //On Error
              function (error) {
                console.log("Une erreur s'est produite !!!");
              }
            );
          });
        },
        //On Error
        function (error) {
          console.log("Une erreur s'est produite !!!");
        }
      );
    });
  });

  // Clic bouton ajouter
  p2BoutonAjouter.addEventListener("click", () => {
    let piece = null;
    let tBase = null;
    let tConfort = null;
    let longueur = null;
    let largeur = null;
    let hauteur = null;
    let isolation = null;
    let puissance = 0;

    myDBMaison.transaction(function (transaction) {
      var executeQuery =
        "INSERT INTO piece (nom_piece, tbase_piece, tconfort_piece, longueur_piece, largeur_piece, hauteur_piece, isolation_piece, puissance_piece, client_id) VALUES (?,?,?,?,?,?,?,?,?)";
      transaction.executeSql(
        executeQuery,
        [
          piece,
          tBase,
          tConfort,
          longueur,
          largeur,
          hauteur,
          isolation,
          puissance,
          numeroClient,
        ],
        function (tx, result) {
          console.log("Insertion OK !!!");
        },
        function (error) {
          console.log("Une erreur s'est produite !!!");
        }
      );
    });

    p2PieceSelect();
  });

  btnRetour.addEventListener("click", () => {
    p2Open();
  });

  btnAccueil.addEventListener("click", () => {
    p1Open();
  });

  btnValider.addEventListener("click", (e) => {
    e.preventDefault();

    let nomPiece = p3NomPiece.value;
    let tBase = p3TempBase.value;
    let tConfort = p3TempConfort.value;
    let longueur = p3Longueur.value;
    let largeur = p3Largeur.value;
    let hauteur = p3Hauteur.value;
    let isolation = p3Isolation.value;
    let puissance =
      isolation * (longueur * largeur * hauteur) * (tConfort - tBase);

    myDBMaison.transaction(function (transaction) {
      var executeQuery =
        "UPDATE piece SET nom_piece=?, tbase_piece=?, tconfort_piece=?, longueur_piece=?, largeur_piece=?, hauteur_piece=?, isolation_piece=?, puissance_piece=? WHERE id_piece=?";
      transaction.executeSql(
        executeQuery,
        [
          nomPiece,
          tBase,
          tConfort,
          longueur,
          largeur,
          hauteur,
          isolation,
          puissance,
          numeroPiece,
        ],
        //On Success
        function (tx, result) {
          console.log("Modification OK !!!");
        },
        //On Error
        function (error) {
          console.log("Une erreur s'est produite !!!");
        }
      );
    });

    p3PieceSelect();
  });
}

p2InputNom.addEventListener("input", () => {
  p2InputNom.value = p2InputNom.value.toUpperCase();
});

let espace = false;
let autocomplete = true;
let telephoneValue;

p2InputTelephone.addEventListener("input", () => {
  p2InputTelephone.value = p2InputTelephone.value.trim();

  // Crée des espaces tous les 2 chiffres
  if (
    p2InputTelephone.value.length == 2 ||
    p2InputTelephone.value.length == 5 ||
    p2InputTelephone.value.length == 8 ||
    p2InputTelephone.value.length == 11
  ) {
    autocomplete = true;

    if (espace) {
      p2InputTelephone.value = p2InputTelephone.value.substr(
        0,
        p2InputTelephone.value.length - 1
      );

      espace = false;
    } else {
      p2InputTelephone.value = p2InputTelephone.value + " ";

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

  // Vérifie s'il y a eu usage de l'autocomplete (ou copier-coller)
  if (p2InputTelephone.value.length == 10) {
    for (i = 0; i < 10; i++) {
      if (p2InputTelephone.value.charAt(i) == " ") {
        autocomplete = false;
      }
    }

    // Si oui, réécris le numéro avec des espaces
    if (autocomplete) {
      telephoneValue = p2InputTelephone.value.slice(0, 2);
      for (i = 2; i < 9; i = i + 2) {
        telephoneValue += " ";
        telephoneValue += p2InputTelephone.value.slice(i, i + 2);
      }
      p2InputTelephone.value = telephoneValue;

      autocomplete = false;
    }
  }
});

p3NomPiece.addEventListener("input", () => {
  p3NomPiece.value =
    p3NomPiece.value.charAt(0).toUpperCase() +
    p3NomPiece.value.slice(1, p3NomPiece.value.length).toLowerCase();
});

inputRecherche.addEventListener("input", () => {
  inputRecherche.value = inputRecherche.value.toUpperCase();
});

boutonRecherche.addEventListener("click", () => {
  let recherche = inputRecherche.value + "%";
  tableContainer.innerHTML = "";
  if (inputRecherche.value == "") {
    p1ClientSelect();
  } else {
    myDBMaison.transaction(function (transaction) {
      transaction.executeSql(
        "SELECT * FROM client WHERE nom_client LIKE ?",
        [recherche],
        function (tx, results) {
          let len = results.rows.length,
            i;

          for (i = 0; i < len; i++) {
            tableContainer.innerHTML += `
                <div class="projets" id="projet${
                  results.rows.item(i).id_client
                }">
                  <p>${results.rows.item(i).nom_client}</p>
                  <p>${results.rows.item(i).id_client}</p>
                </div>
              `;
          }

          for (i = 0; i < projets.length; i++) {
            const projet = document.getElementById(projets[i].id);
            projet.addEventListener("click", () => {
              numeroClient = projet.id.substring(6, 7);
              p2Open();
            });
          }
        },
        null
      );
    });
  }
});
