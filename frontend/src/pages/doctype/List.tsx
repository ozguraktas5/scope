import useDoctypeMeta from "@/hooks/useDoctypeMeta";
import { useFrappeGetDocList } from "frappe-react-sdk";
import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import "@glideapps/glide-data-grid/dist/index.css";
import { DataEditor, GridCell, GridCellKind, Item } from "@glideapps/glide-data-grid"

const LAYOUT_FIELD_TYPES = [
  "Tab Break",
  "Section Break",
  "Column Break",
  "Button",
  "HTML",
  "Image",
  "Fold",
  "Table",
  "Table Multiselect",
];

const List = () => {
  const { doctype } = useParams();

  const { doctypeMeta, isLoading } = useDoctypeMeta(doctype);

  const columns = useMemo(() => {
    if (doctypeMeta) {
      const fields = [];

      for (const field of doctypeMeta.fields) {
        if (field.hidden) continue;
        if (LAYOUT_FIELD_TYPES.includes(field.fieldtype)) continue;

        fields.push({
          id: field.fieldname,
          title: field.label,
        });
      }
      return fields
    } else {
      return [];
    }
  }, [doctypeMeta]);

  const { data } = useFrappeGetDocList(doctype, {
    fields: columns.map((col) => col.id)i
  });

  const getCellContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = data?.[row];
    // dumb but simple way to do this
   
    const d = dataRow[columns[col]]
    return {
        kind: GridCellKind.Text,
        allowOverlay: false,
        displayData: d,
        data: d,
    };
}, [data, columns]);

return <DataEditor 
getCellContent={getCellContent} 
columns={columns} 
rows={data?.length ?? 0} 
/>;
};

export default List;
