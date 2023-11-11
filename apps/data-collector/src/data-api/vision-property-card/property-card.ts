import axios, { AxiosError, AxiosResponse } from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import * as https from "https";
import FormData from "form-data";

export interface VisionCardDataSource {
  fetchPage(parcelId: string): Promise<CheerioAPI | undefined>;
}

export class VisionCardHTMLDataSource implements VisionCardDataSource {
  agent = new https.Agent({
    rejectUnauthorized: false,
  });

  async fetchPage(parcelId: string): Promise<CheerioAPI | undefined> {
    // metadata
    const BaseURL = "https://gis.vgsi.com/worcesterma/";
    const SearchURL = "https://gis.vgsi.com/worcesterma/Search.aspx";

    // determine the necessary search paramters for the POST request of the search endpoint
    const searchParams = await axios({
      url: SearchURL,
      method: "get",
      httpsAgent: this.agent,
    }).then((res) => {
      const $ = cheerio.load(res.data);
      return {
        __VIEWSTATE: $("#form1 #__VIEWSTATE").val(),
        __VIEWSTATEENCRYPTED: $("#form1 #__VIEWSTATEENCRYPTED").val(),
        __EVENTVALIDATION: $("#form1 #__EVENTVALIDATION").val(),
        ctl00$MainContent$txtSearchAcctNum: parcelId,
        ctl00$MainContent$ddlSearchSource: 2,
        ctl00$MainContent$btnSubmit: "Search",
      };
    });

    const bodyFormData = new FormData();
    for (const [key, value] of Object.entries(searchParams)) {
      bodyFormData.append(key, value);
    }

    // conduct the search using parameters, and locate the entry (there must only be 1 match)
    const parcelParam = await axios({
      url: SearchURL,
      method: "post",
      httpsAgent: this.agent,
      data: searchParams,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        const $ = cheerio.load(res.data);
        const links = $("#MainContent_grdSearchResults>tbody a");
        if (links.length === 1) {
          return links.attr("href");
        } else {
          throw new Error(
            `There was no exact match for the parcel ID: ${parcelId}`
          );
        }
      })
      .catch((err) => {
        return undefined;
      });

    if (parcelParam === undefined) {
      // did not find parcel
      return undefined;
    }

    // get data from card
    return await axios({
      url: `${BaseURL}/${parcelParam}`,
      method: "get",
      httpsAgent: this.agent,
    }).then((res) => {
      const $ = cheerio.load(res.data);
      // verify the parcel id matches
      const trueParcelId = $("#MainContent_lblAcctNum").text();
      if (trueParcelId !== parcelId) {
        return undefined;
      }
      return $;
    });
  }
}
