import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFrappeGetDoc, useSWRConfig } from "frappe-react-sdk";
import { Button } from "@/components/ui/button";
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

const QualityInspectionDetail = () => {
  const { id } = useParams(); // URL'den kalite kontrol ID'sini al
  const { mutate } = useSWRConfig();
  const { data: qualityInspection, error } = useFrappeGetDoc(
    "Quality Inspection",
    id
  );
  const [updatedReadings, setUpdatedReadings] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Submit durumunu takip etmek için state

  const allAccepted = updatedReadings.every(
    (reading) => reading.status === "Accepted"
  );

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

  // Quality Inspection verileri yüklendiğinde readings'i ayarla
  useEffect(() => {
    if (qualityInspection) {
      setUpdatedReadings(qualityInspection.readings);
    }
  }, [qualityInspection]);

  // Quality Inspection güncelleme fonksiyonu
  const updateQualityInspectionStatus = async (readingIndex, newStatus) => {
    try {
      const updated = [...updatedReadings];
      updated[readingIndex].status = newStatus; // Status'u güncelle
      updated[readingIndex].reading_value = "Doğru Değer"; // Reading Value alanını güncelle

      // Eğer tüm readings öğeleri "Accepted" ise, Quality Inspection durumunu "Accepted" yap
      const allAccepted = updated.every(
        (reading) => reading.status === "Accepted"
      );
      const payload = {
        readings: updated,
        status: allAccepted ? "Accepted" : "Rejected", // Tüm öğeler "Accepted" ise "Accepted", aksi halde "Rejected"
      };

      setUpdatedReadings(updated);

      // API'ye güncellenmiş verileri gönder
      const response = await fetch(`/api/resource/Quality Inspection/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Güncelleme başarısız: " + response.statusText);
      }

      const data = await response.json();
      console.log("Quality Inspection başarıyla güncellendi:", data);
      mutate(`api/resource/Quality Inspection/${id}`); // Doğru anahtarla mutate çağır
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  // Quality Inspection submit etme fonksiyonu
  const submitQualityInspection = async () => {
    try {
      // API'ye submit isteği gönder
      const response = await fetch(`/api/resource/Quality Inspection/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docstatus: 1 }), // docstatus: 1 olarak ayarla
      });

      if (!response.ok) {
        throw new Error("Submit işlemi başarısız: " + response.statusText);
      }

      const data = await response.json();

      setIsSubmitted(true); // Submit işlemi tamamlandığında durumu güncelle
      mutate(`api/resource/Quality Inspection/${id}`); // Doğru anahtarla mutate çağır
    } catch (error) {
      console.error("Submit hatası:", error);
    }
  };

  // Hata veya yükleniyor durumu
  if (error) return <div>Veriler yüklenirken bir hata oluştu.</div>;
  if (!qualityInspection) return <div>Yükleniyor...</div>;

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
                    {updatedReadings.map((reading, index) => (
                      <p key={index}>
                        {reading.specification}
                        <input
                          type="checkbox"
                          checked={reading.status === "Accepted"}
                          onChange={(e) =>
                            updateQualityInspectionStatus(
                              index,
                              e.target.checked ? "Accepted" : "Rejected"
                            )
                          }
                        />
                      </p>
                    ))}
                    <Button
                      onClick={submitQualityInspection}
                      disabled={isSubmitted}
                    >
                      {isSubmitted ? "Submitted" : "Submit"}
                    </Button>{" "}
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
      {/* <p>
        <strong>Name:</strong> {qualityInspection.name}
      </p>
      <p>
        <strong>Inspection Type:</strong> {qualityInspection.inspection_type}
      </p>
      <p>
        <strong>Reference Type:</strong> {qualityInspection.reference_type}
      </p>
      <p>
        <strong>Reference Name:</strong> {qualityInspection.reference_name}
      </p>
      <p>
        <strong>Item Code:</strong> {qualityInspection.item_code}
      </p>
      <p>
        <strong>Sample Size:</strong> {qualityInspection.sample_size}
      </p>
      <ul>
        {updatedReadings.map((reading, index) => (
          <li key={index}>
            <strong>Parameter:</strong> {reading.specification}
            <input
              type="checkbox"
              checked={reading.status === "Accepted"}
              onChange={(e) =>
                updateQualityInspectionStatus(
                  index,
                  e.target.checked ? "Accepted" : "Rejected"
                )
              }
            />
            <strong>Status:</strong> {reading.status}
          </li>
        ))}
      </ul>
      <Button onClick={submitQualityInspection} disabled={isSubmitted}>
        {isSubmitted ? "Submitted" : "Submit"}
      </Button>{" "} */}
      {/* Submit butonu */}
    </div>
  );
};

export default QualityInspectionDetail;
