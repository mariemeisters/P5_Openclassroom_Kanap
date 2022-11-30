let currentCart = getItemCart(); // variable qui récupère les produit dans le Local Storage
let productForPrice = [] // tableau qui contiendras les informations des produits (pour calcul prix)

// ---------------------------------------------------------------------------------------------
initCartWithProduct(); // (ligne ≈ 30)                                                         -
//  ↳ displayCartItem(); -- (ligne ≈ 93)                                                       -
//      ↳ modifyQuantity(); -- (ligne ≈ 198)                                                   -
//      ↳ removeProduct(); -- (ligne ≈ 223)                                                    -
//  ↳ calculTotalProduct(); -- (ligne ≈ 241)                                                   -       
//  ↳ calculTotalPrice(); -- (ligne ≈ 260)                               APPEL DES FONCTIONS   -
removeForm() // (ligne ≈ 280)                                                                  -
//  ↳ cartEmpty() -- (ligne ≈ 302)                                                             -
conditionForm(); // -- (ligne ≈ 353)                                                           -                                                                   
orderBtn(); // -- (ligne ≈ 447)                                                                -
//  ↳ userCartConfirm(); -- (ligne ≈ 448)                                                      -
// ---------------------------------------------------------------------------------------------

/**
 * Permet d'initialiser la page selon les produits du LS, boucle forEach pour le parcourir (tableau) 
 * La boucle récupére les données de chaque élément de local storage selon l'ID (interpolation)
 * Promesse de résultat des info produit du LS en format JSON //
 * Promesse --> productData = information produit // productFullInfo = objet vide {}
 * Object assign pour copier toutes les propriétés énumérable et les assigner à productFullInfo
 * Déclarer que la couleur du produit et sa quantité dans productFullInfo sont égales à celles du local Storage
 * Méthode push pour envoyer les informations du produit dans ProductForPrice (tableau)
 * Fonction displayCartItem pour créer et afficher les éléments (DOM) après avoir reçu toutes les informations ci-dessus
 * Fonction pour calcul du nombre total de produits et du prix total du panier
 * Catch attrape l'erreur et le signale 
 */
function initCartWithProduct() {
    currentCart.forEach(function(getProductLS) { 
        fetch(`http://localhost:3000/api/products/${getProductLS.id}`) 
        .then(function(resultes) { 
            if (resultes.ok) {
                return resultes.json();
            }})
        .then(function(productData){ 
            let productFullInfo = {}; 
            Object.assign(productFullInfo, productData); 
            productFullInfo.color = getProductLS.color; 
            productFullInfo.quantity = getProductLS.quantity; 
            productForPrice.push(productFullInfo); 
            displayCartItem(productFullInfo);
            calculTotalProduct();
            calculTotalPrice();
        })
        .catch(function(error){ 
            console.log("Oups, il y a eu un problème > ",`${error.message}`);
        });
    })
}

/**
 * Permet d'enregistrer les produits dans le Local storage (setItem)
 * et transforme le contenu en chaine de caractère
*/
function saveCart(productCart) { 
    let currentObjCart = JSON.stringify(productCart);
    localStorage.setItem("cart", currentObjCart);
}

/**
 * Permet de récupérer les informations de "cart" dans le local storage
 * si le cart n'existe pas, renvoi un tableau vide []
 * sinon, chaîne JSON transformée en un objet JavaScript 
*/
function getItemCart(){  
    let cart = localStorage.getItem("cart");
    if (cart === null){
        return [];
    } else{
        return JSON.parse(cart); 
    }
}

