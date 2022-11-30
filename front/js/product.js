// variable permettant de récupérer l'id du produit dans l'URL de la page actuelle 
const productId = new URL(location.href).searchParams.get("id");

//-----------------------------------------------------------------------------------------------------
fetchProductPage(); // -- (ligne ≈ 198)                                                                               //
/** (Fonctions appelées dans la fonction fetch)
 *  ↳ displayItem(); -- (ligne ≈ 50) 
 *  ↳ getProductForCart();  -- (ligne ≈ 99) 
 *      (fonction appelées dans la fonction "getProductForCart")    
 *          ↳ triProduct();  -- (ligne ≈ 148) 
 *          ↳ saveCart(); -- (ligne ≈ 162) 
*/ 
// ----------------------------------------------------------------------------------------------------

/**
 * Fonction fecth pour appel des infos produit via l'API products par son ID (variable productId avec l'interpolation) 
 * promesse de transformer les résultats en JavaScript Object Notation (JSON)
 * promesse d'affichage des caractéristiques des produits sur la page avec la fonction displayItem()
 * + intégrer au local storage (panier) des information avec la fonction getProductForCart
 * message personnalisé (string) + error.message en interprétation JS 
*/
function fetchProductPage() {
    fetch(`http://localhost:3000/api/products/${productId}`)  
        .then((resultes) => {
            if (resultes.ok) {
                return resultes.json();
            }
        }) 
        .then((dataProduct) => { 
            // console.table(dataProduct);
            displayItem(dataProduct); 
            getProductForCart(dataProduct);
        })
        .catch((error) => { 
            console.log("Oups, il y a eu un problème > ",`${error.message}`); 
        });
}

/**
 * Fonction d'insertion des informations produit récupéré de l'API dans le DOM
 * Donne à l'onglet le nom du produit en selectionnant le titre dans le DOM
 * selection du premier élément appelé "item__img" dans le DOM avec querySelector
 * créatEeLement, setAttribute et appendChild pour intégrer l'image(+ info produit) sous le parent "item__img"
 * Selection des éléments du DOM à modifier avec getElementById 
 * Variable pour selectionner la balise "select"
 * boucle la création des options de couleur selon les informations tirée de l'api :
 * - créé l'élément option
 * - donne à l'option de couleur la valeur de la couleur selon l'api (selon ID)
 * - donne à l'option de couleur la veleur de la couleur en texte
 * - et déclare qu'il s'agit d'un enfant de select
*/
function displayItem(product){
    document.title = product.name;
    let imgItem = document.querySelector(".item__img"); 
    let imgCreate = document.createElement("img"); 
    imgCreate.setAttribute("src", product.imageUrl); 
    imgCreate.setAttribute("alt", product.altTxt) 
    imgItem.appendChild(imgCreate); 
    
    document.getElementById("title").textContent = product.name; 
    document.getElementById("price").textContent = product.price; 
    document.getElementById("description").textContent = product.description;

    let select = document.querySelector("select"); 
        for (let color of product.colors) {
            let option = document.createElement("option"); 
            option.value = color; 
            option.textContent = color; 
            select.appendChild(option); 
        }
}

