import { IDescription } from "../models/IDescription";
import { ITitle } from "../models/ITitle";
import { $host } from "./index";

interface IMockData {
  descriptions: IDescription[];
  titles: ITitle[];
}

export const fetchMockAPI = async (): Promise<IMockData> => {
  const { data } = await $host.get("6102c1b2-254f-4b7c-addb-67d4df752866");
  return data.reference;
};