/**
 * Fonction de création et d'insertion des produits dans le DOM
 * Utilisation de querySelector pour selectionné le parent de l'article
 * Uitlisation de createElement, classList.add, setAttribute, appendChild, textcontent...
 * ---- Imput quantity
 * Récupère dans des variables le panier et la quantité actuelle du produit avec "find" 
 * Méthode find pour trouver la quantité du produit actuel
 * Evenement de mofication de la quantité (par produits donc valable pour chaque input de la page) 
 * Modification quantité avec condition (pas inf. à 1 et sup. à 100 sinon réinitialisation de la quantité)
 * Si la valeur que l'utilisateur à entré est ok : (grâce à event.target.value) 
 * fonction modifyQuantity() pour modifier la quantité dans le LS
 * Déclare la nouvelle quantité dans le DOM (textContent) et recalcul le total (quantité et prix)
 * ---- Bouton Delete 
 * Fenetre de confirmation au clic utilisateur
 * S'il clique sur oui, lance la fonction de suppression du produit (du DOM avec article remove et dans le LS)
 * Sinon, annule le clic et laisse le produit dans le panier
*/
function displayCartItem(productCart) {
    let cardItem = document.querySelector("#cart__items");
    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", productCart._id);
    article.setAttribute("data-color", productCart.color);
    cardItem.appendChild(article);
            
    let divImg = document.createElement("div");
    divImg.classList.add("cart__item__img"); // 1ère div enfant de cart__items
    article.appendChild(divImg);

    let img = document.createElement("img");
    img.setAttribute("src", productCart.imageUrl); 
    img.setAttribute("alt", productCart.altTxt);
    divImg.appendChild(img);

    let divCartItemContent = document.createElement("div"); // 2ème div enfant de cart__items 
    divCartItemContent.classList.add("cart__item__content");
    article.appendChild(divCartItemContent);

    let divDescription = document.createElement("div"); // 1ère div (dans 2ème div du parent cart__items)
    divDescription.classList.add("cart__item__content__description");
    divCartItemContent.appendChild(divDescription);

    let h2Description = document.createElement("h2");
    h2Description.textContent = productCart.name;
    divDescription.appendChild(h2Description);

    let pColor = document.createElement("p");
    pColor.textContent = productCart.color;
    divDescription.appendChild(pColor);
                
    let pPrice = document.createElement("p");
    pPrice.textContent = productCart.price + " " + "€"; 
    divDescription.appendChild(pPrice);

    let divSetting = document.createElement("div"); // 2ème div (dans 2ème div du parent cart__items)
    divSetting.classList.add("cart__item__content__settings");
    divCartItemContent.appendChild(divSetting);

    let divSettingQuantity = document.createElement("div");
    divSettingQuantity.classList.add("cart__item__content__settings__quantity");
    divSetting.appendChild(divSettingQuantity);

    let pQuantity = document.createElement("p");
    pQuantity.textContent = "Qté :" + " " + productCart.quantity;
    divSettingQuantity.appendChild(pQuantity);

    let inputQuantity = document.createElement("input");
    inputQuantity.setAttribute("type", "number");
    inputQuantity.classList.add("itemQuantity");
    inputQuantity.setAttribute("name", "itemQuantity");
    inputQuantity.setAttribute("min", "1");
    inputQuantity.setAttribute("max", "100");
    inputQuantity.setAttribute("value", productCart.quantity);
    divSettingQuantity.appendChild(inputQuantity);

    let divSettingDelete = document.createElement("div");
    divSettingDelete.classList.add("cart__item__content__settings__delete");
    divSetting.appendChild(divSettingDelete);

    let pDeleteItem = document.createElement("p");
    pDeleteItem.classList.add("deleteItem");
    pDeleteItem.textContent = "Supprimer";
    divSettingDelete.appendChild(pDeleteItem);

//  ------ EVENT INPUT ------
    let cart = getItemCart();
    let quantityInitial = cart.find((product=> product.quantity == productCart.quantity));
    inputQuantity.addEventListener("change", function(event){  

        if (Number(event.target.value) >= 1 && Number(event.target.value) <= 100) {
            modifyQuantity(this, event); // this pour donner les valeurs de l'objet selon les résultats de la fonction 
            let newQuantitymodif = Number(event.target.value); 
            pQuantity.textContent = "Qté :" + " " + newQuantitymodif;
            calculTotalProduct(); 
            calculTotalPrice();
        } else {
            alert("Veuillez choisir une quantité supérieure à 0 et inférieure à 100")     
            inputQuantity.value = quantityInitial.quantity;
            pQuantity.textContent = "Qté :" + " " + quantityInitial.quantity;
        }}
    )
//  ------ EVENT BTN DELETE ------           
    pDeleteItem.addEventListener("click", function () {
        if (confirm(`Souhaitez-vous supprimer le ${productCart.name} de couleur ${productCart.color} de votre panier ?`) === true) {
            removeProduct(productCart);
            article.remove();
        }})
    } 
 //--------------------------------------------------------------------------------------------------------//
 // ----------------------------------FIN FONCTION displayCartItem() ---------------------------------------//

 /**
  * ProductCart, event = produit sur lequel l'event à eu lieu
  * cart = Récupère le panier (local storage) actuel
  * Methode "closest" pour remonter dans le DOM et trouver le noeud "article" du produit sur lequel l'utilisateur à cliqué
  * Dataset pour récupérer l'ID et la couleur du produit concerné
  * newQuantity = récupère la valeur (en nombre) de la quantité lors du déclenchement de l'event dans l'input
  * Boucle + propriété length (longueur) avec la condition de parcourir le tableau cart (LocalStorage)
  * Si dans le panier actuel l'id et la couleur du produit sont identique aux dataset de l'article
  * Déclare que la quantité dans le panier est maintenant égale à la valeur choisie par l'utilisateur
  * Sauvegarde les informations dans le local storage
  */
 function modifyQuantity(productCart, event){   
    let cart = getItemCart();
    let article = productCart.closest("article"); 
    let newQuantity = Number(event.target.value); 
    let productDataID = article.dataset.id; 
    let productDataColor = article.dataset.color; 
     // Pour des raisons de performance, je déclare la longueur du tableau plutôt que le recalculer à chaque tour de boucle 
    for (let i = 0, length = cart.length; i < length; i++){ 
        if (cart[i].id === productDataID && cart[i].color === productDataColor){ 
            cart[i].quantity = newQuantity; 
            localStorage.setItem("cart", JSON.stringify(cart)); 
        }
    }
}

