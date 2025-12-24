import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import type { IBranches } from "@/types/location";
import {
  useDeleteBranchMutation,
  useDeleteCityMutation,
} from "@/redux/features/location/locationApi";
import { AddCity } from "./AddCity";
import AddBranch from "./AddBranch";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

interface TreeViewProps {
  branchesData: IBranches[];
  language: "en" | "ar";
}

export default function TreeView({ branchesData, language }: TreeViewProps) {
  const [deleteCity, { isLoading: deleteCityLoading }] =
    useDeleteCityMutation();
  const [deleteBranch, { isLoading: deleteBranchLoading }] =
    useDeleteBranchMutation();

  return (
    <div className="space-y-4">
      {branchesData?.map((location) => (
        <Accordion
          type="single"
          collapsible
          key={location?.id}
          className="rounded-lg border"
        >
          <AccordionItem value="city" className="border-none">
            <div className="flex items-center justify-between px-4">
              <AccordionTrigger className="py-4  ">
                <span className="font-medium">
                  {language === "en"
                    ? location?.name?.en || "Unnamed City"
                    : location?.name?.ar || "مدينة بدون اسم"}
                </span>
              </AccordionTrigger>
              <div className="flex gap-2">
                {/* Update city */}
                <AddCity cityId={location?.id} name={location?.name}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </AddCity>
                {/* Delete city */}
                <DeleteDialog
                  id={location?.id}
                  title="هل متاكد من هذف المدن؟"
                  deleteFunction={deleteCity}
                  isDeleting={deleteCityLoading}
                />
              </div>
            </div>
            <AccordionContent className="px-4 pb-4 pt-0 pl-8">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {language === "en" ? "Branches" : "الفروع"}
                </h4>
                <AddBranch cityId={location?.id}>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    {language === "en" ? "Add Branch" : "إضافة فرع"}
                  </Button>
                </AddBranch>
              </div>

              {location?.branches?.length === 0 && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  {language === "en"
                    ? "No branches have been added."
                    : "لم تتم إضافة فروع ."}
                </div>
              )}

              <div className="space-y-3">
                {location?.branches?.map((branch: any) => (
                  <Accordion
                    type="single"
                    collapsible
                    key={branch?.id}
                    className="rounded-lg border"
                  >
                    <AccordionItem value="branch" className="border-none">
                      <div className="flex items-center justify-between px-3">
                        <AccordionTrigger className="py-3  ">
                          <span className="font-medium">
                            {language === "en"
                              ? branch.branchName?.en || "Unnamed Branch"
                              : branch.branchName?.ar || "فرع بدون اسم"}
                          </span>
                        </AccordionTrigger>
                        <div className="flex gap-2">
                          <AddBranch
                            cityId={location?.id}
                            branchId={branch?.id}
                            branchData={branch}
                          >
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </AddBranch>
                          <DeleteDialog
                            id={branch?.id}
                            title="هل متاكد من هذف الفرع؟"
                            deleteFunction={deleteBranch}
                            isDeleting={deleteBranchLoading}
                          />
                        </div>
                      </div>
                      <AccordionContent className="px-3 pb-3 pt-0 pl-8">
                        <div className="space-y-5 rounded-md border p-2.5">
                          <p className="flex items-center gap-2">
                            <span className="font-bold">العنوان:</span>
                            <span>{branch?.address[language]}</span>
                          </p>
                          <div className="flex items-center gap-2 w-full">
                            <iframe
                              src={branch.location}
                              className="w-full"
                              height="450"
                              allowFullScreen
                              loading="lazy"
                            ></iframe>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}

