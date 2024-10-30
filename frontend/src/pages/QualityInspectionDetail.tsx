import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk";

const QualityInspectionDetail = () => {
  const { id } = useParams(); // URL'den kalite kontrol ID'sini al
  const {
    data: qualityInspection,
    error,
    mutate,
  } = useFrappeGetDoc("Quality Inspection", id);

  useEffect(() => {
    console.log("Açılan kalite kontrol ID'si:", id);
    if (qualityInspection) {
      console.log("Quality Inspection Detayları:", qualityInspection);
    }
  }, [id, qualityInspection]);

  const saveQualityInspection = async (
    qualityInspectionId,
    updatedReadings
  ) => {
    try {
      const payload = {
        doc: JSON.stringify({
          doctype: "Quality Inspection",
          name: qualityInspectionId,
          inspection_type:
            qualityInspection?.inspection_type || "Random Inspection", // Zorunlu alan
          reference_type:
            qualityInspection?.reference_type || "Material Request", // Zorunlu alan
          reference_name: qualityInspection?.reference_name || "REQ-0001", // Zorunlu alan
          item_code: qualityInspection?.item_code || "ITEM-001", // Zorunlu alan
          sample_size: qualityInspection?.sample_size || 5, // Zorunlu alan
          readings: updatedReadings,
          inspected_by: "ozguraktas.55555@gmail.com", // ERPNext'te mevcut bir kullanıcı
        }),
        action: "Save", // Gerekli 'action' parametresi
      };

      const response = await fetch(
        "/api/method/frappe.desk.form.save.savedocs",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save Quality Inspection: " + response.statusText
        );
      }

      const data = await response.json();
      console.log("Quality Inspection updated successfully:", data);
    } catch (error) {
      console.error("Error updating Quality Inspection:", error);
    }
  };

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
        {qualityInspection.readings.map((reading: any, index: any) => (
          <li key={index}>
            <strong>Specification:</strong> {reading.specification}
            <input
              type="checkbox"
              checked={reading.status === "Accepted"}
              onChange={(e) => saveQualityInspection(index, e.target.checked)}
            />
            <strong>Status:</strong> {reading.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QualityInspectionDetail;