/**
 * Suite à l'event du bouton sur le produit concerné, récupère le panier actuel
 * Boucle pour rechercher dans local storage en vérifiant tous les objets (utilisation de length)
 * Déclaration d'une variable contenant la fonction utilisant la méthode filter 
 * Elle crée et retourne un nouveau tableau contenant tous les éléments du tableau d'origine
 * qui remplissent la condition suivante : ID différente ou couleur différente
 * Sauvegarde du nouveau tableau cartAfterFilter avec la fonction saveCart()
 * Calcul du nombre total prix et produit
 * Lance la fonction removeForm() s'il s'agissait du dernier produit du panier 
*/
 function removeProduct(productCart) {
    let cart = getItemCart();
    for( let i = 0, lengt = cart.length; i < lengt; i++){ 
        const cartAfterFilter = cart.filter((elementNewCart) => elementNewCart.id !== productCart._id || elementNewCart.color !== productCart.color);
        saveCart(cartAfterFilter); 
        calculTotalPrice(); 
        calculTotalProduct(); 
        removeForm(); 
    }
} 

/**
 * cart = Récupère le panier dans le localStorage
 * Définie que le nombre d'article dans le panier est de 0
 * Boucle pour chaque produit dans le panier
 * En partant de 0, affectation après addition : ajoute 1 quantité pour chaque produit dans le local storage
 * querySelector de l'ID du span dans le DOM (totalQuantity) + textContent du résultat de la boucle dans le DOM
 */
function calculTotalProduct () {
    let cart = getItemCart();
    let numberArticleInCart = 0; 
    for (let product of cart){
        numberArticleInCart += product.quantity; 
    }
    const totalProductQuantity = document.querySelector("#totalQuantity"); 
    totalProductQuantity.textContent = numberArticleInCart; 
}

/**
 * Récupère les produit dans le panier (fonction get Local storage)
 * ProductForPrice est le tableau dans lequel les informations (dont le prix) des produits ont été push en amont
 * Définie que le prix total est de 0
 * Boucle pour rechercher dans panier en vérifiant tous les objets (utilisation de length)
 * Condition : - si l'ID du produit = l'ID de productForPrice (PFP) et que la couleur du produit est différente de PFP
 *             - si l'ID du produit = l'ID de PFP et que la couleur dans le panier = la couleur de PFP
 * calcul du prix total, affectation après addition : quantité dans le panier (du produit) * prix dans le PFP (du même produit)
 */
function calculTotalPrice() { // calcul du produit, s'il est présent dans le panier, selon les conditions, 
    let cart = getItemCart();
    let totalPriceCart = 0;
 
    for (i = 0; i < cart.length && i < productForPrice.length; i++) { 
        if (cart[i]._id === productForPrice[i].id && cart[i].color != productForPrice[i].color || 
            cart[i]._id === productForPrice[i].id && cart[i].color === productForPrice[i].color)
            totalPriceCart += cart[i].quantity * productForPrice[i].price;
        }
    const totalProductPrice = document.querySelector("#totalPrice");
    totalProductPrice.textContent = totalPriceCart; 
}

/**
 * fonction permettant de vérifier si le panier (LS) est vide
 * cart = panier actuel
 * cartOrder = selectionne la div parent des éléments du formulaire (querySelector, class cart__order)
 * Si la longueur du panier est égale à 0, désactive l'affichage et lance la fonction cartEmpty()
 * Sinon, affiche le formulaire en block centré
 */
function removeForm() { // 
    let cart = getItemCart();
    let cartOrder = document.querySelector(".cart__order");
    
    if (cart.length === 0) {
        cartOrder.style.display = "none";
        cartEmpty();
    } else 
        cartOrder.style.display = "block-center";
}

