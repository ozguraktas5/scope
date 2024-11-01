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

const OzerpanSalesOrderDetail = () => {
  const { id } = useParams(); // URL'den kalite kontrol ID'sini al
  const { mutate } = useSWRConfig();

  const { data: salesOrder } = useFrappeGetDoc("Sales Order");

  console.log(salesOrder);

  const [updatedReadings, setUpdatedReadings] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Submit durumunu takip etmek için state

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

  return (
    <div className="flex flex-col min-h-screen h-full m-4">
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
      </div>
    </div>
  );
};

export default OzerpanSalesOrderDetail;
