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
        figure.dataset.categoryId=work.category.id
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
    document.querySelectorAll(".gallery figure").forEach((item,i) => {
            item.classList.remove('hide')
    })
    document.querySelectorAll(".gallery figure").forEach((item,i) => {
        const cat = item.dataset.categoryId
        console.log(cat)
        console.log(categoryId)
        console.log(cat == categoryId)
        if(cat == categoryId)
            item.classList.add('hide')
    })

    
    
    // fetch(worksEndpoint)
    //     .then(response => response.json())
    //     .then(works => {
    //         if (categoryId) {
    //             works = works.filter(work => work.categoryId === categoryId);
    //         }
    //         renderWorks(works);
    //     })
    //     .catch(error => console.error('Erreur lors du filtrage des travaux :', error));
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

    // loginButton.addEventListener('click', () => {
    //     hidePageElements();
    //     loginSection.style.display = 'block';
    //     loginButton.classList.toggle('bold');
    // });


    async function renderWorksInOverlay(works, overlay) {
        const overlayContent = document.getElementById('overlayContent');
        const div = document.createElement('div')
        div.id='div'
    
        works.forEach(work => {
            const card = createCardElement(work);
            div.appendChild(card);
            
        });
        overlayContent.append(div)
    }

    async function activateEditMode() {
        // const editBanner = document.createElement('button'); // Modifier la création pour un bouton
        // const icon = document.createElement('i');
        // editBanner.id = 'editBanner';
        // editBanner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode Édition';
        // document.body.insertBefore(editBanner, document.body.firstChild);

        // editBanner.addEventListener('click', function() {
        //     document.getElementById('overlay').style.display = 'flex';
        // });




        // const modifyButton = document.createElement('button'); // Modifier la création pour un bouton
        // modifyButton.id = 'modifyButton';
        // icon.classList.add('fa-regular', 'fa-pen-to-square');
        // modifyButton.appendChild(icon);
        // modifyButton.appendChild(document.createTextNode(' Modifier'));
        // document.getElementById('modifyButtonContainer').appendChild(modifyButton);
    

        // modifyButton.addEventListener('click', function() {
        //     document.getElementById('overlay').style.display = 'flex';
        // });

        // const filterContainer = document.getElementById('filter-container');
        // filterContainer.style.display = 'none';

        // const overlay = document.getElementById('overlay');
        // overlay.style.display = 'flex';

        // document.getElementById('closeOverlay').addEventListener('click', function() {
        //     document.getElementById('overlay').style.display = 'none';
        // })
    
        // loginButton.textContent = 'logout';
        // loginButton.classList.remove('bold');
    
        // loginButton.removeEventListener('click', showLoginOverlay);
        // loginButton.addEventListener('click', logoutUser);
        







        
        try {
            const response = await fetch(worksEndpoint);
            const works = await response.json();
            renderWorksInOverlay(works, overlay);
        } catch (error) {
            console.error('Erreur lors de la récupération des travaux pour l\'overlay :', error);
        }
    }
    
    function createCardElement(work) {
        const card = document.createElement('div');
        const authToken = localStorage.authToken
        card.classList.add('card');

        const trashIcon = document.createElement('i')
        trashIcon.className = 'fa-solid fa-trash'
        trashIcon.addEventListener('click', async (item,i) => {
            console.log("http://localhost:5678/api/works/"+work.id)
            let deleteWork = await fetch("http://localhost:5678/api/works/"+work.id, {
                method: "DELETE"
                , headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            deleteWork = deleteWork.json()
            console.log(deleteWork)
        })
    
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title || 'Image indisponible';

        card.appendChild(img);
        card.appendChild(trashIcon);
    
        const title = document.createElement('h3');
        // title.textContent = work.title || 'Titre indisponible';
        card.appendChild(title);
    
        // Ajoutez d'autres éléments de carte comme la description, les boutons, etc. si nécessaire
    
        return card;
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