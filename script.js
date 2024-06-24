let arePasswordsVisible = false; // Placez la déclaration ici, avant toute fonction ou utilisation

        let blacklist = [];

        document.addEventListener("DOMContentLoaded", () => {
            // Récupérer les mots de passe du stockage local
            let passwords = JSON.parse(localStorage.getItem('safePasswords')) || [];

            // Ajouter les mots de passe au menu déroulant
            const dropdown = document.getElementById("safe-passwords");
            passwords.forEach(password => {
                const option = document.createElement("option");
                option.value = password;
                option.text = arePasswordsVisible ? password : "*".repeat(password.length);
                dropdown.add(option);
            });
        });


        fetch("blacklisted_passwords.txt")
            .then((response) => response.text())
            .then((data) => {
                blacklist = data.split('\n').map((line) => line.trim());
            })
            .catch((error) => console.error("Error while loading the list", error));


        function validatePassword() {
            const password = document.getElementById("password-input").value;
            const resultDiv = document.getElementById("verification-result");

            if (blacklist.includes(password) && password.trim() !== "") {
                resultDiv.innerText = "This password is Blacklisted.";
                resultDiv.style.color = 'red';
                alert(resultDiv.innerText)
            } else if (password.trim() === "") {
                alert("Empty Password")
            } else {
                resultDiv.innerText = "This Password is safe";
                resultDiv.style.color = 'green';
                alert(resultDiv.innerText)
            }
        }

        function checkPasswordStrength(password) {
            const regexMinLength = /^.{8,}$/;
            const regexDigit = /.*[0-9].*/;
            const regexUpper = /.*[A-Z].*/;
            const regexLower = /.*[a-z].*/;
            const regexSpecial = /.*[!@#$%^&*(),.?":{}|<>].*/;

            const resultDiv = document.getElementById("verification-result");
            resultDiv.innerText = ""; // Réinitialise le message de validation

            let score = 0;

            const contrainte1 = document.getElementById("contrainte1");
            const contrainte2 = document.getElementById("contrainte2");
            const contrainte3 = document.getElementById("contrainte3");
            const contrainte4 = document.getElementById("contrainte4");
            const contrainte5 = document.getElementById("contrainte5");

            if (regexMinLength.test(password)) {
                score++;
                contrainte1.style.color = "#32CD32";
                contrainte1.style.fontWeight = "bold";
            } else {
                contrainte1.style.color = "";
                contrainte1.style.fontWeight = "normal";
            }

            if (regexDigit.test(password)) {
                score++;
                contrainte4.style.color = "#32CD32";
                contrainte4.style.fontWeight = "bold";
            } else {
                contrainte4.style.color = "";
                contrainte4.style.fontWeight = "normal";
            }

            if (regexUpper.test(password)) {
                score++;
                contrainte2.style.color = "#32CD32";
                contrainte2.style.fontWeight = "bold";
            } else {
                contrainte2.style.color = "";
                contrainte2.style.fontWeight = "normal";
            }

            if (regexLower.test(password)) {
                score++;
                contrainte3.style.color = "#32CD32";
                contrainte3.style.fontWeight = "bold";
            } else {
                contrainte3.style.color = "";
                contrainte3.style.fontWeight = "normal";
            }

            if (regexSpecial.test(password)) {
                score++;
                contrainte5.style.color = "#32CD32";
                contrainte5.style.fontWeight = "bold";
            } else {
                contrainte5.style.color = "";
                contrainte5.style.fontWeight = "normal";
            }


            let securityIndicator = document.getElementById("security-indicator");
            let strengthBar = document.getElementById("strength-bar");

            // Si le champ de mot de passe est vide, réinitialiser la barre de force
            if (password === "") {
                securityIndicator.style.backgroundColor = 'grey';
                securityIndicator.innerText = 'Empty';
                strengthBar.style.width = '0%';
                return;
            }

            switch (score) {
                case 5:
                    securityIndicator.style.backgroundColor = '#32CD32';
                    securityIndicator.innerText = 'Perfect';
                    strengthBar.style.width = '100%';
                    strengthBar.style.backgroundColor = '#32CD32';
                    break;
                case 4:
                    securityIndicator.style.backgroundColor = 'LightSalmon';
                    securityIndicator.innerText = 'Could be better';
                    strengthBar.style.width = '75%';
                    strengthBar.style.backgroundColor = 'LightSalmon';
                    break;
                case 3:
                    securityIndicator.style.backgroundColor = 'orange';
                    securityIndicator.innerText = 'Could be better';
                    strengthBar.style.width = '50%';
                    strengthBar.style.backgroundColor = 'orange';
                    break;
                case 2:
                case 1:
                    securityIndicator.style.backgroundColor = 'red';
                    securityIndicator.innerText = 'Not safe enough';
                    strengthBar.style.width = '25%';
                    strengthBar.style.backgroundColor = 'red';
                    break;
            }
        }

        function togglePassword() {
            const input = document.getElementById("password-input");
            const toggle = document.getElementById("toggle-password");
            if (input.type === "password") {
                input.type = "text";
                toggle.textContent = "🙈 Hide";
            } else {
                input.type = "password";
                toggle.textContent = "👁️ Show";
            }
        }

        document.getElementById("password-input").addEventListener("input", (e) => {
            const password = e.target.value;
            checkPasswordStrength(password); // Continue de vérifier la force du mot de passe
        });

        // Fonction pour sauvegarder les mots de passe dans le stockage local
        function savePasswordsToLocalStorage(passwords) {
            localStorage.setItem('safePasswords', JSON.stringify(passwords)); // Sauvegarder en tant que JSON
        }

        // Fonctions qui utilisent cette variable
        function addToSafePasswords() {
            const password = document.getElementById("password-input").value;
            const strengthBar = document.getElementById("strength-bar").style.width;
            const resultDiv = document.getElementById("verification-result");
            if (strengthBar === "100%" && resultDiv.innerText !== "This Password is safe") {
                alert("The Password must be verified before being added")
            } else if (strengthBar !== "100%" && resultDiv.innerText === "This Password is safe") {
                alert("The password must meet all criteria to be added.")
            }
            else if (strengthBar === "100%" && resultDiv.innerText === "This Password is safe") {
                // Récupérer les mots de passe déjà enregistrés
                let passwords = JSON.parse(localStorage.getItem('safePasswords')) || [];

                // Ajouter le nouveau mot de passe
                passwords.push(password);
                savePasswordsToLocalStorage(passwords); // Sauvegarder les mots de passe mis à jour

                const dropdown = document.getElementById("safe-passwords");
                const option = document.createElement("option");
                option.value = password;
                option.text = arePasswordsVisible ? password : "*".repeat(password.length); // Utilisation de la variable
                dropdown.add(option); // Ajout au menu déroulant
                alert("Password successfully added");
            } else {
                alert("The Password must be verified before being added");
            }
        }

        function togglePasswords() {
            const dropdown = document.getElementById("safe-passwords");
            const toggleButton = document.getElementById("toggle-passwords");

            if (arePasswordsVisible) {
                // Masquer les caractères avec des *
                for (let i = 1; i < dropdown.options.length; i++) { // Exclure le premier option
                    const password = dropdown.options[i].value;
                    dropdown.options[i].text = "*".repeat(password.length); // Masquer le texte
                }
                toggleButton.textContent = "👁️ Show Password"; // Changer le texte du bouton
            } else {
                // Afficher les caractères
                for (let i = 1; i < dropdown.options.length; i++) {
                    dropdown.options[i].text = dropdown.options[i].value; // Afficher le texte
                }
                toggleButton.textContent = "🙈 Hide Password"; // Changer le texte du bouton
            }
            arePasswordsVisible = !arePasswordsVisible; // Basculer l'état
        }

        function removeLastPassword() {
            // Récupérer les mots de passe du stockage local
            let passwords = JSON.parse(localStorage.getItem('safePasswords')) || [];
        
            if (passwords.length === 0) {
                alert("No Password to delete");
                return;
            }
        
            // Retirer le dernier mot de passe de la liste
            passwords.pop(); // Retirer le dernier élément
            // Mettre à jour le stockage local
            localStorage.setItem('safePasswords', JSON.stringify(passwords));
        
            // Mettre à jour le menu déroulant
            const dropdown = document.getElementById("safe-passwords");
            dropdown.remove(dropdown.options.length - 1); // Supprimer le dernier élément
        
            alert("The last Passwoed has been deleted");
        }
        