/**
 * Fonction d'affichage alternatif lorsque le panier est vide
 * Sélection du container affichant le panier puis de enfant H1 avec querySelector
 * Création d'un nouvel élément P indiquant à l'utilisateur que le panier est vide avec style css (enfant de h1)
 * Création d'un bouton, deuxième enfant de h1 + style css
 * Ajout de 3 addEvenListener :
 *    - "mouseenter", lorsque la souris rentre dans l'element du button, le pointer change et la taille grandis
 *    - "mouseleave", signifiant que lorsque la souris sort de l'element la taille se réinitialise
 *    - "click", redirigeant l'utilisateur vers l'accueil du site
 */
function cartEmpty() {
    let divH1CartEmpty = document.querySelector("#cartAndFormContainer");
    let h1CartEmpty = divH1CartEmpty.querySelector("h1");
    
    let newP = document.createElement("p");
    h1CartEmpty.innerText = "Votre panier est vide";
    h1CartEmpty.appendChild(newP);
    newP.style.fontSize = "28px";
    newP.style.fontWeight = "300";
    newP.innerText ="Ajoutez-y un beau canapé";

    let btnHome = document.createElement("button");
    h1CartEmpty.appendChild(btnHome);
  
    btnHome.textContent = "Retourner à l'accueil";
    btnHome.style.fontSize = "28px";
    btnHome.style.backgroundColor = "#FFFFFF";
    btnHome.style.color = "#3498DB";
    btnHome.style.border = "none";
    btnHome.style.borderRadius = "10px"
    btnHome.style.padding = "10px 28px 10px 28px";

    btnHome.addEventListener("mouseenter", function(event){
        event.target.style.cursor = "pointer";
        event.target.style.fontSize = "30px"; 
    })
    btnHome.addEventListener("mouseleave", function(event){
        event.target.style.fontSize = "28px"; 
        
    })
    btnHome.addEventListener("click", function () {
        location.href = "index.html"; 
    })
    calculTotalProduct()
    calculTotalPrice()
}

/**
 * utilisation d'expression rationnelles pour combiner les conditions
 * "/" = permet de créer une expression rationelle (combinaison de caractère)
 * "\" = indique que le caractère qui suit est spécial et qu'il ne doit pas être interprété directement
 * "^" = début de séquence --- "$" = fin de séquence
 * "+" = boucle l'expression sur tous les caractères entrés
 * QuerySelector via l'ID des élements du formulaire à contrôler
 * Evènement change lors l'input (dans les éléments du formulaire)
 * Methode test pour vérifier la valeur du texte saisi dans prenom (via le DOM) avec condition 
 * Si : masque d'expression rationnelle valide + longueur de l'information entrée par l'utilisateur 
 *      -> innerText pour le contenu textuel de l'entrée utilisateur
 * Sinon, message d'erreur et mise à 0 de la valeur
 */

