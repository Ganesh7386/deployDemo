const puppeteer = require("puppeteer")
const {v4 : uuidv4} = require("uuid"); 



const startScraping = async (searchValue)=> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    // console.log(browser)
    console.log("browser launched")
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.goto(`https://medium.com/search?q=${searchValue}` ,  { waitUntil: 'networkidle2' });
    let scrapedDataList = []

    try {
        /* allArticleElements variable stores multiple all div ontainers with tag name as article
            async page.$$() retrieves all article tags
        */
        const allArticleElements = await page.$$('article');
        for(let i=0;i<allArticleElements.length - 2; i++) {
            let eachArticleInfoObj = {}
            let eachArticle = allArticleElements[i];
            /*
                async eachArticle.$() retireves pragraph element
                page.evaluate() is for extracting text Content present in Paragraph element
            */
            const authorName = await eachArticle.$('p')
            const authorNameText = await page.evaluate(el => el.textContent , authorName)

            /*
                async eachArticle.$() retireves h2 element
                async page.evaluate() is for extracting text Content present in h2 element
            */
            
            const highlightText = await eachArticle.$('h2')
            const highlightTextContent = await page.evaluate(el=>el.textContent , highlightText)
            
            /*
                await eachArticle.$() retrieves img element which has profile image url of each author in an article
                await profileImgElement.evaluateHandle() takes callback and returns src attribute value in form of jsHandle object
                with the use of jsonValue() method , extracts reference value which was stored in src

            */
            const  profileImgElement= await eachArticle.$("img");
            const imageUrl = await profileImgElement.evaluateHandle(img => img.getAttribute('src'));
            const extractedProfileImgUrl = await imageUrl.jsonValue();
            
            /*
                I have used child tag selectors to navigate to the element , where published date is stored
                due to usage of this much hierarchy tracing , some times it fails and returns error , but retrying again from forntend side , it could get results
            */
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            try {
                await eachArticle.waitForSelector("div > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a > span > div");
            }
            catch(e) {
                console.log(e.message);
            }
            
            const mainCont = await eachArticle.$("div > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a > span > div");
            // console.log(mainCont)
            let calculatedPostedDate;
            const allSpans = await mainCont.getProperty('innerText')
            const reqText = await allSpans.jsonValue();
            const reqTextsList = reqText.split("\n");
            if(reqTextsList.length === 4) {
                console.log(`${reqTextsList[1]} ${reqTextsList[3]}`)
                calculatedPostedDate = reqTextsList[3];
            }
            else if(reqTextsList.length === 3) {
                console.log(`${reqTextsList[0]} ${reqTextsList[2]}`)
                calculatedPostedDate = reqTextsList[2];
            }
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            
            // const dayAgoPart = parts.find(part => part.includes('day ago'));

            // below await eachArticle.$('div[data-href]') is used for getting container which has dats-href attribute to get navigation links to actual website
            const divElement = await eachArticle.$('div[data-href]');
            const dataHrefValue = await divElement.evaluateHandle(div => div.getAttribute('data-href'));
            const linkValue = await dataHrefValue.jsonValue();

            // all vallues like authorName , title , publicationDate , navigationLinks , profile imageurls of author are stores in an object
            eachArticleInfoObj = {"id" : uuidv4() ,"authorName" : authorNameText , "title" : highlightTextContent , "navigationLink" : linkValue , "profileImgUrl" : extractedProfileImgUrl , "postedDetails" : calculatedPostedDate};
            console.log(eachArticleInfoObj)
            scrapedDataList.push(eachArticleInfoObj)

        }
        // console.log("getting authors");
    }
    catch(e) {
        console.log(e.message)
        return {ok : false , scrapedDataList}
    }


    // here , if the above statements make any failures , then the below object is sent as return value which is used in serv side
    await browser.close();
    if(scrapedDataList.length === 0) {
        return {ok : false , scrapedDataList}
    }
    return {ok : true , scrapedDataList}
}



// obtainedScrapedDataList = startScraping("mern stack future trends");
// console.log(obtainedScrapedDataList)


// getDateTimeOfPublish("1 day ago");
// getDateTimeOfPublish("3 hours ago");
// getDateTimeOfPublish("3 months ago");


module.exports = {startScraping}
// startScraping function is exported

