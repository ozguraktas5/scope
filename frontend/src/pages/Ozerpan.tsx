import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SettingsIcon from "@mui/icons-material/Settings";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import React from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";
import { Checkbox } from "@/components/ui/checkbox";

const urunMusteriBilgileri = [
  { label: "Ürün / Müşteri Bilgileri", value: null },
  { label: "Sipariş No:", value: "aaa" },
  { label: "Adet:", value: "aaa" },
  { label: "Müşteri Adı:", value: "aaa" },
  { label: "Teklif:", value: "aaa" },
  { label: "Seri:", value: "aaa" },
  { label: "Renk:", value: "aaa" },
];

const Ozerpan = () => {
  const { data: data1 } = useFrappeGetDocList("Quality Inspection", {
    fields: ["name", "readings.specification", "readings.status"],
    filters: [["name", "=", "MAT-QA-2024-00040"]],
  });

  const allAccepted = data1
    ?.flatMap((item) => item.readings || [])
    .every((reading) => reading.status === "Accepted");

  const { data: data2 } = useFrappeGetDocList("BOM", {
    fields: [
      "name",
      "items.item_code",
      "items.item_name",
      "items.custom_item_group",
    ],
    filters: [["name", "=", "BOM-#12345-006"]],
  });

  const aksesuarItems = data2?.filter(
    (item) => item.custom_item_group === "Aksesuarlar"
  );

  const yardimciMalzemelerItems = data2?.filter(
    (item) => item.custom_item_group === "Yardımcı Malzemeler"
  );

  return (
    <div className="flex flex-col min-h-screen h-full m-4">
      <div className="flex gap-4 items-center mb-3">
        <div>
          <Select>
            <SelectTrigger className="w-[230px] rounded-none bg-gray-100 h-6">
              <SelectValue placeholder="K12345" />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-gray-100">
              <SelectGroup>
                <SelectLabel>A</SelectLabel>
                <SelectItem value="apple">B</SelectItem>
                <SelectItem value="banana">C</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            className="w-[230px] rounded-none bg-gray-100 h-6"
            type="text"
          />
        </div>
        <div className="flex gap-1">
          <div className="flex items-center">
            <ReportProblemIcon
              className="text-orange-500 mr-[-16px] z-10"
              fontSize="large"
            />
            <Select>
              <SelectTrigger className="w-[160px] h-6 rounded-none bg-gray-100 ps-6">
                <SelectValue placeholder="HATA BİLDİR" />
              </SelectTrigger>
              <SelectContent className="rounded-none bg-gray-100">
                <SelectGroup>
                  <SelectItem value="cizik-kirik">ÇİZİK - KIRIK</SelectItem>
                  <SelectItem value="kaynak-hatasi">KAYNAK HATASI</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <SettingsIcon
              className="text-black mr-[-16px] z-10"
              fontSize="large"
            />
            <Button className="w-[150px] rounded-none bg-gray-100 text-black h-6 ps-6">
              MAKİNE ARIZASI
            </Button>
          </div>
          <div className="flex items-center">
            <AccessAlarmIcon
              className="text-blue-500 mr-[-16px] z-10"
              fontSize="large"
            />
            <Button className="w-[150px] rounded-none bg-gray-100 text-black h-6 ps-6">
              MOLA
            </Button>
          </div>
          <div className="flex items-center">
            <ExitToAppIcon
              className="text-red-500 mr-[-16px] z-10"
              fontSize="large"
            />
            <Button className="w-[150px] rounded-none bg-gray-100 text-black h-6 ps-6">
              ÇIKIŞ
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-grow gap-2">
        <div className="flex w-1/4 flex-col gap-3 overflow-auto">
          <div className=" flex-1 bg-gray-100 p-4 border border-slate-300">
            <ul>
              {urunMusteriBilgileri.map((item, index) => (
                <React.Fragment key={index}>
                  <li className="text-red-600 font-bold text-sm">
                    {item.label}
                  </li>
                  {item.value && <li className="text-sm">{item.value}</li>}
                </React.Fragment>
              ))}
            </ul>
          </div>
          <div>
            <div className=" border border-slate-300 w-full bg-gray-100">
              <div>
                <div>
                  <div>
                    <div className="w-[150px] text-black bg-orange-400 text-sm text-center">
                      AÇIKLAMA
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-5 p-2"></div>
            </div>
          </div>
        </div>

        <div className="w-1/3 bg-amber-100 border border-slate-300">aaaaa</div>

        <div className="flex-1">
          <div className="flex h-1/3">
            <div className="border border-slate-300 w-full bg-gray-100">
              <div className=" border border-slate-300 w-full bg-gray-100">
                <div>
                  {allAccepted ? (
                    <div className="text-white bg-green-700 text-sm text-center">
                      BAŞARILI <CheckIcon className="text-white" />
                    </div>
                  ) : (
                    <div className="text-white bg-red-700 text-sm text-center">
                      BAŞARISIZ <ClearIcon className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex gap-5 p-2">
                  <div>
                    {data1?.map((item, index) => (
                      <div
                        key={index}
                        className="text-sm flex items-center gap-3"
                      >
                        {item.specification}
                        <Checkbox />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-1/3">
            <div className=" border border-slate-300 w-full bg-gray-100">
              <div>
                <div>
                  <div>
                    <div className="w-[150px] text-black bg-orange-400 text-sm text-center">
                      AKSESUARLAR
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-5 p-2">
                <div>
                  {aksesuarItems?.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm">
                      <tr>
                        <td>{item.item_code}</td>
                      </tr>
                    </div>
                  ))}
                </div>
                <div>
                  {aksesuarItems?.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm">
                      <tr>
                        <td>{item.item_name}</td>
                      </tr>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-1/3">
            <div className=" border border-slate-300 w-full bg-gray-100">
              <div>
                <div>
                  <div>
                    <div className="w-[200px] text-black bg-orange-400 text-sm text-center">
                      YARDIMCI MALZEMELER
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-5 p-2">
                <div>
                  {yardimciMalzemelerItems?.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm">
                      {item.item_code}
                    </div>
                  ))}
                </div>
                <div>
                  {yardimciMalzemelerItems?.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm">
                      {item.item_name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ozerpan;