/**
 * Fonction getProductForCart pour enregistré le produit dans le panier selon les choix de l'utilisateur
 * Ajoute un événement au clic du bouton "ajouter au panier"
 * Déclare les variables des sélections de couleur et de quantité
 * Créer l'objet dans lequel sont intégrés les choix de l'utilisateur (productDataCart)
 * Conditions d'ajout au panier : 
 *   - si la couleur ne correspond à rien ET que la quantité est inf à 0 et sup à 100 : alert + message
 *   - si la couleur n'est pas choisie : alert + message
 *   - si une quantité est égal à 0 et sup à 100 Ou inférieure à 0 :  alert + message
 * Si (else) les précédentes conditions sont ok alors : 
 *   Récupération du panier actuel avec getItem + parse (chaîne JSON transformée en un objet JavaScript) 
 *   Conditions selon le panier actuel
 *  - SI LE PANIER EST DIFFERENT DE NULL :
 *    Variable de méthode find pour renvoyer la valeur des éléments (ID,color) du Local storage
 *     - SI le produit est déjà dans le panier (repéré grâce à l'id et la couleur trouvée avec méthode find)
 *       -> calcul quantité totale du produit en additionnant la quantité du lS et la sélection utilisateur
 *       -> déclare que le résultat dans le panier est le résultat de l'addition du LS et sélection
 *       -> sauvegarde le panier 
 *     - SINON, s'il n'est pas dans le panier (compare ID et couleur) mais que le panier existe
 *       -> méthode push (ajout) du produit dans l'objet productDataCart
 *       -> fonction de tri par ordre alphabétique des produits dans le panier
 *       -> sauvegarde le panier
 * - SINON, si le panier n'existe pas
 *    -> déclare cart = [] tableau vide (pour stocker les objets)
 *    -> méthode push (ajout) de l'objet productDataCart (qui contient les infos) dans le panier []
 *    -> tri et sauvegarde du panier
 * alerte personnalisée lors de l'ajout du produit au panier
*/
function getProductForCart(product) {
    const btnAddProduct = document.querySelector("#addToCart");
    btnAddProduct.addEventListener("click", (event) => {
        event.preventDefault(); //annule l'event par défault -- bonne pratique
     
        const colorChoice = document.querySelector("#colors");
        const quantity = document.querySelector("#quantity");
        const productDataCart = {  
            name : product.name,
            id : productId,
            color: colorChoice.value,
            quantity: parseInt(quantity.value), // parseInt analyse la chaine de carac. et renvois un entier
        };
         
        if (productDataCart.color === "" && productDataCart.quantity <= 0 
            || productDataCart.color === "" && productDataCart.quantity >= 100){ 
            alert("Veuillez sélectionner une couleur et une quantité supérieure à 0 et inférieure à 100 :)")
        } else if (productDataCart.color == "") { 
            alert("Veuillez sélectionner une couleur :)");
        } else if (productDataCart.quantity <= 0 || productDataCart.quantity > 101)   {
            alert("Veuillez choisir une quantité supérieure à 0 et inférieure à 100 :)");
        } else {  
            let cart = JSON.parse(localStorage.getItem("cart"));
            if (cart != null) {
                const productFound = cart.find(product => product.id === productId && product.color === colorChoice.value)
                if (productFound){ 
                    let finalQuantity = productFound.quantity + productDataCart.quantity;
                    productFound.quantity = finalQuantity;
                    saveCart(cart); 
                } else { 
                    cart.push(productDataCart);
                    triProduct(cart)
                    saveCart(cart);
                }
            } else {
                cart = [];
                cart.push(productDataCart);
                saveCart(cart);
            }
            alert(`Vous avez ajouté ${productDataCart.quantity} ${productDataCart.name} de couleur ${productDataCart.color} au panier`);
        } 
    })
}

/**
 * fonction de tri des produits (dans le panier dans ce cas)
 * Méthode "sort" trie les éléments du tableau nommé "name" (chaine de caractère) par ordre alphabétique
 * Déclare que les noms sont retournés en minuscules
*/
function triProduct (array) {
    array.sort(function(a, b) {
        let lowCaseA = a.name.toLowerCase() 
        let lowCaseB = b.name.toLowerCase() 
            
        if (lowCaseA < lowCaseB) {return -1;}
        if (lowCaseA > lowCaseB) {return 1;}
        if (lowCaseA === lowCaseB) {return 0;}
    }) 
}

/**
 * Fonction de sauvegarde dans le local storage en chaîne JSON en utilisant setItem
*/
 function saveCart(data) { 
    localStorage.setItem("cart", JSON.stringify(data));
}