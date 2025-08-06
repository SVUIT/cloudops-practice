import { useEffect, useState } from "react";
import type { Card } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Card>) => Promise<void>;
  defaultValues?: Partial<Card>;
  isEditMode?: boolean;
}

function CardFormModal({
  isOpen,
  onClose,
  onSave,
  defaultValues = {},
  isEditMode = false,
}: Props) {
  const [formData, setFormData] = useState<Partial<Card>>({
    content: "",
    subjectName: "",
    semester: "",
  });

  useEffect(() => {
    if (defaultValues) {
      setFormData((prevData) => {
        const newData = {
          content: defaultValues.content || "",
          subjectName: defaultValues.subjectName || "",
          semester: defaultValues.semester || "",
        };

        const isSame =
          prevData.content === newData.content &&
          prevData.subjectName === newData.subjectName &&
          prevData.semester === newData.semester;

        if (!isSame) return newData;
        return prevData; 
      });
    }
  }, [
    defaultValues?.content,
    defaultValues?.subjectName,
    defaultValues?.semester,
  ]);

  const handleSubmit = async () => {
    if (!formData.content?.trim()) return;
    await onSave(formData);
    onClose();
    setFormData({ content: "", subjectName: "", semester: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 flex justify-center items-center z-50">
      <div className="bg-[#2B2B39] p-6 rounded-xl shadow-lg w-[90%] max-w-md space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-left text-white mb-4">
            {isEditMode ? "Edit Card" : "Add New Card"}
          </h2>
          <hr className="mt-2 border-gray-500" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Content *</label>
            <input
              type="text"
              placeholder="Content"
              className="w-full p-2 border rounded bg-[#1F1D29] text-white mt-2"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Name of subject</label>
            <input
              type="text"
              placeholder="Name of subject"
              className="w-full p-2 border rounded bg-[#1F1D29] text-white mt-2"
              value={formData.subjectName}
              onChange={(e) =>
                setFormData({ ...formData, subjectName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Semester</label>
            <input
              type="text"
              placeholder="Semester"
              className="w-full p-2 border rounded bg-[#1F1D29] text-white mt-2"
              value={formData.semester}
              onChange={(e) =>
                setFormData({ ...formData, semester: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-10">
          <button
            className="px-4 py-2 border border-gray-500 bg-[#3A374A] rounded hover:bg-gray-400 text-white"
            onClick={() => {
              setFormData({ content: "", subjectName: "", semester: "" });
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 border border-gray-500 bg-[#238636] text-white rounded hover:bg-[#55B37A]"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardFormModal;
