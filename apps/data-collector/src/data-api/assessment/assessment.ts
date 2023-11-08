import {
  VisionCardDataSource,
  VisionCardHTMLDataSource,
} from "../vision-property-card/property-card";

import type { Assessment } from "database/generated/prisma-client";

export interface AssessmentDataSource {
  fetchAssessments(parcelId: string): Promise<Assessment[] | undefined>;
}

export class AssessmentHTMLDataSource implements AssessmentDataSource {
  mapDataRowToAssessment(parcelId: string, dataRow: string[]): Assessment {
    return {
      parcelId: parcelId,
      year: parseInt(dataRow[0].replace("$", "").replace(/,/g, "")),
      improvements: parseInt(dataRow[1].replace("$", "").replace(/,/g, "")),
      land: parseInt(dataRow[2].replace("$", "").replace(/,/g, "")),
      total: parseInt(dataRow[3].replace("$", "").replace(/,/g, "")),
    };
  }

  async fetchAssessments(parcelId: string): Promise<Assessment[] | undefined> {
    const cardSource: VisionCardDataSource = new VisionCardHTMLDataSource();

    // get data from card
    return await cardSource.fetchPage(parcelId).then(($) => {
      // if no page was found, return undefined
      if ($ === undefined) {
        return undefined;
      }

      // get current assessment
      let currentData: string[] = [];
      const currentAssessmentRow = $(
        "#MainContent_grdCurrentValueAsmt>tbody td"
      );
      // read tds
      currentAssessmentRow.each((i, e) => {
        currentData.push($(e).text().trim());
      });

      const currentAssessment = this.mapDataRowToAssessment(
        parcelId,
        currentData
      );

      // get past assessments
      const pastData: string[][] = [];
      const pastAssessmentRows = $(
        "#MainContent_grdHistoryValuesAsmt>tbody>tr:not(.HeaderStyle)"
      );
      // read rows from the table
      pastAssessmentRows.each((i, e) => {
        let currentData: string[] = [];
        // read td from the row
        $(e).find("td, th").each((i, e) => {
          currentData.push($(e).text().trim());
        });
        pastData.push(currentData);
      });

      const pastAssessments: Assessment[] = pastData.map((row) => {
        console.log(row);
        return this.mapDataRowToAssessment(parcelId, row);
      });

      // add current assessment to past assessments (technically now, pastAssessments should be allAssessments)
      pastAssessments.unshift(currentAssessment);

      // return all as list
      return pastAssessments;
    });
  }
}
