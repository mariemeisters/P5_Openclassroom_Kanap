
confirmationOrder()

// Récupère l'ID du span dans le DOM pour y ajouter le contenu récupéré dans l'url (num de commande aléatoire)
function confirmationOrder() {
    let orderId = document.querySelector("#orderId"); 
    let orderIdUrl = new URL(location.href).searchParams.get("id");
    orderId.textContent = orderIdUrl;
  
    localStorage.removeItem("cart");
  }
