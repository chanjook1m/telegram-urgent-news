const request = require("request-promise");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

const url =
  "https://finance.naver.com/news/news_list.nhn?mode=LSS2D&section_id=101&section_id2=258";

function Req(req) {
  this.req = req;
  this.link = "";
}

Req.prototype.getNews = async function() {
  await request(
    { uri: url, encoding: null, responseType: "arrayBuffer" },
    (err, res, body) => {
      if (err) throw err;
      const contents = iconv.decode(body, "EUC-KR").toString();
      const $ = cheerio.load(contents);

      this.link = $("dd.articleSubject")
        .children()
        .first()
        .attr("href");

      //console.log(this.link);
    }
  );
  return "https://finance.naver.com/" + this.link; //"https://finance.naver.com/"
};

module.exports = Req;
