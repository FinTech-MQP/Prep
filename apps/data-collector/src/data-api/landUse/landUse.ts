import axios from "axios";
import type { LandUse } from "database/generated/prisma-client";
import * as https from "https";

export interface LandUseDataSource {
  fetchLandUse(landUseId: string): Promise<LandUse | undefined>;
}

type GetDataForLegendResult = {
  Code: string;
  CodeDescription: string;
};

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export class LandUseAPIDataSource implements LandUseDataSource {
  async fetchLandUse(landUseId: string): Promise<LandUse | undefined> {
    {
      return await axios({
        method: "post",
        url: "https://gis.vgsi.com/worcesterma/async.asmx/GetDataForLegend",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          inType: "Land",
        },
        httpsAgent: agent,
      })
        .then((res) => {
          const data = res.data.d as Array<GetDataForLegendResult>;
          const result = data.find((t) => t.Code === landUseId);
          if (result === undefined) return result;
          return {
            id: landUseId,
            landUseDesc: result.CodeDescription,
          };
        })
        .catch((err) => {
          return undefined;
        });
    }
  }
}
