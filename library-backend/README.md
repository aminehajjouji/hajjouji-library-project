# Hajjouji Library project – Backend

Ce projet est une API backend Java pour la gestion d'une bibliothèque, utilisant Spring Boot et JWT pour la sécurité.

## Prérequis
- Java 17 ou supérieur
- Maven 3.6+

## Installation
1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/aminehajjouji/hajjouji-library-project.git
   cd library-backend
   ```
2. **Configurer la base de données**
   - Modifier `src/main/resources/application.properties` selon vos paramètres (par défaut H2 ou autre selon votre config).

3. **Installer les dépendances**
   ```bash
   mvn clean install
   ```

## Lancement du projet
```bash
mvn spring-boot:run
```

L'application sera accessible sur :
```
http://localhost:8080
```

## Tests
Pour lancer les tests :
```bash
mvn test
```

## Technologies principales
- Spring Boot
- Spring Security
- JWT (io.jsonwebtoken)
- Maven

## Structure du projet
- `src/main/java/org/hahn/librarybackend/` : code source principal
- `src/test/java/org/hahn/librarybackend/` : tests unitaires
- `src/main/resources/` : fichiers de configuration

## Auteur
- hajjouji-hahn-project

