# Paramètres généraux du bot - pour utiliser les paramètres Pro vous devez télécharger la version Pro depuis: www.automated-bots.com

# FONCTIONNALITÉ PRO - navigateur que vous voulez que le bot utilise ex: ["Chrome"] ou ["Firefox"]. Firefox n'est supporté que dans la version Pro
browser = ["Chrome"]
# Entrez votre mot de passe et nom d'utilisateur Linkedin ci-dessous. Ne commitez pas ce fichier après avoir entré ces identifiants.
# Identifiants Linkedin
email = "YourLinkedin@UserEmail.com"
password = "YourLinkedinPassword"

# FONCTIONNALITÉ PRO - Optionnel! exécuter le navigateur en mode headless (sans interface), aucun écran de navigateur ne sera affiché, il fonctionnera en arrière-plan.
headless = False
# FONCTIONNALITÉ PRO - Optionnel! Si vous laissez les champs d'identifiants ci-dessus vides. Pour Firefox ou Chrome, entrez le répertoire du profil pour exécuter le bot et éviter de vous connecter à votre compte à chaque fois
# obtenir le chemin du profil Firefox en tapant l'url suivante: about:profiles
firefoxProfileRootDir = r""
# obtenir le chemin du profil Chrome en tapant l'url suivante: chrome://version/
chromeProfilePath = r""

# Ces paramètres sont pour exécuter le bot de candidature d'emplois Linkedin.
# localisation où vous voulez rechercher les emplois - ex : ["Poland", "Singapore", "New York City Metropolitan Area", "Monroe County"]
# localisations continentales:["Europe", "Asia", "Australia", "NorthAmerica", "SouthAmerica", "Africa", "Australia"]
location = ["NorthAmerica"]
# mots-clés liés à votre recherche d'emploi
keywords = ["frontend", "react", "typescript","javascript", "vue", "python", "programming", "blockchain"]
# niveau d'expérience du poste - ex:  ["Internship", "Entry level" , "Associate" , "Mid-Senior level" , "Director" , "Executive"]
experienceLevels = [ "Entry level" ]
# date de publication de l'emploi - ex: ["Any Time", "Past Month" , "Past Week" , "Past 24 hours"] - sélectionner seulement un
datePosted = ["Past Week"]
# type d'emploi - ex:  ["Full-time", "Part-time" , "Contract" , "Temporary", "Volunteer", "Intership", "Other"]
jobType = ["Full-time", "Part-time" , "Contract"]
# mode de travail  - ex: ["On-site" , "Remote" , "Hybrid"]
remote = ["On-site" , "Remote" , "Hybrid"]
# salaire - ex:["$40,000+", "$60,000+", "$80,000+", "$100,000+", "$120,000+", "$140,000+", "$160,000+", "$180,000+", "$200,000+" ] - sélectionner seulement un
salary = [ "$80,000+"]
# tri - ex:["Recent"] ou ["Relevent"] - sélectionner seulement un
sort = ["Recent"]
# Liste noire des entreprises auxquelles vous ne voulez pas postuler - ex: ["Apple","Google"]
blacklistCompanies = []
# Liste noire des mots-clés dans le titre - ex:["manager", ".Net"]
blackListTitles = []
# Suivre les entreprises après une candidature réussie True - oui, False - non
followCompanies = False
# Les paramètres ci-dessous sont pour le bot Linkedin Pro, vous pouvez acheter un abonnement mensuel ou annuel pour les utiliser.
# FONCTIONNALITÉ PRO! - Si vous avez plusieurs CV, vous pouvez choisir lequel vous voulez que le bot utilise. (1- le premier de la liste, 2 - le second, etc)
preferredCv = 1
# FONCTIONNALITÉ PRO! - Sortir les questions non répondues dans un fichier texte séparé, affichera les questions de type radio, dropdown et champ de saisie dans un fichier .yaml séparé
outputSkippedQuestions = True
# FONCTIONNALITÉ PRO! - Utiliser l'IA pour remplir et répondre aux questions ignorées. Coûtera 5 crédits par réponse à cause de la puissance de calcul.
useAiAutocomplete = False
# FONCTIONNALITÉ PRO! - Postuler uniquement à ces entreprises -  ex: ["Apple","Google"] -  laisser vide pour toutes les entreprises
onlyApplyCompanies = []
# FONCTIONNALITÉ PRO! - Postuler uniquement aux titres ayant ces mots-clés -  ex:["web", "remote"] - laisser vide pour tous les titres
onlyApplyTitles = []
# FONCTIONNALITÉ PRO! - Ne pas postuler à l'emploi publié par un recruteur contenant ceci dans son nom - ex: ["adam","Sarah"]
blockHiringMember = []
# FONCTIONNALITÉ PRO! - Postuler uniquement aux emplois publiés par un recruteur contenant ceci dans son nom - ex: ["adam","Sarah"]
onlyApplyHiringMember = []
# FONCTIONNALITÉ PRO! - Postuler uniquement aux emplois ayant moins de candidatures - ex:["100"] postulera aux emplois ayant jusqu'à 100 candidatures
onlyApplyMaxApplications = []
# FONCTIONNALITÉ PRO! - Postuler uniquement aux emplois ayant plus de candidatures - ex:["10"] postulera aux emplois ayant plus de 10 candidatures
onlyApplyMinApplications = []
# FONCTIONNALITÉ PRO! - Postuler uniquement aux emplois ayant ces mots-clés dans la description de l'emploi
onlyApplyJobDescription = []
# FONCTIONNALITÉ PRO! - Ne pas postuler aux emplois ayant ces mots-clés dans la description de l'emploi
blockJobDescription = []
# FONCTIONNALITÉ PRO! - Postuler aux entreprises ayant un nombre égal ou supérieur d'employés - ex: ["100"]
onlyAppyMimEmployee = []
# FONCTIONNALITÉ PRO - Postuler uniquement à ceux pour lesquels linkedin dit "vous pourriez être un bon candidat"
onlyApplyLinkedinRecommending = False
# FONCTIONNALITÉ PRO - Postuler uniquement à ceux pour lesquels vous avez un badge de compétence
onlyApplySkilledBages = False
# FONCTIONNALITÉ PRO! - Sauvegarder les emplois en appuyant sur le bouton SAVE avant de postuler  True - oui, False - non
saveBeforeApply = False
# FONCTIONNALITÉ PRO! - Envoyer un message au responsable du recrutement une fois que vous postulez pour le poste
messageToHiringManager = ""
# FONCTIONNALITÉ PRO! - Lister et afficher les liens des emplois non Easy Apply
listNonEasyApplyJobsUrl = False
# FONCTIONNALITÉ PRO! - Sélectionner le bouton radio pour les questions non répondues. Si le bot ne peut pas trouver de réponse pour un bouton radio, il sélectionnera automatiquement la première ou la deuxième option. Réponse par défaut du bouton radio, 1 pour Oui, 2 pour Non. Laisser vide si vous ne voulez pas cette option.
defaultRadioOption = 1
# FONCTIONNALITÉ PRO! - Cocher oui ou non à toutes les questions de type checkbox (True - oui, False - non), laisser vide si vous ne voulez pas cette option
answerAllCheckboxes = ""
# FONCTIONNALITÉ PRO! - Type de fichier de sortie. Peut être .txt ou .csv (excel)
outputFileType = [".txt"]

