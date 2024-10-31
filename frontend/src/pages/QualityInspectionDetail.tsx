import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFrappeGetDoc, useSWRConfig } from "frappe-react-sdk";
import { Button } from "@/components/ui/button";

const QualityInspectionDetail = () => {
  const { id } = useParams(); // URL'den kalite kontrol ID'sini al
  const { mutate } = useSWRConfig();
  const { data: qualityInspection, error } = useFrappeGetDoc(
    "Quality Inspection",
    id
  );
  const [updatedReadings, setUpdatedReadings] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Submit durumunu takip etmek için state

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
      console.log("Quality Inspection başarıyla submit edildi:", data);
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
    <div>
      <h1>Quality Inspection Details</h1>
      <p>
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
      <h2>Readings</h2>
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
      </Button>{" "}
      {/* Submit butonu */}
    </div>
  );
};

export default QualityInspectionDetail;
