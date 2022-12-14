const axios = require("axios");
const cheerio = require("cheerio");

async function main() {
    const url = "https://service.berlin.de/terminvereinbarung/termin/tag.php?termin=1&anliegen[]=121591&dienstleisterlist=122210,122217,122219,122227,122231,122238,122243,122252,122260,122262,122254,122271,122273,122277,122280,122282,122284,122291,122285,122286,122296,150230,122294,122312,122314,122304,122311,122309,122281,122283,122279,122276,122274,122267,122246,122251,122257,122208,122226&herkunft=http%3A%2F%2Fservice.berlin.de%2Fdienstleistung%2F121591%2F";

    let cookie = "";
    await axios.get(url, {
        maxRedirects: 0,
    }).then((response) => {
        if (response.data) {
            console.log("RESPONSE:", response.data);
        }
    }).catch((error) => {
        console.log('ERROR', error.response.headers['set-cookie'][0]);
        cookie = error.response.headers['set-cookie'][0];
    });

    await axios.get(url, {
        headers: {
            "Cookie": cookie
        },
        withCredentials: true,
    }).then((response) => {
        if (response.data) {
            const $ = cheerio.load(response.data);
            let $buchbar = $(".buchbar");
            if ($buchbar.get().length > 1) {
                $buchbar.each((i, el) => {
                    console.log("TERMIN VERFÜGBAR AM: ", $(el).text());
                });
            } else {
                console.error("KEIN TERMIN VERFÜGBAR");
            }
        }
    }).catch((error) => {
        console.log('ERROR', error.response);
    });
}


main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        // logging the error message
        console.error(e);

        process.exit(1);
    });