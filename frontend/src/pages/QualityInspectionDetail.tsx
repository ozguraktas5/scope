import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFrappeGetDoc } from "frappe-react-sdk";

const QualityInspectionDetail = () => {
  const { id } = useParams(); // URL'den kalite kontrol ID'sini al
  const { data: qualityInspection, error } = useFrappeGetDoc(
    "Quality Inspection",
    id
  );

  useEffect(() => {
    console.log("Açılan kalite kontrol ID'si:", id);
    if (qualityInspection) {
      console.log("Quality Inspection Detayları:", qualityInspection);
    }
  }, [id, qualityInspection]);

  if (error) return <div>Veriler yüklenirken bir hata oluştu.</div>;
  if (!qualityInspection) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h1>Quality Inspection Detayları</h1>
      <p>
        <strong>ID:</strong> {qualityInspection.name}
      </p>
      <p>
        <strong>Inspection Type:</strong> {qualityInspection.inspection_type}
      </p>
      <p>
        <strong>Item Code:</strong> {qualityInspection.item_code}
      </p>

      <h2>Readings</h2>
      <ul>
        {qualityInspection.readings.map((reading, index) => (
          <li key={index}>
            <strong>Specification:</strong> {reading.specification} -
            <strong>Status:</strong> {reading.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QualityInspectionDetail;
