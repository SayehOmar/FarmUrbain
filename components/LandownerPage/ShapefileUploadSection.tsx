import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ShapefileUploadSectionProps {
  handleShapefileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ShapefileUploadSection: React.FC<ShapefileUploadSectionProps> = ({
  handleShapefileUpload,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3">📂 Upload Shapefile</h3>
      <p className="text-sm text-gray-600 mb-3">
        Already have your land boundaries in a shapefile? Upload it here.
      </p>

      <Label
        htmlFor="shapefile"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Shapefile (.shp, .shx, .dbf)
      </Label>
      <Input
        id="shapefile"
        type="file"
        onChange={handleShapefileUpload}
        accept=".shp,.shx,.dbf"
        multiple
        className="block w-full text-sm text-gray-500 
          file:mr-4 file:py-2 file:px-4 
          file:rounded-lg file:border-0 
          file:text-sm file:font-semibold 
          file:bg-green-700 file:text-white 
          hover:file:bg-green-800 
          file:cursor-pointer
          cursor-pointer"
      />
      <p className="text-xs text-gray-500 mt-2">
        You can select multiple files (.shp, .shx, .dbf, .prj)
      </p>
    </div>
  );
};

export default ShapefileUploadSection;
