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

    function activateEditMode() {
        const editBanner = document.createElement('div');
        editBanner.id = 'editBanner';
        editBanner.textContent = 'Mode Édition';
        document.body.insertBefore(editBanner, document.body.firstChild);

        const modifyButton = document.createElement('button');
        modifyButton.id = 'modifyButton';
        modifyButton.textContent = 'Modifier';
        document.getElementById('modifyButtonContainer').appendChild(modifyButton);

        const filterContainer = document.getElementById('filter-container');
        filterContainer.style.display = 'none';

        loginButton.textContent = 'logout';
        loginButton.classList.remove('bold');

        loginButton.removeEventListener('click', showLoginOverlay);
        loginButton.addEventListener('click', logoutUser);
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