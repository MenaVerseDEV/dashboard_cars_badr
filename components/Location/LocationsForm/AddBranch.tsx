import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import {
  useAddBranchMutation,
  useUpdateBranchMutation,
} from "@/redux/features/location/locationApi";
import { Ibranch } from "@/types/location";

type Props = {
  children: React.ReactNode;
  cityId?: string;
  branchId?: string;
  branchData?: Ibranch;
};

function AddBranch({ children, branchId, branchData, cityId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [branch, setBranch] = useState({
    branchNameEn: branchData?.branchName.en ?? "",
    branchNameAr: branchData?.branchName.ar ?? "",
    cityId: cityId ?? "",
    addressEn: branchData?.address.en ?? "",
    addressAr: branchData?.address.ar ?? "",
    location: branchData?.location ?? "",
  });

  const [addBranch, { isLoading: addBranchLoading }] = useAddBranchMutation();
  const [updateBranch, { isLoading: updateBranchLoading }] =
    useUpdateBranchMutation();

  const handleSaveBranch = async () => {
    handleReqWithToaster(
      branchId ? "جاي تعديل الفرع" : "جاي إضافة الفرع",
      async () => {
        if (branchId)
          await updateBranch({
            id: branchId,
            branch: {
              branchName: {
                ar: branch.branchNameAr,
                en: branch.branchNameEn,
              },
              cityId: branch.cityId,
              address: {
                ar: branch.addressAr,
                en: branch.addressEn,
              },
              location: branch.location,
            },
          }).unwrap();
        else
          await addBranch({
            branchName: {
              ar: branch.branchNameAr,
              en: branch.branchNameEn,
            },
            cityId: branch.cityId,
            address: {
              ar: branch.addressAr,
              en: branch.addressEn,
            },
            location: branch.location,
          }).unwrap();

        setIsOpen(false);
        setBranch({
          branchNameEn: "",
          branchNameAr: "",
          cityId: "",
          addressEn: "",
          addressAr: "",
          location: "",
        });
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-start mt-6">فرع جديد</DialogTitle>
          <DialogDescription className="text-start">
            املأ التفاصيل أدناه وانقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveBranch();
          }}
        >
          <div>
            <Label htmlFor="branchNameEn">Branch Name (English)</Label>
            <Input
              id="branchNameEn"
              value={branch.branchNameEn}
              onChange={(e) =>
                setBranch({ ...branch, branchNameEn: e.target.value })
              }
              placeholder="Enter branch name in English"
            />
          </div>
          <div>
            <Label htmlFor="branchNameAr">اسم الفرع</Label>
            <Input
              id="branchNameAr"
              value={branch.branchNameAr}
              onChange={(e) =>
                setBranch({ ...branch, branchNameAr: e.target.value })
              }
              placeholder="أدخل اسم الفرع بالعربية"
              dir="rtl"
            />
          </div>
          {/* <div>
            <Label htmlFor="cityId">City ID</Label>
            <Input
              id="cityId"
              value={branch.cityId}
              onChange={(e) => setBranch({ ...branch, cityId: e.target.value })}
              placeholder="Enter city ID"
            />
          </div> */}
          <div>
            <Label htmlFor="addressEn">Address (English)</Label>
            <Input
              id="addressEn"
              value={branch.addressEn}
              onChange={(e) =>
                setBranch({ ...branch, addressEn: e.target.value })
              }
              placeholder="Enter address in English"
            />
          </div>
          <div>
            <Label htmlFor="addressAr">العنوان</Label>
            <Input
              id="addressAr"
              value={branch.addressAr}
              onChange={(e) =>
                setBranch({ ...branch, addressAr: e.target.value })
              }
              placeholder="أدخل العنوان بالعربية"
              dir="rtl"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="location">لينك الموقع</Label>
            <Input
              id="location"
              value={branch.location}
              onChange={(e) =>
                setBranch({ ...branch, location: e.target.value })
              }
              placeholder="ادخل لينك الموقع"
            />
          </div>
          <DialogFooter className="col-span-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              إلغاء
            </Button>
            <Button disabled={addBranchLoading || updateBranchLoading}>
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddBranch;

