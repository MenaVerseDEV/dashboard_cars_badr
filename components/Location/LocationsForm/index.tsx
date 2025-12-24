"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, Plus } from "lucide-react";

import TreeView from "./tree-view";
import TreeViewSkeleton from "./tree-view-skeleton";
import { AddCity } from "./AddCity";
import { useGetAllBranchesQuery } from "@/redux/features/location/locationApi";

export default function LocationsForm() {
  const [language, setLanguage] = useState<"en" | "ar">("ar");
  const { data: branchesData, isLoading: branchesLoading } =
    useGetAllBranchesQuery();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          >
            <Languages className="h-4 w-4 mr-2" />
            {language === "en" ? "العربية" : "English"}
          </Button>
        </div>
      </div>

      <Card className="mb-6" dir={language === "en" ? "ltr" : "rtl"}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">
              {language === "en" ? "Cities" : "المدن"}
            </h3>
            <AddCity>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {language === "en" ? "Add City" : "اضافة مدينة"}
              </Button>
            </AddCity>
          </div>

          {branchesData?.data?.cities?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {language === "en"
                ? "No cities added yet. Click the 'Add city' button to get started."
                : "لم تتم إضافة مدن بعد. انقر على زر 'إضافة مدن' للبدء."}
            </div>
          )}

          {/* {viewMode === "tree" ? ( */}
          {branchesLoading ? (
            <TreeViewSkeleton />
          ) : (
            <TreeView
              branchesData={branchesData?.data?.cities ?? []}
              language={language}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