function conditionForm() {
    const masqueOnlyTexte = /^[A-Za-z\è\é\ï\î\ê\-]+$/; // seule les majuscules et minuscule de a à z + les "é","è","ê" et "-" sont valides 
    const masqueMixte = /^[A-Za-z0-9\'\è\é\ê\à\ \-]+$/; // + espace et apostrophe
    const masqueCity = /^[A-Za-z\'\è\é\ê\à\ \-]+$/;
    const masqueEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const fistNameForm = document.querySelector("#firstNameErrorMsg");
    const lastNameForm = document.querySelector("#lastNameErrorMsg");
    const addressForm = document.querySelector("#addressErrorMsg");
    const cityForm = document.querySelector("#cityErrorMsg");
    const emailForm = document.querySelector("#emailErrorMsg");
    
    firstName.addEventListener("change", event => {
        if (masqueOnlyTexte.test(event.target.value) === true && (event.target.value).length > 2){ 
            fistNameForm.innerText = "";
        } else {
            event.target.value = "";
            fistNameForm.innerText = "Le prénom ne peut contenir que des lettres, au minimum 3 caractères et ne doit pas contenir d'espace.";
        }
    })

    lastName.addEventListener("change", event => {
        if (masqueOnlyTexte.test(event.target.value) === true && (event.target.value).length > 1 ){
            lastNameForm.innerText = "";
        } else {
            event.target.value = "";
            lastNameForm.innerText = "Le nom ne peut contenir que des lettres -- minimum 2 caractères.";
        }
    })

    address.addEventListener("change", event => {
        if (masqueMixte.test(event.target.value) === true){
            addressForm.innerText =""; 
        } else {
            event.target.value = "";
            addressForm.innerText = "L'adresse ne peut pas contenir de caractères spéciaux, veuillez saisir des lettres et des chiffres.";
        }
    })

    city.addEventListener("change", event => {
        if (masqueCity.test(event.target.value) === true){
            cityForm.innerText = "";
        } else {
            event.target.value ="";
            cityForm.innerText = "La ville ne peut contenir que des lettres.";
        }
    })

    email.addEventListener("change", event => {
        if (masqueEmail.test(event.target.value) === true){
            emailForm.innerHTML = "";
        } else {
            event.target.value = "";
            emailForm.innerText = "Veuillez saisir votre email. Exemple : monadressemail@hotmail.com";
        }
    })
}

/**
 * Fonction permettant à l'utilisateur de confirmer sa commande
 * Selection avec querySelector de l'ID Order
 * Evenement au clic -- si les conditions du formulaire sont vide, message d'erreur personnalisé
 * Sinon, si le formulaire est remplis (donc après vérif des éléments du formulaire)
 * Appel la fonction d'envoi de commande *  
 */
function orderBtn () {
    let btnOrder = document.querySelector('#order'); // selection du button //

    btnOrder.addEventListener('click', function(event) { // ajout evenement au clic //
        event.preventDefault(); // annule l'event par défault
            // vérifie si les valeurs du formulaire ne sont pas vide //
        if (firstName.value === "" || lastName.value === "" || address.value === "" || city.value === "" || email.value === ""){
            alert("Veillez renseigner vos coordonnées avant de passer la commande.");
            // si tout est ok, lance la fonction POST
        } else {
            userCartConfirm();
        }
    });
}

/**
 * Fonction d''envoi du formulaire pour la validation des données
 * Récupération du panier actuel : productInCart
 * Méthode map pour créer un tableau avec l'ID des produits dans le local storage
 * Création d'un objet : infoOrder, dans cet objet est déclaré que l'objet contact contient :
 * - un objet "contact" = la valeur des éléments du form : firstName, lastName, address, city et email. 
 * - un tableau "products" = le tableau créé avec la méthode map avec l'ID des produits
 * Résultat : un objet conforme au spécifications 
 * ------
 * Utilisation de fetch avec la méthode POST vers "http://localhost:3000/api/products/order"
 * Conversion du corps en chaine (JSON.stringify)
 * Headers "application.json" pour un corps de type json + encodage UTF-8
 * Promesse que si tout est ok, envoi des informations au server, sinon message d'erreur console.log
 * Promesse de redirection vers la page de confirmation en générant un numéro de commande aléatoire
 */

function userCartConfirm() {
    const productInCart = getItemCart(); 

    const productForOrder = productInCart.map((product) => {return product.id});
    const infoOrder = { 
        contact : {
            firstName : document.getElementById("firstName").value, 
            lastName : document.getElementById("lastName").value, 
            address : document.getElementById("address").value,
            email : document.getElementById("email").value,
            city : document.getElementById("city").value,
        },
        products: productForOrder, // = array avec ID 
    };

    fetch("http://localhost:3000/api/products/order", { 
       method: "POST", 
       body: JSON.stringify(infoOrder), 
       headers: { "Content-Type": "application/json; charset=UTF-8" }, 
    })
    .then((resultes) => {
        if (resultes.ok) {
            return resultes.json();
        }
        else {
            console.log("Echec d'envoi au serveur.",`${message}`);
        }
    })
    .then((productData) => { 
        location.href = `confirmation.html?id=${productData.orderId}`; 
    });
}






// ------------------- AUTRE METHODE DISPLAY ------------------- //

// function diplayCart(productFullInfoDisplay) {
//     document.querySelector("#cart__items").innerHTML += // variable pour l'affichage des canapés sur l'ID "items" // 
//         `<article class="cart__item" data-id="${productFullInfoDisplay._id}" data-color="${productFullInfoDisplay.color}">
//         <div class="cart__item__img">
//         <img src="${productFullInfoDisplay.imageUrl}" alt="${productFullInfoDisplay.altTxt}">
//         </div>
//         <div class="cart__item__content">
//         <div class="cart__item__content__description">
//             <h2>${productFullInfoDisplay.name}</h2>
//             <p>${productFullInfoDisplay.color}</p>
//             <p>${productFullInfoDisplay.price} €</p>
//         </div>
//         <div class="cart__item__content__settings">
//             <div class="cart__item__content__settings__quantity">
//             <p>Qté : </p>
//             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productFullInfoDisplay.quantity}">
//             </div>
//             <div class="cart__item__content__settings__delete">
//             <p class="deleteItem">Supprimer</p>
//             </div>
//         </div>
//         </div>
//     </article>`;
// }