# Ces paramètres sont pour exécuter le bot de candidature d'emplois AngelCO, vous devez acheter le bot AngelCo, obtenir le mot de passe du bot, le coller ci-dessous puis exécuter le bot.
AngelCoBotPassword = ""
# Identifiants AngelCO
AngelCoEmail = ""
AngelCoPassword = ""
# titre d'emploi ex: ["Frontend Engineer", "Marketing"]
angelCoJobTitle = ["Frontend Engineer"]
# localisation ex: ["Poland"]
angelCoLocation = ["Poland"]

# Ces paramètres sont pour exécuter le bot de candidature d'emplois GlobalLogic, vous devez acheter le bot GlobalLogic, obtenir le mot de passe du bot, le coller ci-dessous puis exécuter le bot.
GlobalLogicBotPassword = ""
# Identifiants GlobalLogic
GlobalLogicEmail = ""
GlobalLogicPassword = ""
# Fonctions ex: ["Administration", "Business Development", "Business Solutions", "Content Engineering",
# Delivery Enablement", Engineering, Finance, IT Infrastructure, Legal, Marketing, People Development,
# Process Management, Product Support, Quality Assurance,Sales, Sales Enablement,Technology, Usability and Design]
GlobalLogicFunctions = ["Engineering"]
# Expérience Global logic: ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10-15 years","15+ years"]
GlobalLogicExperience = ["0-1 years", "1-3 years"]
# Filtre de localisation Global logic: ["Argentina", "Chile", "Crotia", "Germany", "India","Japan", "Poland"
# Romania, Sweden, Switzerland,Ukraine, United States]
GlobalLogicLocation = ["poland"]
# Freelance oui ou non
GlobalLogicFreelance = ["no"]
# Travail à distance oui ou non
GlobalLogicRemoteWork = ["yes"]
# Optionnel! Mot-clé:["javascript", "react", "angular", ""]
GlobalLogicKeyword = ["react"]
# Paramètres de candidature d'emploi Global Logic
FirstName = "O"
LastName = "D"
Email = "asdsa@gmail.com"
LinkedInProfileURL = "www.google.com"
Phone = "" # OPTIONNEL
Location = "" # OPTIONNEL
HowDidYouHeard = "" # OPTIONNEL
ConsiderMeForFutureOffers = True # true = oui, false = non

 # Fonctionnalités de test et débogage
displayWarnings = False