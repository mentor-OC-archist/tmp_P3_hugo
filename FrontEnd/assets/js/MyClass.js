import APIClass from "./APIClass.js"


export default class MyClass extends APIClass{



    constructor(props) {
        super()
        props && Object.assign(this,props)
        console.log(this)

        this.getWorks()
        this.loadHomepage()
    }
    
    loadHomepage(){
        if(localStorage.authToken){

            // HIDE/SHOW FILTER CONTAINER
            const filterContainer = document.getElementById('filter-container');
            filterContainer.style.display = 'none';

            loginButton.textContent = 'logout';
            loginButton.addEventListener('click', logoutUser);

            renderEditmodeButtons()
        }
        else{
            this.getCategories()

            loginButton.addEventListener('click', () => {
                showLoginOverlay()
                loginSection.style.display = 'block';
                // loginButton.classList.toggle('bold');
            })


            const loginForm = document.getElementById('loginForm');
            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
        
                const isSuccess = await this.loginUser(username, password);
        
                if (isSuccess) window.location.href = "index.html"
            })
        }


        // const overlay = document.getElementById('overlay');
        // overlay.style.display = 'flex';
        
        // document.getElementById('closeOverlay').addEventListener('click', function() {
        //     document.getElementById('overlay').style.display = 'none';
        // })




        // loginButton.removeEventListener('click', showLoginOverlay);
        // loginButton.classList.remove('bold');
        




        function logoutUser() {
            localStorage.removeItem('authToken');
            window.location.reload();
        }
    
        function showLoginOverlay() {
            hidePageElements();
            loginOverlay.style.display = 'block';
        }
        function showPageElements() {
            document.body.style.overflow = '';
            document.querySelectorAll('header, main, footer').forEach(element => {
                element.style.display = '';
            });
        }
        // EDIT MODE BUTTON
        const renderEditmodeButtons = () => {
            
            //BANNER
            const editBanner = document.createElement('button'); // Modifier la création pour un bouton
            const icon = document.createElement('i');
            editBanner.id = 'editBanner';
            editBanner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode Édition';
            document.body.insertBefore(editBanner, document.body.firstChild);

            editBanner.addEventListener('click', function() {
                document.getElementById('overlay').style.display = 'flex';
            });

            //BUTTON
            const modifyButton = document.createElement('button'); // Modifier la création pour un bouton
            modifyButton.id = 'modifyButton';
            icon.classList.add('fa-regular', 'fa-pen-to-square');
            modifyButton.appendChild(icon);
            modifyButton.appendChild(document.createTextNode(' Modifier'));
            document.getElementById('modifyButtonContainer').appendChild(modifyButton);
        

            modifyButton.addEventListener('click', function() {
                document.getElementById('overlay').style.display = 'flex';
            });
        }

        function hidePageElements() {
            document.body.style.overflow = 'hidden';
            document.querySelectorAll('main > section:not(#loginSection)').forEach(element => {
                element.style.display = 'none';
            });
        }

        



    }
    // Fonction asynchrone pour gérer la connexion de l'utilisateur

    
    loginUser = async (username, password) =>  {
        console.log(this.login_endpoint)
        try {
            const response = await fetch(this.login_endpoint, {
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


}
const machinchose = new MyClass()