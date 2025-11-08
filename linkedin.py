import time,math,random,os
import utils,constants,config
import pickle, hashlib

from selenium import webdriver
from selenium.webdriver.common.by import By

from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService

class Linkedin:
    def __init__(self):
            utils.prYellow("🤖 Merci d'utiliser le bot Easy Apply Jobs, pour plus d'informations vous pouvez visiter notre site - www.automated-bots.com")
            utils.prYellow("🌐 Le bot s'exécutera dans le navigateur Chrome et se connectera à Linkedin pour vous.")
            self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()),options=utils.chromeBrowserOptions())
            self.cookies_path = f"{os.path.join(os.getcwd(),'cookies')}/{self.getHash(config.email)}.pkl"
            self.driver.get('https://www.linkedin.com')
            self.loadCookies()

            if not self.isLoggedIn():
                self.driver.get("https://www.linkedin.com/login?trk=guest_homepage-basic_nav-header-signin")
                utils.prYellow("🔄 Tentative de connexion à Linkedin...")
                try:
                    self.driver.find_element("id","username").send_keys(config.email)
                    time.sleep(2)
                    self.driver.find_element("id","password").send_keys(config.password)
                    time.sleep(2)
                    self.driver.find_element("xpath",'//button[@type="submit"]').click()
                    time.sleep(30)
                except:
                    utils.prRed("❌ Impossible de se connecter à Linkedin en utilisant Chrome. Veuillez vérifier vos identifiants Linkedin dans les fichiers config lignes 7 et 8.")

                self.saveCookies()
            # démarrer l'application
            self.linkJobApply()

    def getHash(self, string):
        # Génère un hash MD5 pour identifier de manière unique les cookies de l'utilisateur
        return hashlib.md5(string.encode('utf-8')).hexdigest()

    def loadCookies(self):
        # Charge les cookies sauvegardés pour éviter de se reconnecter à chaque fois
        if os.path.exists(self.cookies_path):
            cookies =  pickle.load(open(self.cookies_path, "rb"))
            self.driver.delete_all_cookies()
            for cookie in cookies:
                self.driver.add_cookie(cookie)

    def saveCookies(self):
        # Sauvegarde les cookies de session pour une réutilisation future
        pickle.dump(self.driver.get_cookies() , open(self.cookies_path,"wb"))

    def isLoggedIn(self):
        # Vérifie si l'utilisateur est déjà connecté à Linkedin
        self.driver.get('https://www.linkedin.com/feed')
        try:
            self.driver.find_element(By.XPATH,'//*[@id="ember14"]')
            return True
        except:
            pass
        return False

    def generateUrls(self):
        # Génère les URLs de recherche d'emploi basées sur les préférences de config.py
        if not os.path.exists('data'):
            os.makedirs('data')
        try:
            with open('data/urlData.txt', 'w',encoding="utf-8" ) as file:
                linkedinJobLinks = utils.LinkedinUrlGenerate().generateUrlLinks()
                for url in linkedinJobLinks:
                    file.write(url+ "\n")
            utils.prGreen("✅ Les URLs de candidature ont été créées avec succès, le bot va maintenant visiter ces URLs.")
        except:
            utils.prRed("❌ Impossible de générer les URLs, assurez-vous d'avoir modifié le fichier config lignes 25-39")

    def linkJobApply(self):
        # Fonction principale qui parcourt toutes les offres d'emploi et postule automatiquement
        self.generateUrls()
        countApplied = 0  # Compteur d'emplois auxquels on a postulé
        countJobs = 0  # Compteur total d'emplois visités

        urlData = utils.getUrlDataFile()

        for url in urlData:
            self.driver.get(url)
            time.sleep(random.uniform(1, constants.botSpeed))

            totalJobs = self.driver.find_element(By.XPATH,'//small').text
            totalPages = utils.jobsToPages(totalJobs)

            urlWords =  utils.urlToKeywords(url)
            lineToWrite = "\n Catégorie: " + urlWords[0] + ", Localisation: " +urlWords[1] + ", Postule à " +str(totalJobs)+ " emplois."
            self.displayWriteResults(lineToWrite)

            for page in range(totalPages):
                currentPageJobs = constants.jobsPerPage * page
                url = url +"&start="+ str(currentPageJobs)
                self.driver.get(url)
                time.sleep(random.uniform(1, constants.botSpeed))

                offersPerPage = self.driver.find_elements(By.XPATH, '//li[@data-occludable-job-id]')
                offerIds = [(offer.get_attribute(
                    "data-occludable-job-id").split(":")[-1]) for offer in offersPerPage]
                time.sleep(random.uniform(1, constants.botSpeed))

                for offer in offersPerPage:
                    if not self.element_exists(offer, By.XPATH, ".//*[contains(text(), 'Applied')]"):
                        offerId = offer.get_attribute("data-occludable-job-id")
                        offerIds.append(int(offerId.split(":")[-1]))

                for jobID in offerIds:
                    offerPage = 'https://www.linkedin.com/jobs/view/' + str(jobID)
                    self.driver.get(offerPage)
                    time.sleep(random.uniform(1, constants.botSpeed))

                    countJobs += 1

                    jobProperties = self.getJobProperties(countJobs)
                    if "blacklisted" in jobProperties:
                        lineToWrite = jobProperties + " | " + "* 🤬 Emploi sur liste noire, ignoré!: " +str(offerPage)
                        self.displayWriteResults(lineToWrite)
                    
                    else :                    
                        easyApplybutton = self.easyApplyButton()

                        if easyApplybutton is not False:
                            easyApplybutton.click()
                            time.sleep(random.uniform(1, constants.botSpeed))
                            
                            try:
                                self.chooseResume()
                                self.driver.find_element(By.CSS_SELECTOR, "button[aria-label='Submit application']").click()
                                time.sleep(random.uniform(1, constants.botSpeed))

                                lineToWrite = jobProperties + " | " + "* 🥳 Candidature envoyée pour cet emploi: "  +str(offerPage)
                                self.displayWriteResults(lineToWrite)
                                countApplied += 1

                            except:
                                try:
                                    self.driver.find_element(By.CSS_SELECTOR,"button[aria-label='Continue to next step']").click()
                                    time.sleep(random.uniform(1, constants.botSpeed))
                                    self.chooseResume()
                                    comPercentage = self.driver.find_element(By.XPATH,'html/body/div[3]/div/div/div[2]/div/div/span').text
                                    percenNumber = int(comPercentage[0:comPercentage.index("%")])
                                    result = self.applyProcess(percenNumber,offerPage)
                                    lineToWrite = jobProperties + " | " + result
                                    self.displayWriteResults(lineToWrite)

                                except Exception:
                                    self.chooseResume()
                                    lineToWrite = jobProperties + " | " + "* 🥵 Impossible de postuler à cet emploi! " +str(offerPage)
                                    self.displayWriteResults(lineToWrite)
                        else:
                            lineToWrite = jobProperties + " | " + "* 🥳 Déjà postulé! Emploi: " +str(offerPage)
                            self.displayWriteResults(lineToWrite)


            utils.prYellow("Catégorie: " + urlWords[0] + "," +urlWords[1]+ " postulé: " + str(countApplied) +
                  " emplois sur " + str(countJobs) + ".")
        
        utils.donate(self)

    def chooseResume(self):
        # Sélectionne automatiquement le CV préféré parmi ceux enregistrés sur Linkedin
        try:
            self.driver.find_element(
                By.CLASS_NAME, "jobs-document-upload__title--is-required")
            resumes = self.driver.find_elements(
                By.XPATH, "//div[contains(@class, 'ui-attachment--pdf')]")
            if (len(resumes) == 1 and resumes[0].get_attribute("aria-label") == "Select this resume"):
                resumes[0].click()
            elif (len(resumes) > 1 and resumes[config.preferredCv-1].get_attribute("aria-label") == "Select this resume"):
                resumes[config.preferredCv-1].click()
            elif (type(len(resumes)) != int):
                utils.prRed(
                    "❌ Aucun CV n'a été sélectionné, veuillez ajouter au moins un CV à votre compte Linkedin.")
        except:
            pass

    def getJobProperties(self, count):
        # Récupère les informations de l'offre d'emploi (titre, entreprise, localisation)
        textToWrite = ""
        jobTitle = ""
        jobLocation = ""

        try:
            jobTitle = self.driver.find_element(By.XPATH, "//h1[contains(@class, 'job-title')]").get_attribute("innerHTML").strip()
            res = [blItem for blItem in config.blackListTitles if (blItem.lower() in jobTitle.lower())]
            if (len(res) > 0):
                jobTitle += "(titre sur liste noire: " + ' '.join(res) + ")"
        except Exception as e:
            if (config.displayWarnings):
                utils.prYellow("⚠️ Avertissement lors de la récupération du titre: " + str(e)[0:50])
            jobTitle = ""

        try:
            time.sleep(5)
            jobDetail = self.driver.find_element(By.XPATH, "//div[contains(@class, 'job-details-jobs')]//div").text.replace("·", "|")
            res = [blItem for blItem in config.blacklistCompanies if (blItem.lower() in jobTitle.lower())]
            if (len(res) > 0):
                jobDetail += "(entreprise sur liste noire: " + ' '.join(res) + ")"
        except Exception as e:
            if (config.displayWarnings):
                print(e)
                utils.prYellow("⚠️ Avertissement lors de la récupération des détails: " + str(e)[0:100])
            jobDetail = ""

        try:
            jobWorkStatusSpans = self.driver.find_elements(By.XPATH, "//span[contains(@class,'ui-label ui-label--accent-3 text-body-small')]//span[contains(@aria-hidden,'true')]")
            for span in jobWorkStatusSpans:
                jobLocation = jobLocation + " | " + span.text

        except Exception as e:
            if (config.displayWarnings):
                print(e)
                utils.prYellow("⚠️ Avertissement lors de la récupération de la localisation: " + str(e)[0:100])
            jobLocation = ""

        textToWrite = str(count) + " | " + jobTitle +" | " + jobDetail + jobLocation
        return textToWrite

    def easyApplyButton(self):
        # Recherche le bouton "Postuler facilement" sur la page de l'offre
        try:
            time.sleep(random.uniform(1, constants.botSpeed))
            button = self.driver.find_element(By.XPATH, "//div[contains(@class,'jobs-apply-button--top-card')]//button[contains(@class, 'jobs-apply-button')]")
            EasyApplyButton = button
        except:
            EasyApplyButton = False

        return EasyApplyButton

    def applyProcess(self, percentage, offerPage):
        # Processus de candidature pour les offres multi-pages
        applyPages = math.floor(100 / percentage) - 2
        result = ""
        for pages in range(applyPages):
            self.driver.find_element(By.CSS_SELECTOR, "button[aria-label='Continue to next step']").click()

        self.driver.find_element( By.CSS_SELECTOR, "button[aria-label='Review your application']").click()
        time.sleep(random.uniform(1, constants.botSpeed))

        if config.followCompanies is False:
            try:
                self.driver.find_element(By.CSS_SELECTOR, "label[for='follow-company-checkbox']").click()
            except:
                pass

        self.driver.find_element(By.CSS_SELECTOR, "button[aria-label='Submit application']").click()
        time.sleep(random.uniform(1, constants.botSpeed))

        result = "* 🥳 Candidature envoyée pour cet emploi: " + str(offerPage)

        return result

    def displayWriteResults(self,lineToWrite: str):
        try:
            print(lineToWrite)
            utils.writeResults(lineToWrite)
        except Exception as e:
            utils.prRed("❌ Error in DisplayWriteResults: " +str(e))

    def element_exists(self, parent, by, selector):
        return len(parent.find_elements(by, selector)) > 0

start = time.time()
Linkedin().linkJobApply()
end = time.time()
utils.prYellow("---Took: " + str(round((time.time() - start)/60)) + " minute(s).")
