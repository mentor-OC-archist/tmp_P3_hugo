import MyClass from "./assets/js/MyClass.js"


const worksEndpoint = 'http://localhost:5678/api/works';
const categoriesEndpoint = 'http://localhost:5678/api/categories';


async function fetchWorks() {
    try {
        const response = await fetch(worksEndpoint);
        const works = await response.json();
        renderWorks(works);
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux :', error);
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(categoriesEndpoint);
        const categories = await response.json();
        renderCategories(categories);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
    }
}

function renderWorks(works) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Vider le contenu existant

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
    filterContainer.innerHTML = ''; // Vider le contenu existant

    // Ajouter un bouton pour afficher tous les travaux
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
});
