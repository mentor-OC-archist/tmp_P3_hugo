import MyClass from "./assets/js/MyClass.js"

// Définition des endpoints pour les travaux et les catégories
const worksEndpoint = 'http://localhost:5678/api/works';
const categoriesEndpoint = 'http://localhost:5678/api/categories';
const loginEndpoint = 'http://localhost:5678/api/users/login';

// Fonction asynchrone pour gérer la connexion de l'utilisateur
async function loginUser(username, password) {
    try {
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        // Si la connexion réussit, vous pouvez stocker le token d'authentification
        const token = data.token;
        // Ensuite, vous pouvez effectuer des actions comme rediriger l'utilisateur ou stocker le token dans le stockage local pour l'utiliser dans d'autres requêtes
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        // Gérez les erreurs de connexion ici, par exemple, affichez un message d'erreur à l'utilisateur
    }
}

// Fonction asynchrone pour récupérer les travaux depuis l'API
async function fetchWorks() {
    try {
        // Envoie une requête HTTP GET à l'endpoint des travaux
        const response = await fetch(worksEndpoint);
        // Parse la réponse JSON en un objet JavaScript
        const works = await response.json();
        // Appelle la fonction pour afficher les travaux sur la page
        renderWorks(works);
    } catch (error) {
        // Affiche une erreur dans la console en cas de problème avec la requête
        console.error('Erreur lors de la récupération des travaux :', error);
    }
}

// Fonction asynchrone pour récupérer les catégories depuis l'API
async function fetchCategories() {
    try {
        // Envoie une requête HTTP GET à l'endpoint des catégories
        const response = await fetch(categoriesEndpoint);
        // Parse la réponse JSON en un objet JavaScript
        const categories = await response.json();
        // Appelle la fonction pour afficher les catégories sur la page
        renderCategories(categories);
    } catch (error) {
        // Affiche une erreur dans la console en cas de problème avec la requête
        console.error('Erreur lors de la récupération des catégories :', error);
    }
}

// Fonction pour afficher les travaux dans la galerie
function renderWorks(works) {
    // Sélectionne l'élément de la galerie dans le DOM
    const gallery = document.getElementById('gallery');
    // Vide le contenu existant de la galerie
    gallery.innerHTML = '';

    // Parcourt chaque travail et crée les éléments HTML pour les afficher
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        // Définit l'URL et l'attribut alt de l'image
        img.src = work.imageUrl;
        img.alt = work.title || 'Titre non disponible';

        const figcaption = document.createElement('figcaption');
        // Définit le texte du figcaption
        figcaption.textContent = work.title || 'Titre non disponible';

        // Ajoute l'image et le figcaption au figure, puis ajoute le figure à la galerie
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Fonction pour afficher les catégories dans le menu de filtres
function renderCategories(categories) {
    // Sélectionne l'élément du conteneur de filtres dans le DOM
    const filterContainer = document.getElementById('filter-container');
    // Vide le contenu existant du conteneur de filtres
    filterContainer.innerHTML = '';

    // Crée un bouton pour afficher tous les travaux
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    // Ajoute un gestionnaire d'événement pour afficher tous les travaux lorsque le bouton est cliqué
    allButton.addEventListener('click', () => filterWorks(null));
    // Ajoute le bouton au conteneur de filtres
    filterContainer.appendChild(allButton);

    // Parcourt chaque catégorie et crée les boutons de filtre correspondants
    categories.forEach(category => {
        const button = document.createElement('button');
        // Définit le texte du bouton de filtre
        button.textContent = category.name;
        // Ajoute un gestionnaire d'événement pour filtrer les travaux par catégorie lorsque le bouton est cliqué
        button.addEventListener('click', () => filterWorks(category.id));
        // Ajoute le bouton au conteneur de filtres
        filterContainer.appendChild(button);
    });
}

// Fonction pour filtrer les travaux par catégorie
function filterWorks(categoryId) {
    
    // Récupère à nouveau les travaux depuis l'API
    fetch(worksEndpoint)
        .then(response => response.json())
        .then(works => {
            // Si une catégorie est sélectionnée, filtre les travaux par catégorie
            if (categoryId) {
                works = works.filter(work => work.categoryId === categoryId);
            }
            // Affiche les travaux filtrés
            renderWorks(works);
        })
        .catch(error => console.error('Erreur lors du filtrage des travaux :', error));
}

// Ajoute des écouteurs d'événement qui s'exécutent lorsque le contenu du DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Appelle les fonctions pour récupérer et afficher les travaux et les catégories
    fetchWorks();
    fetchCategories();

    const loginSection = document.getElementById('loginOverlay');
    const closeOverlay = document.getElementById('closeOverlay');
    const loginButton = document.getElementById('loginButton');

    // Fonction pour masquer tous les éléments de la page
    function hidePageElements() {
        document.body.style.overflow = 'hidden'; // Empêche le défilement
        document.querySelectorAll('main > section:not(#loginSection)').forEach(element => {
            element.style.display = 'none'; // Masque les éléments
        });
    }

    // Fonction pour afficher tous les éléments de la page
    function showPageElements() {
        document.body.style.overflow = ''; // Rétablit le défilement
        document.querySelectorAll('header, main, footer').forEach(element => {
            element.style.display = ''; // Affiche les éléments
        });
    }

    // Ajoutez un gestionnaire d'événement de clic à l'élément <li> loginButton
    loginButton.addEventListener('click', () => {
        hidePageElements(); // Masque tous les éléments de la page
        loginSection.style.display = 'block'; // Affiche la section de connexion
        loginButton.classList.toggle('bold'); // Toggle the 'bold' class on click
    });

    // Ajoutez un gestionnaire d'événement de clic au bouton de fermeture de la section de connexion
    closeOverlay.addEventListener('click', () => {
        loginSection.style.display = 'none'; // Masque la section de connexion
        showPageElements(); // Affiche tous les éléments de la page
    });

    // Ajoutez un gestionnaire d'événement pour soumettre le formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            await loginUser(username, password);
            // Si la connexion réussit, masquez la section de connexion
            loginSection.style.display = 'none';
            showPageElements(); // Affiche tous les éléments de la page
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            // Gérez les erreurs de connexion ici
        }
    });
});

