//import MyClass from "./assets/js/MyClass.js"

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
            body: JSON.stringify({ email: username, password: password })
        });
        const data = await response.json();

        if (response.ok) {
            const token = data.token;
            localStorage.setItem('authToken', token);
            return true;
        } else {
            console.error('Erreur lors de la connexion :', data.message);
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return false;
    }
}

// Fonction asynchrone pour récupérer les travaux depuis l'API
async function fetchWorks() {
    try {
        const response = await fetch(worksEndpoint);
        const works = await response.json();
        renderWorks(works);
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux :', error);
    }
}

// Fonction asynchrone pour récupérer les catégories depuis l'API
async function fetchCategories() {
    try {
        const response = await fetch(categoriesEndpoint);
        const categories = await response.json();
        renderCategories(categories);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
    }
}

// Fonction pour afficher les travaux dans la galerie
function renderWorks(works) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.dataset.categoryId=work.category.name
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title || 'Titre non disponible';

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title || 'Titre non disponible';

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Fonction pour afficher les catégories dans le menu de filtres
function renderCategories(categories) {
    const filterContainer = document.getElementById('filter-container');
    filterContainer.innerHTML = '';

    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', () => filterWorks(null));
    filterContainer.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', () => filterWorks(category.id));
        filterContainer.appendChild(button);
    });
}

// Fonction pour filtrer les travaux par catégorie
function filterWorks(categoryId) {
    // supprimer toutes les .hide
    // document.querySelectorALL(".gallery figure").forEach()
    fetch(worksEndpoint)
        .then(response => response.json())
        .then(works => {
            if (categoryId) {
                works = works.filter(work => work.categoryId === categoryId);
            }
            renderWorks(works);
        })
        .catch(error => console.error('Erreur lors du filtrage des travaux :', error));
}


document.addEventListener('DOMContentLoaded', () => {
    fetchWorks();
    fetchCategories();

    const loginSection = document.getElementById('loginOverlay');
    const loginButton = document.getElementById("loginButton");
    
    function hidePageElements() {
        document.body.style.overflow = 'hidden';
        document.querySelectorAll('main > section:not(#loginSection)').forEach(element => {
            element.style.display = 'none';
        });
    }

    function showPageElements() {
        document.body.style.overflow = '';
        document.querySelectorAll('header, main, footer').forEach(element => {
            element.style.display = '';
        });
    }

    loginButton.addEventListener('click', () => {
        hidePageElements();
        loginSection.style.display = 'block';
        loginButton.classList.toggle('bold');
    });

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const isSuccess = await loginUser(username, password);

        if (isSuccess) {
            loginSection.style.display = 'none';
            showPageElements();
            activateEditMode();
        }
    });

    async function renderWorksInOverlay(works, overlay) {
        const cardsContainer = document.getElementById('cardsContainer'); 
        cardsContainer.innerHTML = '';

        works.forEach(work => {
            const card = createCardElement(work);
            cardsContainer.appendChild(card);
        });
    }



    async function activateEditMode() {
        const editBanner = document.createElement('button'); // Modifier la création pour un bouton
        const icon = document.createElement('i');
        editBanner.id = 'editBanner';
        editBanner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode Édition';
        document.body.insertBefore(editBanner, document.body.firstChild);

        const modifyButton = document.createElement('button'); // Modifier la création pour un bouton
        modifyButton.id = 'modifyButton';
        icon.classList.add('fa-regular', 'fa-pen-to-square');
        modifyButton.appendChild(icon);
        modifyButton.appendChild(document.createTextNode(' Modifier'));
        document.getElementById('modifyButtonContainer').appendChild(modifyButton);
    
        const filterContainer = document.getElementById('filter-container');
        filterContainer.style.display = 'none';

        const overlay = document.getElementById('overlay');
        overlay.style.display = 'flex';

        editBanner.addEventListener('click', function() {
            document.getElementById('overlay').style.display = 'flex';
        });

        modifyButton.addEventListener('click', function() {
            document.getElementById('overlay').style.display = 'flex';
        });

        document.getElementById('closeOverlay').addEventListener('click', function() {
            document.getElementById('overlay').style.display = 'none';
        })
    
        loginButton.textContent = 'logout';
        loginButton.classList.remove('bold');
    
        loginButton.removeEventListener('click', showLoginOverlay);
        loginButton.addEventListener('click', logoutUser);
        
        try {
            const response = await fetch(worksEndpoint);
            const works = await response.json();
            renderWorksInOverlay(works, overlay);
        } catch (error) {
            console.error('Erreur lors de la récupération des travaux pour l\'overlay :', error);
        }
    }

    const addPhotoButton = document.getElementById('addPhotoButton');
    const overlayContent = document.getElementById('overlayContent');
    const closeButton = document.getElementById('closeOverlay');

    addPhotoButton.addEventListener('click', () => {
        overlayContent.innerHTML = `
            <button type="button" id="backButton">Retour</button>
            <h2>Ajouter Une Photo</h2>
            <div id="dropArea">
                <p>Glissez vos photos ici</p>
            </div>
            <input type="text" id="photoTitle" placeholder="Titre de la photo">
            <select id="categorySelect">
                <option value="">Choisir une catégorie</option>
                <!-- Ajoute les options de catégorie dynamiquement -->
        </select>
        <button type="button" id="uploadButton">Ajouter</button>
    `;

    // Code pour remplir la liste déroulante des catégories (utilise fetchCategories ou stocke les catégories localement)
    // ...

    // Code pour gérer le retour au clic sur le bouton "Retour"
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        overlayContent.innerHTML = ''; // Efface le contenu de l'overlay
        overlay.style.display = 'none'; // Masque l'overlay
    });

    // Code pour gérer le téléversement des photos
    // ...
});
    
    function createCardElement(work) {
        const card = document.createElement('div');
        card.classList.add('card');
    
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title || 'Image indisponible';
        card.appendChild(img);

        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-trash-can'); 
        card.appendChild(icon);
        icon.addEventListener('click',function() {
            deleteImage(work.id);
        });
        
    
        return card;
    }

    async function deleteImage(imageId) {
        try {
            // Demander une confirmation avant de supprimer l'image
            const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
    
            // Si l'utilisateur a confirmé la suppression
            if (confirmed) {
                const authToken = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Ajoutez le jeton JWT si nécessaire
                    },
                });
                if (response.ok) {
                    // Suppression réussie, peut-être effectuer des actions supplémentaires comme actualiser l'interface utilisateur, etc.
                    console.log('Image supprimée avec succès');
                } else {
                    // Gérer les erreurs de suppression d'image
                    console.error('Erreur lors de la suppression de l\'image');
                }
            } else {
                // Si l'utilisateur a annulé la suppression, ne rien faire
                console.log('Suppression annulée par l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'image :', error);
        }
    }

    function logoutUser() {
        localStorage.removeItem('authToken');
        window.location.reload();
    }

    function showLoginOverlay() {
        hidePageElements();
        loginSection.style.display = 'block';
    }
    
    // Si l'utilisateur est déjà connecté, activer le mode édition
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        activateEditMode();
    }
});